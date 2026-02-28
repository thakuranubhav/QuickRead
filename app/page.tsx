import Image from "next/image";
import Link from "next/link";
import SiteNavbar from "./components/site-navbar";
import HomeExploreContent from "./components/home-explore-content";
import { connectToDatabase } from "@/lib/mongodb";
import { Blog } from "@/lib/models/Blog";

export const revalidate = 0;

type LeanBlog = {
  _id: { toString(): string };
  title: string;
  slug: string;
  category: string;
  authorName: string;
  imageUrl?: string;
  content: string;
  publishDate: Date | string;
};

export default async function Home() {
  await connectToDatabase();
  const latestBlogs = (await Blog.find({})
    .sort({ publishDate: -1 })
    .limit(3)
    .lean()) as unknown as LeanBlog[];

  const latestBlogItems = latestBlogs.map((blog) => ({
    id: blog._id.toString(),
    title: blog.title,
    slug: blog.slug,
    category: blog.category,
    authorName: blog.authorName,
    imageUrl: blog.imageUrl,
    content: blog.content,
    publishDate: new Date(blog.publishDate).toISOString(),
  }));

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <SiteNavbar />

      <main className="flex-1">
        <section className="mt-[15px] py-8 sm:py-10 md:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-5 px-4 sm:px-6 md:grid-cols-[0.85fr_1.15fr] md:gap-10">
            <div className="max-w-lg rounded-2xl bg-white p-6 text-left shadow-lg ring-1 ring-blue-100 md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Daily Brief
              </p>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
                Stay Informed Instantly.
              </h2>
              <p className="mt-3 text-sm text-slate-600 sm:text-base">
                Quick news and short blogs for your busy life.
              </p>
              <Link
                href="/news"
                className="mt-8 inline-block rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-800"
              >
                START READING NOW
              </Link>
            </div>

            <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200">
              <Image
                src="/hero-news-photo.png"
                alt="Person reading quick news updates on phone"
                width={1536}
                height={1024}
                className="block h-auto w-full"
                priority
              />
            </div>
          </div>
        </section>

        <HomeExploreContent latestBlogs={latestBlogItems} />
      </main>

      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        (c) {new Date().getFullYear()} QuickRead. All rights reserved.
      </footer>
    </div>
  );
}
