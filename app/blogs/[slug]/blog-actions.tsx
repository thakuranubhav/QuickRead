"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  slug: string;
};

export default function BlogActions({ slug }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const onDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this blog?");
    if (!ok) return;

    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Delete failed.");
      }
      router.push("/blogs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <Link
        href={`/blogs/${slug}/edit`}
        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
      >
        Edit Blog
      </Link>
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
      >
        {deleting ? "Deleting..." : "Delete Blog"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
