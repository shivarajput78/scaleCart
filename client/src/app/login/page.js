"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { apiRequest } from "@/lib/api";
import { saveTokens } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      saveTokens(
        data.accessToken,
        data.refreshToken
      );

      router.push("/products");
    } catch (error) {
      setError(
        error.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6 py-10">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">

        <h1 className="text-3xl font-bold">
          Login
        </h1>

        <p className="mt-2 text-gray-500">
          Login to your ScaleCart account.
        </p>

        {error && (
          <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
                href="/register"
                className="font-medium underline"
            >
            Create Account
            </Link>
        </p>
      </div>
    </section>
  );
}