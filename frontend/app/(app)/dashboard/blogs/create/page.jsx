"use client";

import { useRouter } from "next/navigation";
import { createBlog } from "@/services/blog.service";
import { getErrorMessage } from "@/lib/api";
import BlogForm from "@/components/BlogForm";

export default function CreateBlogPage() {
  const router = useRouter();

  const handleSubmit = async (payload) => {
    try {
      await createBlog(payload);
      router.push("/dashboard/blogs");
    } catch (err) {
      throw new Error(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Blog</h1>
      <BlogForm onSubmit={handleSubmit} submitLabel="Publish Blog" pendingLabel="Publishing..." />
    </div>
  );
}
