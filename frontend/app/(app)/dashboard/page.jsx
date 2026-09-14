"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getBlogs } from "@/services/blog.service";
import { getErrorMessage } from "@/lib/api";
import BlogCard from "@/components/BlogCard";
import Loader from "@/components/Loader";
import Avatar from "@/components/Avatar";

export default function DashboardPage() {
  const { user, role } = useAuth();
  const isAdmin = role === "admin";
  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getBlogs()
      .then((res) => {
        const mine = isAdmin ? res.data.data : res.data.data.filter((b) => b.userId === user.id);
        setTotal(mine.length);
        setBlogs(mine.slice(0, 3));
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [isAdmin, user]);

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.firstname}</h1>
      <p className="mt-1 text-gray-600">Here&apos;s what&apos;s happening with your blogs.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">{role === "admin" ? "Total Blogs" : "Your Blogs"}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{total}</p>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <p className="mb-2 text-sm text-gray-500">Profile Information</p>
          <div className="flex items-center gap-3">
            <Avatar user={user} />
            <div className="min-w-0">
              <p className="truncate font-medium text-gray-900">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
              <p className="text-xs font-medium capitalize text-blue-700">{role}</p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/blogs/create"
          className="flex flex-col justify-center rounded-lg bg-blue-600 p-5 text-white shadow-sm hover:bg-blue-700"
        >
          <p className="text-sm opacity-80">Quick Action</p>
          <p className="mt-1 text-xl font-semibold">+ Create Blog</p>
        </Link>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {role === "admin" ? "Recent Blogs" : "Your Recent Blogs"}
          </h2>
          <Link href="/dashboard/blogs" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading blogs..." />
        ) : error ? (
          <p className="rounded bg-red-50 p-4 text-sm text-red-600">{error}</p>
        ) : blogs.length === 0 ? (
          <p className="rounded bg-white p-8 text-center text-gray-500 shadow-sm">
            You haven&apos;t created any blogs yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
