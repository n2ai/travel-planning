"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserMenu({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  // First letter of the email as the avatar
  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={boxRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#BB00FF] to-[#2F80ED] text-sm font-black text-white transition hover:opacity-90"
        aria-label="Account menu"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-sm font-semibold text-gray-900">{email}</p>
          </div>

          <Link
            href="/settings"
            className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            ⚙️ Account settings
          </Link>

          <Link
            href="/home"
            className="block px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50"
          >
            ✈️ My trips
          </Link>

          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
          >
            ↪ Log out
          </button>
        </div>
      )}
    </div>
  );
}