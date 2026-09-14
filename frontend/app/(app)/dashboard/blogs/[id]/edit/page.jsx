"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBlogById, updateBlog } from "@/services/blog.service";
import { getErrorMessage } from "@/lib/api";
import BlogForm from "@/components/BlogForm";
import Loader from "@/components/Loader";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBlogById(id)
      .then((res) => setBlog(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (payload) => {
    try {
      await updateBlog(id, payload);
      router.push("/dashboard/blogs");
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  if (loading) return <Loader label="Loading blog..." />;

  if (error || !blog) {
    return <p className="rounded bg-red-50 p-4 text-sm text-red-600">{error || "Blog not found"}</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Blog</h1>
      <BlogForm
        initialValues={blog}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        pendingLabel="Saving..."
      />
    </div>
  );
}
