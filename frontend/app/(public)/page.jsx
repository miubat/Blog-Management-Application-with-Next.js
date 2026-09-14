"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBlogs } from "@/services/blog.service";
import { getErrorMessage } from "@/lib/api";
import { paginate } from "@/lib/paginate";
import BlogCard from "@/components/BlogCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 9;

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "";
  const category = searchParams.get("category") || "";
  const page = Number(searchParams.get("page") || 1);

  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getBlogs({ title, category })
      .then((res) => setAllBlogs(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [title, category]);

  const { items: blogs, totalPages, page: currentPage } = paginate(allBlogs, page, PAGE_SIZE);

  const updateParams = useCallback(
    (patch) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, val]) => {
        if (val) params.set(key, val);
        else params.delete(key);
      });
      if (!("page" in patch)) params.delete("page");
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to BlogSpace</h1>
        <p className="mt-2 text-gray-600">Discover articles on testing, automation, programming and more.</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter value={category} onChange={(next) => updateParams({ category: next })} />
        <div className="md:hidden">
          <SearchBar defaultValue={title} onSearch={(val) => updateParams({ title: val })} />
        </div>
      </div>

      {loading ? (
        <Loader label="Loading blogs..." />
      ) : error ? (
        <p className="rounded bg-red-50 p-4 text-sm text-red-600">{error}</p>
      ) : blogs.length === 0 ? (
        <p className="rounded bg-white p-8 text-center text-gray-500 shadow-sm">No blogs found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(next) => updateParams({ page: String(next) })}
          />
        </>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<Loader label="Loading blogs..." />}>
      <HomeContent />
    </Suspense>
  );
}
