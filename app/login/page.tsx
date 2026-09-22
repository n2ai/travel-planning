"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OAuthButtons from "../components/OAuthButtons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loginButtonClicked() {
    if (email === "" || password === "") {
      setError("Please enter your email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Login failed");
        return;
      }

      router.push("/home");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fbe9ff] via-[#f4eddf] to-[#f4eddf] px-6 py-12">
      {/* Soft background rings, same language as the landing page */}
      <div className="pointer-events-none fixed right-[-200px] top-[-140px] h-[640px] w-[640px] rounded-full border-[80px] border-white/30" />
      <div className="pointer-events-none fixed left-[-180px] bottom-[-160px] h-[520px] w-[520px] rounded-full border-[70px] border-purple-100/30" />

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Brand */}
        <Link href="/" className="mb-10 flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#BB00FF] to-[#2F80ED]" />
          <span className="text-xl font-black text-[#07182f]">Trippie</span>
        </Link>

        <h1 className="text-[40px] font-black leading-tight tracking-tight text-[#07182f]">
          Welcome back
        </h1>
        <p className="mb-8 mt-1 text-sm text-gray-600">
          Sign in to pick up where your trip left off.
        </p>

        {/* Email */}
        <label className="mb-1.5 block text-sm font-bold text-[#07182f]">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loginButtonClicked()}
          placeholder="you@example.com"
          className="mb-5 w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-3.5 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#BB00FF] focus:bg-white"
        />

        {/* Password */}
        <div className="mb-1.5 flex items-baseline justify-between">
          <label className="text-sm font-bold text-[#07182f]">Password</label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[#BB00FF] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loginButtonClicked()}
          placeholder="••••••••"
          className="w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-3.5 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#BB00FF] focus:bg-white"
        />

        <p className="mt-2 min-h-5 text-sm text-red-500">{error}</p>

        {/* Submit */}
        <button
          onClick={loginButtonClicked}
          disabled={loading}
          className="mt-2 w-full rounded-full bg-gradient-to-r from-[#BB00FF] to-[#2F80ED] py-4 text-base font-black text-white shadow-[0_14px_28px_rgba(124,58,237,0.28)] transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            or
          </span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>

        {/* OAuth */}
        <OAuthButtons />

        <p className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-[#BB00FF] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}