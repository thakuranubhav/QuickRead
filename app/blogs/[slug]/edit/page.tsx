"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import SiteNavbarClient from "@/app/components/site-navbar-client";

type BlogData = {
  title: string;
  category: string;
  content: string;
  tags: string[];
  publishDate: string;
};

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [form, setForm] = useState<BlogData>({
    title: "",
    category: "",
    content: "",
    tags: [],
    publishDate: "",
  });

  useEffect(() => {
    const load = async () => {
      const currentSlug = params?.slug ?? "";
      if (!currentSlug) return;
      setSlug(currentSlug);
      try {
        const res = await fetch(`/api/blogs/${currentSlug}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Failed to load blog.");
        }
        setForm({
          title: data.post.title ?? "",
          category: data.post.category ?? "",
          content: data.post.content ?? "",
          tags: Array.isArray(data.post.tags) ? data.post.tags : [],
          publishDate: data.post.publishDate
            ? new Date(data.post.publishDate).toISOString().slice(0, 10)
            : "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blog.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params?.slug]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!slug) return;
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const res = await fetch(`/api/blogs/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags.join(", "),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update blog.");
      }
      setStatus("Blog updated successfully.");
      const nextSlug = data?.post?.slug || slug;
      router.push(`/blogs/${nextSlug}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update blog.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <SiteNavbarClient />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Blog</h2>
        <p className="text-sm text-gray-600 mt-1">Update content and save changes.</p>

        {loading ? (
          <p className="mt-6 text-gray-600">Loading blog details...</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 bg-white rounded-xl border p-5 sm:p-6 space-y-5 shadow-sm">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Publish Date
                </label>
                <input
                  id="publishDate"
                  type="date"
                  value={form.publishDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, publishDate: e.target.value }))}
                  className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                value={form.tags.join(", ")}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  }))
                }
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                rows={12}
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-700 text-white px-5 py-2.5 font-medium hover:bg-blue-800 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <Link
                href={slug ? `/blogs/${slug}` : "/blogs"}
                className="rounded-lg border border-gray-300 text-gray-700 px-5 py-2.5 font-medium hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {status && <p className="text-sm text-green-700">{status}</p>}
          </form>
        )}
      </main>
    </div>
  );
}
