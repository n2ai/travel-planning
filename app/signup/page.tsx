"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OAuthButtons from "../components/OAuthButtons";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const hasCapital = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  function validateForm(): boolean {
    let ok = true;

    if (username === "") {
      setUsernameError("Username is required");
      ok = false;
    }

    if (email === "") {
      setEmailError("Email is required");
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email");
      ok = false;
    }

    if (password === "") {
      setPasswordError("Password is required");
      ok = false;
    } else if (!hasCapital && !hasSpecial) {
      setPasswordError("Password needs 1 capital letter and 1 special character");
      ok = false;
    } else if (!hasCapital) {
      setPasswordError("Password needs 1 capital letter");
      ok = false;
    } else if (!hasSpecial) {
      setPasswordError("Password needs 1 special character");
      ok = false;
    }

    if (confirmPassword === "") {
      setConfirmPasswordError("Please confirm your password");
      ok = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
      ok = false;
    }

    return ok;
  }

  async function createAccountClicked() {
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        const message = result.error ?? "Signup failed. Please try again.";
        if (message.toLowerCase().includes("email")) setEmailError(message);
        else if (message.toLowerCase().includes("username")) setUsernameError(message);
        else setEmailError(message);
        return;
      }

      if (result.session === null) {
        // Email confirmation is on — user must verify first
        router.push("/login?check-email=1");
      } else {
        router.push("/home");
        router.refresh();
      }
    } catch {
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-3.5 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#BB00FF] focus:bg-white";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fbe9ff] via-[#f4eddf] to-[#f4eddf] px-6 py-12">
      {/* Soft background rings */}
      <div className="pointer-events-none fixed right-[-200px] top-[-140px] h-[640px] w-[640px] rounded-full border-[80px] border-white/30" />
      <div className="pointer-events-none fixed left-[-180px] bottom-[-160px] h-[520px] w-[520px] rounded-full border-[70px] border-purple-100/30" />

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Brand */}
        <Link href="/" className="mb-8 flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#BB00FF] to-[#2F80ED]" />
          <span className="text-xl font-black text-[#07182f]">Trippie</span>
        </Link>

        <h1 className="text-[40px] font-black leading-tight tracking-tight text-[#07182f]">
          Start planning
        </h1>
        <p className="mb-7 mt-1 text-sm text-gray-600">
          Free account. Build your first trip in minutes.
        </p>

        {/* Username */}
        <label className="mb-1.5 block text-sm font-bold text-[#07182f]">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="backpacker123"
          className={inputClass}
        />
        <p className="mb-2 mt-1 min-h-5 text-sm text-red-500">{usernameError}</p>

        {/* Email */}
        <label className="mb-1.5 block text-sm font-bold text-[#07182f]">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
        <p className="mb-2 mt-1 min-h-5 text-sm text-red-500">{emailError}</p>

        {/* Password */}
        <label className="mb-1.5 block text-sm font-bold text-[#07182f]">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
        />

        {/* Live requirements */}
        <div className="mt-2 flex gap-4 text-xs">
          <span className={hasCapital ? "font-semibold text-green-600" : "text-gray-400"}>
            {hasCapital ? "✓" : "○"} 1 capital letter
          </span>
          <span className={hasSpecial ? "font-semibold text-green-600" : "text-gray-400"}>
            {hasSpecial ? "✓" : "○"} 1 special character
          </span>
        </div>
        <p className="mb-2 mt-1 min-h-5 text-sm text-red-500">{passwordError}</p>

        {/* Confirm password */}
        <label className="mb-1.5 block text-sm font-bold text-[#07182f]">
          Confirm password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createAccountClicked()}
          placeholder="••••••••"
          className={inputClass}
        />
        <p className="mb-2 mt-1 min-h-5 text-sm text-red-500">
          {confirmPasswordError}
        </p>

        {/* Submit */}
        <button
          onClick={createAccountClicked}
          disabled={loading}
          className="mt-1 w-full rounded-full bg-gradient-to-r from-[#BB00FF] to-[#2F80ED] py-4 text-base font-black text-white shadow-[0_14px_28px_rgba(124,58,237,0.28)] transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {loading ? "Creating account..." : "Create account"}
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
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[#BB00FF] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}