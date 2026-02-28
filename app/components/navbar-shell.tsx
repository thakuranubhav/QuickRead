"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavLink } from "./nav-links";

type Props = {
  title: string;
  navLinks: NavLink[];
};

export default function NavbarShell({ title, navLinks }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-700">{title}</h1>

        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-blue-700 transition">
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700"
          aria-label="Open menu"
        >
          <span className="inline-flex flex-col gap-1.5">
            <span className="h-0.5 w-4 bg-gray-700" />
            <span className="h-0.5 w-4 bg-gray-700" />
            <span className="h-0.5 w-4 bg-gray-700" />
          </span>
        </button>
      </div>

      {menuOpen && (
        <>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="md:hidden fixed inset-0 z-40 bg-black/35"
            aria-label="Close menu overlay"
          />
          <aside className="md:hidden fixed top-0 right-0 z-50 h-[50vh] w-72 overflow-y-auto bg-white shadow-2xl border-l border-gray-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-semibold text-gray-800">Menu</p>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700"
                aria-label="Close menu"
              >
                <span className="text-sm font-semibold leading-none">X</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </aside>
        </>
      )}
    </nav>
  );
}
