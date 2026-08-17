"use client";

import { useState } from "react";
import ExploreSection from "./ExploreSection";
import HotelSection from "./HotelSection";
import GenerateSection from "./GenerateSection";
import EmptyItinerary from "./EmptyItinerary";
import ItineraryList from "./ItineraryList";

type Section = "overview" | "itinerary" | "budget";

type Stop = {
  id: string;
  name: string;
  position: number;
  start_time: string | null;
  note: string | null;
  rating?: number | null;
};

type Day = {
  dayIndex: number;
  date: string | null;
  places: Stop[];
};

export default function PlanLayout({
  cityName,
  hasPlan,
  days,
}: {
  cityName: string;
  hasPlan: boolean;
  days: Day[];
}) {
  const [active, setActive] = useState<Section>("overview");

  const navItems: { key: Section; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "itinerary", label: "Itinerary" },
    { key: "budget", label: "Budget" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4eddf]">
      {/* ─── SIDEBAR ─── */}
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

      {/* ─── CONTENT (scrolls) ─── */}
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-2xl">
          {/* Hero */}
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-black text-gray-900">
              Trip to {cityName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">No dates yet · Add dates</p>
          </div>

          {/* Overview tab */}
          {active === "overview" && (
            <>
              <ExploreSection />
              <HotelSection />
              <GenerateSection />
            </>
          )}

          {/* Itinerary tab */}
          {active === "itinerary" &&
            (hasPlan ? <ItineraryList days={days} /> : <EmptyItinerary />)}

          {/* Budget tab */}
          {active === "budget" && (
            <p className="text-gray-400">Budget (coming soon)</p>
          )}
        </div>
      </main>

      {/* ─── MAP (placeholder, fixed) ─── */}
      <div className="hidden w-[45%] shrink-0 bg-gray-200 lg:block">
        <div className="flex h-full items-center justify-center text-gray-400">
          MAP PLACEHOLDER
        </div>
      </div>
    </div>
  );
}