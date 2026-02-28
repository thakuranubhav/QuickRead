"use client";
import { useState, FormEvent } from "react";

export default function NewsFilter({ onSearch }: { onSearch: (filters: { query: string; category: string }) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch({ query, category });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 justify-center mt-5 flex-wrap px-4 sm:px-0"
    >
      <input
        type="text"
        placeholder="Search news..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-3 py-2 border rounded w-full sm:w-60"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3 py-2 border rounded w-full sm:w-auto"
      >
        <option value="">All Categories</option>
        <option value="environment">Environment</option>
        <option value="tech">Tech</option>
        <option value="science">Science</option>
        <option value="business">Business</option>
        <option value="sports">Sports</option>
        <option value="politics">Politics</option>
        <option value="health">Health</option>
      </select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto">
        Apply
      </button>
    </form>
  );
}
