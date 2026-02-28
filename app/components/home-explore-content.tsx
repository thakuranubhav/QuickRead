"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type LatestBlog = {
  id: string;
  title: string;
  slug: string;
  category: string;
  authorName: string;
  imageUrl?: string;
  content: string;
  publishDate: string;
};

type Props = {
  latestBlogs: LatestBlog[];
};

export default function HomeExploreContent({ latestBlogs }: Props) {
  const [showContent, setShowContent] = useState(false);
  const overviewRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (showContent && overviewRef.current) {
      const top = window.scrollY + overviewRef.current.getBoundingClientRect().top - 30;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, [showContent]);

  return (
    <>
      {!showContent && (
        <section className="pb-8 sm:pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
            <button
              type="button"
              onClick={() => setShowContent(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 ease-out hover:scale-[1.2] hover:bg-blue-800"
            >
              Explore
              <span aria-hidden="true">&darr;</span>
            </button>
          </div>
        </section>
      )}

      {showContent && (
        <>
          <section ref={overviewRef} className="pb-10">
            <div className="mx-auto mt-[80px] max-w-7xl px-4 sm:px-6">
              <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-700 to-cyan-600 p-4 text-white shadow-xl sm:p-8 md:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                  Platform Overview
                </p>
                <h3 className="mt-2 sm:mt-3 text-lg font-bold sm:text-2xl md:text-3xl">
                  Everything You Need In One Place
                </h3>
                <p className="mt-3 sm:mt-4 max-w-3xl text-xs sm:text-sm leading-6 sm:leading-7 text-blue-100 md:text-base">
                  QuickRead combines AI summaries, smart topic filtering, clean reading experience,
                  live news feed, weather insights, and AQI tracking so you can stay updated faster
                  without information overload.
                </p>
                <div className="mt-4 sm:mt-6 grid gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-blue-50 sm:grid-cols-2 lg:grid-cols-3">
                  <p>AI-powered concise summaries</p>
                  <p>News, weather, and AQI updates</p>
                  <p>Smart categories and quick discovery</p>
                  <p>Clean and distraction-free reading</p>
                  <p>Latest blogs from trusted content</p>
                  <p>Simple experience across devices</p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-10 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="mb-6 sm:mb-8 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">Latest Blogs</h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Fresh posts pulled directly from the database.
                  </p>
                </div>
                <Link href="/blogs" className="text-sm font-semibold text-blue-700 hover:underline">
                  View All
                </Link>
              </div>

              <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
                {latestBlogs.length === 0 ? (
                  <div className="rounded-2xl bg-white p-6 text-sm text-slate-600 shadow-sm ring-1 ring-blue-100">
                    No blogs published yet.
                  </div>
                ) : (
                  latestBlogs.map((blog) => (
                    <article
                      key={blog.id}
                      className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-blue-100"
                    >
                      {blog.imageUrl ? (
                        <img src={blog.imageUrl} alt={blog.title} className="h-44 w-full object-cover" />
                      ) : (
                        <div className="h-44 w-full bg-gradient-to-r from-blue-100 to-cyan-100" />
                      )}
                      <div className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                          {blog.category}
                        </p>
                        <h4 className="mt-2 text-lg font-bold text-slate-900 line-clamp-2">
                          {blog.title}
                        </h4>
                        <p className="mt-2 text-sm text-slate-600 line-clamp-3">{blog.content}</p>
                        <p className="mt-3 text-xs text-slate-500">
                          {new Date(blog.publishDate).toLocaleDateString()} by {blog.authorName}
                        </p>
                        <Link
                          href={`/blogs/${blog.slug}`}
                          className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline"
                        >
                          Read More
                        </Link>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
