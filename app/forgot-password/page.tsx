"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function sendCodeClicked() {
    if (email === "") {
      alert("Please enter your email");
      return;
    }

    router.push("/auth-code");
  }

  return (
    <main className="min-h-screen bg-[#f4eddf] flex items-center justify-center px-4">
      <div className="w-full max-w-[560px] min-h-[500px] bg-white rounded-3xl shadow-xl flex items-center justify-center p-8 text-gray-900">
        <div className="w-full max-w-[380px] flex flex-col items-center">
          <h1 className="mb-5 text-center text-4xl font-bold tracking-tight text-black">
            Forgot Password
          </h1>

          <p className="mb-8 max-w-[360px] text-center text-sm font-medium leading-5 text-black">
            Enter your account email. We will send you an authentication code.
          </p>

          <input
            type="email"
            placeholder="Account Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mb-5 w-full rounded-lg border border-black bg-white px-4 py-4 text-gray-900 placeholder:text-gray-500 outline-none"
          />

          <button
            onClick={sendCodeClicked}
            className="mb-5 w-full rounded-lg bg-linear-to-r from-[#BB00FF] to-[#2F80ED] py-4 font-medium text-white shadow-md transition hover:opacity-90 active:scale-[0.98]"
          >
            Send Authentication Code
          </button>

          <p className="text-sm text-gray-700">
            Remember your password?{" "}
            <Link href="/login" className="text-blue-600 underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}