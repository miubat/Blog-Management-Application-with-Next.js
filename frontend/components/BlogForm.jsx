"use client";

import { useState } from "react";
import { CATEGORIES } from "@/services/blog.service";

export default function BlogForm({ initialValues, submitLabel = "Publish Blog", pendingLabel = "Publishing...", onSubmit }) {
  const [blogTitle, setBlogTitle] = useState(initialValues?.blogTitle || "");
  const [category, setCategory] = useState(initialValues?.category || CATEGORIES[0]);
  const [blog, setBlog] = useState(initialValues?.blog || "");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const validate = () => {
    const next = {};
    if (!blogTitle.trim()) next.blogTitle = "Blog title is required";
    if (!category) next.category = "Category is required";
    if (!blog.trim() || blog.trim().length < 20) {
      next.blog = "Blog content must be at least 20 characters";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit({ blogTitle: blogTitle.trim(), category, blog: blog.trim() });
    } catch (err) {
      setFormError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {formError && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-600">{formError}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Blog Title</label>
        <input
          type="text"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
          placeholder="Introduction to Playwright"
        />
        {errors.blogTitle && <p className="mt-1 text-xs text-red-600">{errors.blogTitle}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Blog Content</label>
        <textarea
          value={blog}
          onChange={(e) => setBlog(e.target.value)}
          rows={10}
          className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
          placeholder="Playwright is a modern browser automation framework..."
        />
        {errors.blog && <p className="mt-1 text-xs text-red-600">{errors.blog}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}
