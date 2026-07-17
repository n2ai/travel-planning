"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function loginButtonClicked() {
    if (email === "" || password === "") {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // chi doc body MOT lan duy nhat

      if (!response.ok) {
        alert(data.error ?? "Login failed");
        return;
      }

      // Khong luu token thu cong - Supabase server client da set session
      // vao cookie trong route handler roi
      router.push("/");
      router.refresh(); // de server components doc session moi
    } catch (error) {
      alert("An error occurred while logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4eddf] flex items-center justify-center px-4">
      <div className="w-full max-w-[560px] min-h-[650px] bg-white rounded-3xl shadow-xl flex items-center justify-center p-8 text-gray-900">
        <div className="w-full max-w-[380px] flex flex-col items-center">
          <h1 className="mb-8 text-3xl font-bold">Sign In</h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mb-4 w-full rounded-lg border border-black px-4 py-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mb-4 w-full rounded-lg border border-black px-4 py-4"
          />

          <div className="mb-4 flex w-full justify-between text-sm">
            <label>
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              Remember me
            </label>

            <Link href="/forgot-password" className="underline">
              Forgot password?
            </Link>
          </div>

          <button
            onClick={loginButtonClicked}
            disabled={loading}
            className="mb-4 w-full rounded-lg bg-linear-to-r from-[#BB00FF] to-[#2F80ED] py-4 text-base font-medium text-white shadow-md transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <button className="mb-5 w-full rounded-lg border border-gray-400 py-4">
            Continue with Google
          </button>

          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}