"use client";

import { useState } from "react";

export default function GenerateSection() {
  const [address, setAddress] = useState("");

  return (
    <section className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-lg font-black text-gray-900">Create your itinerary</h2>
      <p className="mb-4 text-sm text-gray-500">
        Enter where you&apos;re staying (or pick a hotel above) to get started.
      </p>

      {/* Address input */}
      <div className="mb-4 flex items-center rounded-xl border border-gray-300 bg-white px-4 py-3">
        <span className="mr-2 text-gray-400">📍</span>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g. 25 Hang Be, Hoan Kiem, Hanoi"
          className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Generate button */}
      <button className="w-full rounded-full bg-gradient-to-r from-[#BB00FF] to-[#2F80ED] py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
        ✨ Generate itinerary
      </button>
    </section>
  );
}