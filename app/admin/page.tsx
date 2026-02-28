import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Blog } from "@/lib/models/Blog";
import SiteNavbar from "@/app/components/site-navbar";

export const revalidate = 0;

type RecentBlog = {
  _id: { toString(): string };
  title: string;
  slug: string;
  category: string;
  publishDate: Date | string;
};

export default async function AdminPage() {
  await connectToDatabase();
  const totalBlogs = await Blog.countDocuments();
  const recentBlogs = await Blog.find({})
    .sort({ publishDate: -1 })
    .limit(5)
    .lean() as unknown as RecentBlog[];

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <SiteNavbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Admin Dashboard</h2>
            <p className="text-gray-600 mt-2">Manage blogs and monitor activity.</p>
          </div>
          <Link
            href="/upload-blog"
            className="bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-800 transition"
          >
            Create Blog
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
            <p className="text-sm text-gray-500">Total Blogs</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{totalBlogs}</p>
          </div>
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
            <p className="text-sm text-gray-500">Published Today</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {
                recentBlogs.filter((blog) => {
                  const today = new Date();
                  const published = new Date(blog.publishDate);
                  return (
                    published.getFullYear() === today.getFullYear() &&
                    published.getMonth() === today.getMonth() &&
                    published.getDate() === today.getDate()
                  );
                }).length
              }
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
            <p className="text-sm text-gray-500">Quick Actions</p>
            <Link href="/blogs" className="text-blue-700 font-semibold hover:underline mt-2 inline-block">
              View Public Blogs
            </Link>
          </div>
        </div>

        <section className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800">Recent Blogs</h3>
          <div className="mt-4 space-y-4">
            {recentBlogs.length === 0 ? (
              <p className="text-sm text-gray-600">No blogs published yet.</p>
            ) : (
              recentBlogs.map((blog) => (
                <div
                  key={blog._id.toString()}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{blog.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(blog.publishDate).toLocaleDateString()} · {blog.category}
                    </p>
                  </div>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="text-sm text-blue-700 font-medium hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        © {new Date().getFullYear()} QuickRead. All rights reserved.
      </footer>
    </div>
  );
}
