"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/services/auth.service";
import { getErrorMessage } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (loading) return;
    setLoading(true);

    try {
      await forgotPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-3.5rem-56px)] items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-6 shadow">
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Forgot Password</h1>
        <p className="mb-6 text-sm text-gray-600">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>

        {success ? (
          <p className="rounded bg-green-50 p-3 text-sm text-green-700">
            If an account exists for that email, a reset link has been sent. Please check your inbox.
          </p>
        ) : (
          <>
            {error && (
              <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</p>
            )}

            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mb-6 w-full rounded border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}

        <p className="mt-4 text-center text-sm text-gray-600">
          Back to{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
