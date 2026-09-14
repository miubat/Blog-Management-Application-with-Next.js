"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getAllUsers, setUserStatus } from "@/services/user.service";
import { getErrorMessage } from "@/lib/api";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import Avatar from "@/components/Avatar";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError("");

    getAllUsers({ page, limit: PAGE_SIZE, search: search.trim() || undefined })
      .then((res) => {
        setUsers(res.data.data.users);
        setTotalPages(res.data.data.totalPages);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleStatus = async (user) => {
    setUpdatingId(user.id);
    setError("");
    try {
      await setUserStatus(user.id, !user.isActive);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search by name or email..."
          className="w-full max-w-xs rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-blue-500"
        />
      </div>

      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <Loader label="Loading users..." />
      ) : users.length === 0 ? (
        <p className="rounded bg-white p-8 text-center text-gray-500 shadow-sm">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${u.id}`} className="flex items-center gap-2 hover:underline">
                      <Avatar user={u} />
                      <span className="font-medium text-gray-900">{u.firstname} {u.lastname}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{u.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(u)}
                      disabled={updatingId === u.id}
                      className={`text-sm font-medium disabled:opacity-50 ${
                        u.isActive ? "text-red-600 hover:underline" : "text-green-600 hover:underline"
                      }`}
                    >
                      {updatingId === u.id ? "Updating..." : u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && users.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
