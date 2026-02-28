import Link from "next/link";
import { cookies } from "next/headers";
import SiteNavbar from "../components/site-navbar";
import { connectToDatabase } from "@/lib/mongodb";
import { Blog } from "@/lib/models/Blog";
import { verifyAuthToken } from "@/lib/auth";
import { User } from "@/lib/models/User";

export const revalidate = 0;

type BlogListItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  href: string;
  authorName: string;
  imageUrl?: string;
  publishDate: string;
};

async function getBlogs(): Promise<BlogListItem[]> {
  await connectToDatabase();
  const posts = (await Blog.find({})
    .sort({ publishDate: -1 })
    .limit(60)
    .lean()) as unknown as Array<{
    _id: { toString(): string };
    title: string;
    category: string;
    content: string;
    slug: string;
    authorName: string;
    imageUrl?: string;
    publishDate: Date | string;
  }>;

  return posts.map((post) => ({
    id: post._id.toString(),
    title: post.title,
    category: post.category,
    description:
      post.content.length > 170 ? `${post.content.slice(0, 170).trim()}...` : post.content,
    href: `/blogs/${post.slug}`,
    authorName: post.authorName,
    imageUrl: post.imageUrl,
    publishDate: new Date(post.publishDate).toLocaleDateString(),
  }));
}

async function getViewerRole() {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) {
    return { isAuthenticated: false, isAdmin: false };
  }

  try {
    const payload = await verifyAuthToken(token);
    await connectToDatabase();
    const user = await User.findById(payload.sub).lean();
    return { isAuthenticated: true, isAdmin: user?.role === "admin" };
  } catch {
    return { isAuthenticated: false, isAdmin: false };
  }
}

export default async function BlogsPage() {
  const blogPosts = await getBlogs();
  const { isAdmin } = await getViewerRole();
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <SiteNavbar />

      <main className="flex-1 w-full">
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 text-white">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />
          <div className="relative mx-auto max-w-5xl px-6 py-8 sm:py-10 lg:py-14">
            <p className="text-xs uppercase tracking-[0.24em] text-blue-200">QuickRead Journal</p>
            <h1 className="mt-3 text-2xl font-black leading-tight sm:text-4xl lg:text-5xl">
              Stories that explain what matters.
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-blue-100 sm:text-base">
              Curated articles on AI, media, environment, and productivity with practical takeaways.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3 lg:mt-7">
              <Link
                href="/news"
                className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
              >
                Explore News
              </Link>
              {isAdmin && (
                <Link
                  href="/upload-blog"
                  className="rounded-xl border border-cyan-300/40 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                >
                  Upload Blog
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
          {blogPosts.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">No blogs published yet</h2>
              <p className="mt-2 text-sm text-slate-600">
                Publish your first post to populate this space.
              </p>
            </div>
          ) : (
            <>
              {featuredPost && (
                <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="grid lg:grid-cols-[1.1fr_1fr]">
                    <div className="relative h-[50vh] bg-slate-200 sm:h-64 lg:min-h-[360px] lg:h-auto">
                      {featuredPost.imageUrl ? (
                        <img
                          src={featuredPost.imageUrl}
                          alt={featuredPost.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-blue-100 to-cyan-100" />
                      )}
                      <div className="absolute left-4 top-4 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
                        Featured
                      </div>
                    </div>
                    <div className="p-4 sm:p-8">
                      <p className="text-xs uppercase tracking-[0.18em] text-blue-700">
                        {featuredPost.category}
                      </p>
                      <h2 className="mt-3 text-2xl sm:text-3xl font-black leading-tight text-slate-900">
                        {featuredPost.title}
                      </h2>
                      <p className="mt-4 text-sm sm:text-base leading-6 sm:leading-7 text-slate-600 line-clamp-4 sm:line-clamp-none">
                        {featuredPost.description}
                      </p>
                      <p className="mt-4 text-xs text-slate-500">
                        {featuredPost.publishDate} by {featuredPost.authorName}
                      </p>
                      <Link
                        href={featuredPost.href}
                        className="mt-6 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        Read Featured Article
                      </Link>
                    </div>
                  </div>
                </article>
              )}

              <div className="mt-8 sm:mt-10 flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Latest Posts</h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {blogPosts.length} published articles
                  </p>
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                  >
                    Open Admin
                  </Link>
                )}
              </div>

              <div className="mt-6 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {remainingPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="h-32 sm:h-40 bg-slate-200">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-r from-slate-100 to-blue-100" />
                      )}
                    </div>
                    <div className="p-4 sm:p-5">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {post.category}
                      </span>
                      <h4 className="mt-3 text-lg sm:text-xl font-bold leading-snug text-slate-900 group-hover:text-blue-700">
                        {post.title}
                      </h4>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{post.description}</p>
                      <p className="mt-4 text-xs text-slate-500">
                        {post.publishDate} by {post.authorName}
                      </p>
                      <Link
                        href={post.href}
                        className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline"
                      >
                        Read More
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        (c) {new Date().getFullYear()} QuickRead. All rights reserved.
      </footer>
    </div>
  );
}
