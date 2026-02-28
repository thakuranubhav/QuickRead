"use client";

import { useEffect, useState } from "react";
import SiteNavbarClient from "../components/site-navbar-client";
import Ticker from "../components/ticker";
import NewsCard from "../components/newscard";
import NewsFilter from "../components/newsfilter";
import { Article } from "../types/atricle";

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [focusedArticle, setFocusedArticle] = useState<Article | null>(null);

  const fetchNews = async (
    { query = "", category = "" }: { query?: string; category?: string } = {}
  ): Promise<void> => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (category) params.set("category", category);

      const res: Response = await fetch(`/api/news?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || "Failed to fetch news.");
      }

      const newsList: Article[] = json.data || [];
      setArticles(newsList);

      const heads: string[] = newsList
        .map((a: Article) => a.title)
        .filter(Boolean)
        .filter((t) => t.length > 10);

      setHeadlines(heads);

      if (heads.length > 0) {
        try {
          const r = await fetch("/api/summarize", {
            method: "POST",
            body: JSON.stringify({
              text: heads.join("\n"),
            }),
          });

          const json = await r.json();
          setSummary(json.summary);
        } catch (err) {
          console.error(err);
          setSummary("Summary unavailable.");
        }
      } else {
        setSummary("No enough headlines to summarize.");
      }
    } catch (err) {
      setArticles([]);
      setHeadlines([]);
      setSummary("");
      setError(err instanceof Error ? err.message : "Failed to fetch news.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <SiteNavbarClient />

      {!focusedArticle && (
        <div className="sticky top-[73px] z-30">
          <Ticker headlines={headlines} />
        </div>
      )}

      <main className="flex-1">
        {!focusedArticle && (
          <section className="max-w-6xl mx-auto mt-4 sm:mt-6 px-4 grid gap-4 lg:grid-cols-2">
            <div className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white rounded-xl p-5 sm:p-6 shadow">
              <h2 className="text-xl sm:text-2xl font-bold leading-tight">Latest News Feed</h2>
              <p className="text-sm md:text-base mt-2 text-blue-50">
                Filter headlines and open a concise AI bullet summary when needed.
              </p>
              <button
                type="button"
                onClick={() => setShowSummary((prev) => !prev)}
                className="mt-4 bg-white text-blue-700 font-semibold px-5 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {showSummary ? "Hide Bullet Point Summary" : "View Bullet Point Summary"}
              </button>
            </div>

            <div className="bg-white rounded-xl border shadow p-4 sm:p-5 min-h-[180px]">
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-blue-700">AI Headline Summary</h3>
              {showSummary && summary ? (
                <div className="whitespace-pre-wrap break-words text-gray-700 text-sm leading-6 max-h-56 overflow-y-auto">
                  {summary}
                </div>
              ) : (
                <p className="text-sm text-gray-600 leading-6">
                  Click the button to view the AI bullet point summary.
                </p>
              )}
            </div>
          </section>
        )}

        {!focusedArticle && <NewsFilter onSearch={fetchNews} />}

        {loading && (
          <div className="flex flex-col items-center mt-4 gap-4 animate-fadeIn">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-blue-500 text-lg font-medium animate-pulse">Fetching News Data...</p>
          </div>
        )}

        {!loading && error && (
          <p className="mt-4 text-center text-sm font-medium text-red-600 px-4">{error}</p>
        )}

        {focusedArticle && (
          <NewsCard
            article={focusedArticle}
            fullScreen
            onClose={() => setFocusedArticle(null)}
          />
        )}

        {!focusedArticle && (
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center py-6 sm:py-8 px-4">
            {articles.length > 0 ? (
              articles.map((article: Article) => (
                <NewsCard
                  key={article.uuid}
                  article={article}
                  onFocus={() => setFocusedArticle(article)}
                />
              ))
            ) : (
              !loading && !error && <p className="text-gray-600">No news found...</p>
            )}
          </div>
        )}
      </main>

      <footer className="bg-black text-white text-center py-4 px-4 text-sm">
        Copyright (c) {new Date().getFullYear()} QuickRead. All rights reserved.
      </footer>
    </div>
  );
}


