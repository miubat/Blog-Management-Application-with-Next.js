"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { getBlogs, getMyBlogs, deleteBlog } from "@/services/blog.service";
import { getErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/paginate";
import Loader from "@/components/Loader";
import ConfirmDialog from "@/components/ConfirmDialog";
import Pagination from "@/components/Pagination";

const PAGE_SIZE = 10;

export default function MyBlogsPage() {
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");

    const request = isAdmin ? getBlogs({ page, limit: PAGE_SIZE }) : getMyBlogs();

    request
      .then((res) => {
        if (isAdmin) {
          setBlogs(res.data.data.blogs);
          setTotalPages(res.data.data.totalPages);
        } else {
          setBlogs(res.data.data);
          setTotalPages(1);
        }
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [isAdmin, page]);

  useEffect(() => {
    load();
  }, [load]);

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteBlog(toDelete.id);
      setNotice("Blog deleted successfully.");
      setToDelete(null);
      load();
    } catch (err) {
      setError(getErrorMessage(err));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{isAdmin ? "All Blogs" : "My Blogs"}</h1>
        <Link
          href="/dashboard/blogs/create"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Create Blog
        </Link>
      </div>

      {notice && <p className="mb-4 rounded bg-green-50 p-3 text-sm text-green-700">{notice}</p>}
      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <Loader label="Loading blogs..." />
      ) : blogs.length === 0 ? (
        <p className="rounded bg-white p-8 text-center text-gray-500 shadow-sm">
          {isAdmin ? "No blogs found." : "You haven't created any blogs yet."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                {isAdmin && <th className="px-4 py-3 font-medium">Author</th>}
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/blogs/${blog.id}`} className="font-medium text-gray-900 hover:underline">
                      {blog.blogTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{blog.category}</td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-gray-600">
                      {blog.author ? `${blog.author.firstname} ${blog.author.lastname}` : "—"}
                    </td>
                  )}
                  <td className="px-4 py-3 text-gray-600">{formatDate(blog.createAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`/dashboard/blogs/${blog.id}/edit`} className="text-blue-600 hover:underline">
                        Edit
                      </Link>
                      <button onClick={() => setToDelete(blog)} className="text-red-600 hover:underline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && isAdmin && blogs.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete blog?"
        message={`Are you sure you want to delete "${toDelete?.blogTitle}"?`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
