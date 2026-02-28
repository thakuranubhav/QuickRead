"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import SiteNavbarClient from "../components/site-navbar-client";

type BlogForm = {
  title: string;
  author: string;
  category: string;
  content: string;
  tags: string;
  publishDate: string;
};

const initialForm: BlogForm = {
  title: "",
  author: "",
  category: "",
  content: "",
  tags: "",
  publishDate: "",
};

export default function UploadBlogPage() {
  const [form, setForm] = useState<BlogForm>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const onChange = (key: keyof BlogForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      if (!imageFile) {
        throw new Error("Please select an image to upload.");
      }

      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("author", form.author);
      payload.append("category", form.category);
      payload.append("content", form.content);
      payload.append("tags", form.tags);
      payload.append("publishDate", form.publishDate);
      payload.append("image", imageFile);

      const response = await fetch("/api/blogs", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Failed to upload blog.");
      }

      setStatus("Blog published successfully.");
      setForm(initialForm);
      setImageFile(null);
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload blog.";
      setStatus(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <SiteNavbarClient />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Upload Blog</h2>
        <p className="text-gray-600 mb-8">Create and submit a new blog post for QuickRead.</p>

        <form onSubmit={onSubmit} className="bg-white rounded-xl border shadow p-4 sm:p-6 space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Blog Title
            </label>
            <input
              id="title"
              required
              value={form.title}
              onChange={(e) => onChange("title", e.target.value)}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter blog title"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                id="author"
                required
                value={form.author}
                onChange={(e) => onChange("author", e.target.value)}
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Author name"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                id="category"
                required
                value={form.category}
                onChange={(e) => onChange("category", e.target.value)}
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Technology, Sports, Politics..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Cover Image
              </label>
              <input
                id="image"
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Accepted: image files up to 5MB.</p>
              {imageFile && <p className="mt-1 text-xs text-blue-700">Selected: {imageFile.name}</p>}
            </div>
            <div>
              <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                Publish Date
              </label>
              <input
                id="publishDate"
                type="date"
                required
                value={form.publishDate}
                onChange={(e) => onChange("publishDate", e.target.value)}
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              id="tags"
              value={form.tags}
              onChange={(e) => onChange("tags", e.target.value)}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="ai, summaries, productivity"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Blog Content
            </label>
            <textarea
              id="content"
              required
              value={form.content}
              onChange={(e) => onChange("content", e.target.value)}
              rows={10}
              className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Write your blog content..."
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Uploading..." : "Upload Blog"}
            </button>
            <Link
              href="/news"
              className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back to News
            </Link>
          </div>
        </form>

        {status && (
          <p
            className={`mt-4 text-sm rounded-lg p-3 border ${
              status.toLowerCase().includes("failed") || status.toLowerCase().includes("error")
                ? "text-red-700 bg-red-50 border-red-200"
                : "text-green-700 bg-green-50 border-green-200"
            }`}
          >
            {status}
          </p>
        )}
      </main>

      <footer className="bg-black text-white text-center py-4 px-4 text-sm">
        Copyright (c) {new Date().getFullYear()} QuickRead. All rights reserved.
      </footer>
    </div>
  );
}
