"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  function sendCodeClicked() {
    if (email === "") {
      alert("Please enter your email");
      return;
    }

    alert("Authentication code sent");
  }

  return (
    <main className="min-h-screen bg-[#f4eddf] flex items-center justify-center px-4">
      <div className="w-full max-w-[560px] min-h-[500px] bg-white rounded-3xl shadow-xl flex items-center justify-center p-8 text-gray-900">
        <div className="w-full max-w-[380px] flex flex-col items-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Forgot Password
          </h1>

          <p className="mb-8 text-center text-sm text-gray-700">
            Enter your email to receive an authentication code.
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
            className="mb-5 w-full rounded-lg bg-blue-500 py-4 text-white hover:bg-blue-600"
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