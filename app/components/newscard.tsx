"use client";

import { useState } from "react";
import { Article } from "../types/atricle";

interface Props {
  article: Article;
  fullScreen?: boolean;
  onClose?: () => void;
  onFocus?: () => void;
}

export default function NewsCard({ article, fullScreen, onClose, onFocus }: Props) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const summarizeArticle = async () => {
    if (onFocus) onFocus(); // 👈 open fullscreen FIRST
    setLoading(true);
    setSummary("");

    try {
      let articleText = "";

      if (article.url) {
        const extractRes = await fetch(`/api/extract?url=${article.url}`);
        const extractJson = await extractRes.json();
        articleText = extractJson.text || "";
      }

      if (!articleText && article.description) {
        articleText = article.description;
      }

      if (!articleText) {
        articleText = article.title;
      }

      const r = await fetch("/api/summarize", {
        method: "POST",
        body: JSON.stringify({
          text: `
Summarize this news article in **at least 10 bullet points**.
Make each point:
- meaningful
- detailed
- factual
- unique (no repeating ideas)
- easy to read

ARTICLE:
${articleText}
`
        }),
      });

      const json = await r.json();
      setSummary(json.summary || "⚠️ No summary available.");

    } catch {
      setSummary("⚠️ Unable to summarize this news.");
    }

    setLoading(false);
  };

  return (
    <div className={`border rounded-xl shadow-sm p-4 bg-white transition-all ${
  fullScreen
    ? "w-full max-w-4xl mx-auto mt-10 min-h-screen overflow-y-auto pb-20"
    : "w-full max-w-sm sm:w-[240px]"
}`}>

      {fullScreen && onClose && (
        <button
          onClick={onClose}
          className="mb-3 px-3 py-2 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
        >
          ← Back
        </button>
      )}

      {article.image_url && (
        <img
          src={article.image_url}
          alt=""
          className={`rounded-lg object-cover ${
            fullScreen ? "w-full h-[350px]" : "w-full h-28"
          }`}
        />
      )}
      <h2 className={`font-semibold mt-4 ${fullScreen ? "text-2xl sm:text-3xl" : "text-base sm:text-sm"}`}>
        {article.title}
      </h2>

      <p className={`text-gray-600 mt-3 mb-4 ${
        fullScreen ? "text-base" : "text-xs line-clamp-2"
      }`}>
        {article.description}
      </p>

      {!fullScreen && (
        <button
          onClick={summarizeArticle}
          disabled={loading}
          className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      )}

    {summary && (
  <pre className="mt-3 whitespace-pre-line text-gray-800 text-base leading-relaxed overflow-y-auto max-h-[70vh] pr-2">
    {summary}
  </pre>
)}
    </div>
  );
}
