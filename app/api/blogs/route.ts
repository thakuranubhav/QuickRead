import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Blog } from "@/lib/models/Blog";
import { verifyAuthToken } from "@/lib/auth";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

async function ensureUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let counter = 1;
  while (await Blog.exists({ slug })) {
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
  return slug;
}

function readCookie(headerValue: string, cookieName: string) {
  const pairs = headerValue.split(";").map((part) => part.trim());
  const cookie = pairs.find((part) => part.startsWith(`${cookieName}=`));
  if (!cookie) return undefined;
  return decodeURIComponent(cookie.slice(cookieName.length + 1));
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);

    const limit = Number(searchParams.get("limit") ?? 50);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const filter: Record<string, any> = {};
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await Blog.find(filter)
      .sort({ publishDate: -1 })
      .limit(Number.isFinite(limit) ? limit : 50)
      .lean();

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const contentType = request.headers.get("content-type") ?? "";
    let title = "";
    let author = "";
    let category = "";
    let content = "";
    let tags: string | string[] = "";
    let publishDate = "";
    let imageUrl: string | undefined;
    let imageFilename: string | undefined;
    let imageMimeType: string | undefined;
    let imageSizeBytes: number | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      title = String(formData.get("title") ?? "").trim();
      author = String(formData.get("author") ?? "").trim();
      category = String(formData.get("category") ?? "").trim();
      content = String(formData.get("content") ?? "").trim();
      tags = String(formData.get("tags") ?? "");
      publishDate = String(formData.get("publishDate") ?? "").trim();

      const file = formData.get("image");
      if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json({ error: "Please upload a cover image." }, { status: 400 });
      }

      if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
      }

      const maxBytes = 5 * 1024 * 1024;
      if (file.size > maxBytes) {
        return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 400 });
      }

      const bytes = Buffer.from(await file.arrayBuffer());
      const safeBase = path
        .basename(file.name)
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9._-]/g, "")
        .toLowerCase();
      const ext = path.extname(safeBase) || ".jpg";
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      await writeFile(path.join(uploadsDir, uniqueName), bytes);

      imageUrl = `/uploads/${uniqueName}`;
      imageFilename = uniqueName;
      imageMimeType = file.type;
      imageSizeBytes = file.size;
    } else {
      const body = await request.json();
      title = String(body?.title ?? "").trim();
      author = String(body?.author ?? "").trim();
      category = String(body?.category ?? "").trim();
      content = String(body?.content ?? "").trim();
      tags = body?.tags ?? "";
      publishDate = String(body?.publishDate ?? "").trim();
      imageUrl = body?.imageUrl ? String(body.imageUrl).trim() : undefined;
    }

    if (!title || !author || !category || !content || !publishDate) {
      return NextResponse.json(
        { error: "Title, author, category, content, and publish date are required." },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get("authorization");
    const cookieToken = readCookie(request.headers.get("cookie") ?? "", "auth_token");
    const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
    const token = bearerToken ?? cookieToken;

    if (!token) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    let authorId: string | undefined;
    let authorName = String(author).trim();

    try {
      const payload = await verifyAuthToken(token);
      if (payload.role !== "admin") {
        return NextResponse.json({ error: "Admin access required." }, { status: 403 });
      }
      authorId = payload.sub;
      authorName = payload.name;
    } catch {
      return NextResponse.json({ error: "Invalid authentication token." }, { status: 401 });
    }

    const baseSlug = slugify(String(title));
    const slug = await ensureUniqueSlug(baseSlug);

    const blog = await Blog.create({
      title,
      slug,
      authorName,
      authorId,
      category,
      imageUrl,
      imageFilename,
      imageMimeType,
      imageSizeBytes,
      content,
      tags: Array.isArray(tags)
        ? tags.map((tag) => String(tag).trim()).filter(Boolean)
        : String(tags)
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
      publishDate: new Date(publishDate),
    });

    return NextResponse.json({ post: blog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create blog." }, { status: 500 });
  }
}
