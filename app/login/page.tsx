"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function loginButtonClicked() {
    if (username === "" || password === "") {
      alert("Please enter username and password");
      return;
    }

    alert("Login clicked");
  }

  return (
    <main className="min-h-screen bg-[#f4eddf] flex items-center justify-center px-4">
      <div className="w-full max-w-[560px] min-h-[650px] bg-white rounded-3xl shadow-xl flex items-center justify-center p-8 text-gray-900">
        <div className="w-full max-w-[380px] flex flex-col items-center">
          <h1 className="mb-8 text-3xl font-bold">Sign In</h1>

          <input
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
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
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>

            <Link href="/forgot-password" className="underline">
              Forgot password?
            </Link>
          </div>

          <button
            onClick={loginButtonClicked}
            className="mb-4 w-full rounded-lg bg-linear-to-r from-[#BB00FF] to-[#2F80ED] py-4 text-base font-medium text-white shadow-md transition hover:opacity-90 active:scale-[0.98]"
          >
            Sign In
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