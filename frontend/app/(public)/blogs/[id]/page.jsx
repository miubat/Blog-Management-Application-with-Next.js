"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getBlogById } from "@/services/blog.service";
import { getErrorMessage } from "@/lib/api";
import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogDetailsPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    getBlogById(id)
      .then((res) => setBlog(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading blog..." />;

  if (error || !blog) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Blog Not Found</h1>
        <p className="mt-2 text-gray-600">{error || "This blog does not exist."}</p>
        <Link href="/" className="mt-6 inline-block text-blue-600 hover:underline">
          ← Back to all blogs
        </Link>
      </div>
    );
  }

  const author = blog.author;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Back to all blogs
      </Link>

      <span className="mt-4 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
        {blog.category}
      </span>

      <h1 className="mt-3 text-3xl font-bold text-gray-900">{blog.blogTitle}</h1>

      <div className="mt-4 flex items-center gap-3">
        <Avatar user={author} size="lg" />
        <div>
          <p className="font-medium text-gray-800">
            {author ? `${author.firstname} ${author.lastname}` : "Unknown author"}
          </p>
          <p className="text-sm text-gray-500">{formatDate(blog.createAt)}</p>
        </div>
      </div>

      <div className="prose mt-8 max-w-none whitespace-pre-wrap text-gray-800">
        {blog.blog}
      </div>
    </article>
  );
}
