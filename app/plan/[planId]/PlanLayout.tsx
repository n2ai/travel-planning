"use client";

import { useState } from "react";

type Section = "overview" | "itinerary" | "budget";

export default function PlanLayout({
  cityName,
  children,
}: {
  cityName: string;
  children?: React.ReactNode;
}) {
  const [active, setActive] = useState<Section>("overview");

  const navItems: { key: Section; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "itinerary", label: "Itinerary" },
    { key: "budget", label: "Budget" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4eddf]">
      {/* ─── Sidebare Nav (vertical, static) ─── */}
      <aside className="flex w-52 shrink-0 flex-col border-r border-black/5 bg-white/40 px-4 py-6">
        <div className="mb-8 flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#BB00FF] to-[#2F80ED]" />
          <span className="font-black text-gray-900">Trippie</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                active === item.key
                  ? "bg-gradient-to-r from-[#BB00FF]/10 to-[#2F80ED]/10 text-[#BB00FF]"
                  : "text-gray-600 hover:bg-black/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ─── Content (scroll) ─── */}
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-2xl">
          {/* Hero */}
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-black text-gray-900">
              Trip to {cityName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">Chưa có ngày · Thêm ngày</p>
          </div>

          {/* Nội dung theo section active */}
          <div>{children}</div>
          <p className="text-sm text-gray-400">Section đang mở: {active}</p>
        </div>
      </main>

      {/* ─── COLUMN MAP (placeholder, static) ─── */}
      <div className="hidden w-[45%] shrink-0 bg-gray-200 lg:block">
        <div className="flex h-full items-center justify-center text-gray-400">
            MAP PLACEHOLDER
        </div>
      </div>
    </div>
  );
}