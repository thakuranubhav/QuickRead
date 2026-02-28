"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteNavbarClient from "../components/site-navbar-client";

type SignupForm = {
  name: string;
  email: string;
  password: string;
};

const initialForm: SignupForm = {
  name: "",
  email: "",
  password: "",
};

export default function SignupPage() {
  const [form, setForm] = useState<SignupForm>(initialForm);
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error || "Signup failed.");
      }

      setStatus("Signup successful. Redirecting to login...");
      setForm(initialForm);
      router.push("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed.";
      setStatus(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <SiteNavbarClient />

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-600 mt-1">Publish blogs and join the community.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Create a password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {status && (
            <p
              className={`mt-4 text-sm rounded-lg p-3 border ${
                status.toLowerCase().includes("fail") || status.toLowerCase().includes("error")
                  ? "text-red-700 bg-red-50 border-red-200"
                  : "text-green-700 bg-green-50 border-green-200"
              }`}
            >
              {status}
            </p>
          )}

          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-700 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>

      <footer className="bg-black text-white text-center py-4 px-4 text-sm">
        Copyright (c) {new Date().getFullYear()} QuickRead. All rights reserved.
      </footer>
    </div>
  );
}
