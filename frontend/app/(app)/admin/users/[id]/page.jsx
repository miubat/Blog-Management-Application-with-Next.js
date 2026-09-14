"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserById, setUserStatus } from "@/services/user.service";
import { getErrorMessage } from "@/lib/api";
import Loader from "@/components/Loader";
import Avatar from "@/components/Avatar";

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function AdminUserDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getUserById(id)
      .then((res) => setUser(res.data.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleStatus = async () => {
    setUpdating(true);
    setError("");
    try {
      // Backend only returns { id, isActive } here, not the full user —
      // merge it in rather than replacing the whole object.
      const res = await setUserStatus(id, !user.isActive);
      setUser((prev) => ({ ...prev, ...res.data.data }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader label="Loading user..." />;

  if (error || !user) {
    return <p className="rounded bg-red-50 p-4 text-sm text-red-600">{error || "User not found"}</p>;
  }

  return (
    <div className="mx-auto max-w-lg">
      <button onClick={() => router.push("/admin/users")} className="mb-4 text-sm text-blue-600 hover:underline">
        ← Back to users
      </button>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar user={user} size="lg" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.firstname} {user.lastname}</h1>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                user.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-900">{user.email}</dd>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <dt className="text-gray-500">Role</dt>
            <dd className="capitalize text-gray-900">{user.role}</dd>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <dt className="text-gray-500">Created</dt>
            <dd className="text-gray-900">{formatDate(user.createAt)}</dd>
          </div>
        </dl>

        <button
          onClick={toggleStatus}
          disabled={updating}
          className={`mt-6 w-full rounded py-2 text-sm font-medium text-white disabled:opacity-50 ${
            user.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {updating ? "Updating..." : user.isActive ? "Deactivate User" : "Activate User"}
        </button>
      </div>
    </div>
  );
}
