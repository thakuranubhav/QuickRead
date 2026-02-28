import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { Blog } from "@/lib/models/Blog";
import SiteNavbar from "@/app/components/site-navbar";
import { verifyAuthToken } from "@/lib/auth";
import BlogActions from "./blog-actions";

export const revalidate = 0;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  await connectToDatabase();
  const post = await Blog.findOne({ slug }).lean();

  if (!post) {
    notFound();
  }

  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  let canManage = false;
  const token = (await cookies()).get("auth_token")?.value;
  if (token) {
    try {
      const payload = await verifyAuthToken(token);
      const isAdmin = payload.role === "admin";
      const isAuthor = post.authorId && String(post.authorId) === payload.sub;
      canManage = Boolean(isAdmin || isAuthor);
    } catch {
      canManage = false;
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <SiteNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-6">
          <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
            {post.category}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4">{post.title}</h2>
          <p className="text-sm text-gray-500 mt-2">
            {new Date(post.publishDate).toLocaleDateString()}
          </p>
          {canManage && <BlogActions slug={post.slug} />}
        </div>

        <article className="bg-white rounded-2xl border border-blue-100 p-5 sm:p-7 shadow-sm space-y-5">
          {paragraphs.length > 0
            ? paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-gray-700 leading-7 sm:leading-8">
                  {paragraph}
                </p>
              ))
            : (
              <p className="text-gray-700 leading-7 sm:leading-8">{post.content}</p>
            )}
        </article>

        <div className="mt-8">
          <Link href="/blogs" className="text-blue-700 font-semibold hover:underline">
            Back to Blogs
          </Link>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        (c) {new Date().getFullYear()} QuickRead. All rights reserved.
      </footer>
    </div>
  );
}
