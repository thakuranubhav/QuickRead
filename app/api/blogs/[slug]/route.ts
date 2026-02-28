import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Blog } from "@/lib/models/Blog";
import { verifyAuthToken } from "@/lib/auth";
import { unlink } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    await connectToDatabase();
    const post = await Blog.findOne({ slug }).lean();

    if (!post) {
      return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog." }, { status: 500 });
  }
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

function readCookie(headerValue: string, cookieName: string) {
  const pairs = headerValue.split(";").map((part) => part.trim());
  const cookie = pairs.find((part) => part.startsWith(`${cookieName}=`));
  if (!cookie) return undefined;
  return decodeURIComponent(cookie.slice(cookieName.length + 1));
}

async function ensureUniqueSlug(baseSlug: string, currentId: string) {
  let slug = baseSlug;
  let counter = 1;
  while (await Blog.exists({ slug, _id: { $ne: currentId } })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
  return slug;
}

async function getAuthPayload(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cookieToken = readCookie(request.headers.get("cookie") ?? "", "auth_token");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const token = bearerToken ?? cookieToken;
  if (!token) return null;
  try {
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

export async function PUT(request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    await connectToDatabase();
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const post = await Blog.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    }

    const isAdmin = payload.role === "admin";
    const isAuthor = post.authorId && String(post.authorId) === payload.sub;
    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "You do not have permission to edit this blog." }, { status: 403 });
    }

    const body = await request.json();
    const title = String(body?.title ?? "").trim();
    const category = String(body?.category ?? "").trim();
    const content = String(body?.content ?? "").trim();
    const publishDate = String(body?.publishDate ?? "").trim();
    const tags = body?.tags ?? "";

    if (!title || !category || !content || !publishDate) {
      return NextResponse.json(
        { error: "Title, category, content, and publish date are required." },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title);
    const nextSlug = await ensureUniqueSlug(baseSlug, post._id.toString());

    post.title = title;
    post.slug = nextSlug;
    post.category = category;
    post.content = content;
    post.publishDate = new Date(publishDate);
    post.tags = Array.isArray(tags)
      ? tags.map((tag: string) => String(tag).trim()).filter(Boolean)
      : String(tags)
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);

    await post.save();
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: "Failed to update blog." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteProps) {
  try {
    const { slug } = await params;
    await connectToDatabase();
    const payload = await getAuthPayload(request);
    if (!payload) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const post = await Blog.findOne({ slug });
    if (!post) {
      return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    }

    const isAdmin = payload.role === "admin";
    const isAuthor = post.authorId && String(post.authorId) === payload.sub;
    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ error: "You do not have permission to delete this blog." }, { status: 403 });
    }

    const imageFilename = post.imageFilename;
    await post.deleteOne();

    if (imageFilename) {
      const filePath = path.join(process.cwd(), "public", "uploads", imageFilename);
      await unlink(filePath).catch(() => undefined);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete blog." }, { status: 500 });
  }
}
