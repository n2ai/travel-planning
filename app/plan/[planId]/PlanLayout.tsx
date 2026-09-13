"use client";

import { useState, useEffect, useRef } from "react";
import ExploreSection from "./ExploreSection";
import HotelSection from "./HotelSection";
import GenerateSection from "./GenerateSection";
import EmptyItinerary from "./EmptyItinerary";
import ItineraryList from "./ItineraryList";
import BudgetSection from "./BudgetSection";
import { type Day } from "./type";

type Section = "overview" | "itinerary" | "budget";

type Budget = {
  food: number;
  tickets: number;
  hotel: number;
  total: number;
  perDay: number;
  currency: string;
};

export default function PlanLayout({
  cityName,
  hasPlan,
  days,
  budget: initialBudget,
  cityCenter,
  planId,
}: {
  cityName: string;
  hasPlan: boolean;
  days: Day[];
  budget: Budget;
  cityCenter: { lat: number; lng: number } | null;
  planId: string;
}) {
  const [active, setActive] = useState<Section>("overview");
  const scrollRef = useRef<HTMLElement>(null);

  // Budget is recalculated on the server whenever the itinerary changes
  const [budget, setBudget] = useState<Budget>(initialBudget);

  const refreshBudget = async () => {
    console.log("REFRESH called");                    // ← log đầu tiên
    try {
      const res = await fetch(`/api/plan/${planId}/budget`);
      console.log("status:", res.status);             // ← log status
      if (!res.ok) {
        console.error("budget api error:", await res.text());
        return;
      }
      const data = await res.json();
      console.log("Budget refreshed:", data.budget);
      if (data.budget) setBudget(data.budget);
    } catch (e) {
      console.error("Budget refresh failed:", e);
    }
  };

  const navItems: { key: Section; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "itinerary", label: "Itinerary" },
    { key: "budget", label: "Budget" },
  ];

  // Scroll to a section when its nav item is clicked
  const scrollToSection = (id: Section) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActive(id);
    }
  };

  // Auto-highlight the nav item of the section currently in view
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id as Section);
          }
        }
      },
      { root: container, rootMargin: "-40% 0px -55% 0px" }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.key);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

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
              onClick={() => scrollToSection(item.key)}
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

      {/* ─── CONTENT (one long scroll) ─── */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-6">
        <div className="mx-auto max-w-2xl">
          {/* Hero */}
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-black text-gray-900">
              Trip to {cityName}
            </h1>
            <p className="mt-1 text-sm text-gray-500">No dates yet · Add dates</p>
          </div>

          {/* All sections rendered continuously, each with an id */}
          <section id="overview" className="scroll-mt-6">
            <ExploreSection />
            <HotelSection />
            <GenerateSection />
          </section>

          <section id="itinerary" className="scroll-mt-6">
            <h2 className="mb-4 text-xl font-black text-gray-900">Itinerary</h2>
            {hasPlan ? (
              <ItineraryList
                days={days}
                cityCenter={cityCenter}
                onItineraryChange={refreshBudget}
              />
            ) : (
              <EmptyItinerary />
            )}
          </section>

          <section id="budget" className="scroll-mt-6 pb-24">
            <h2 className="mb-4 text-xl font-black text-gray-900">Budget</h2>
            <BudgetSection budget={budget} />
          </section>
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