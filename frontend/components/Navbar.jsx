"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileMenu from "@/components/ProfileMenu";

export default function Navbar({ onMenuClick }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(pathname === "/" ? searchParams.get("title") || "" : "");
  }, [pathname, searchParams]);

  const submitSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("title", query.trim());
    if (pathname === "/" && searchParams.get("category")) {
      params.set("category", searchParams.get("category"));
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="rounded p-1 text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        )}
        <Link href="/" className="text-lg font-bold text-blue-700">
          BlogSpace
        </Link>
      </div>

      <form onSubmit={submitSearch} className="hidden flex-1 max-w-md md:block">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blogs..."
          className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500"
        />
      </form>

      {loading ? null : user ? (
        <ProfileMenu />
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
}
