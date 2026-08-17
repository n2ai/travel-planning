"use client";

import { useState } from "react";

type Hotel = {
  id: string;
  name: string;
  area: string;
  price: string;
  rating: number;
};

// Mock data — replace with real affiliate hotels later
const MOCK_HOTELS: Hotel[] = [
  { id: "h1", name: "Hanoi La Siesta Premium", area: "Old Quarter", price: "$68/night", rating: 4.8 },
  { id: "h2", name: "Peridot Grand Hotel", area: "Hoan Kiem", price: "$55/night", rating: 4.7 },
  { id: "h3", name: "The Chi Boutique Hotel", area: "Ba Dinh", price: "$42/night", rating: 4.6 },
];

export default function HotelSection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black text-gray-900">Choose where to stay</h2>
        <span className="text-xs text-gray-400">Used as your daily starting point</span>
      </div>

      <div className="space-y-2">
        {MOCK_HOTELS.map((hotel) => {
          const isActive = selected === hotel.id;
          return (
            <button
              key={hotel.id}
              onClick={() => setSelected(hotel.id)}
              className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                isActive
                  ? "border-[#BB00FF] bg-gradient-to-r from-[#BB00FF]/5 to-[#2F80ED]/5 ring-1 ring-[#BB00FF]/30"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              {/* Custom radio */}
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isActive ? "border-[#BB00FF]" : "border-gray-300"
                }`}
              >
                {isActive && (
                  <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#BB00FF] to-[#2F80ED]" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">{hotel.name}</p>
                <p className="text-xs text-gray-500">
                  {hotel.area} · ⭐ {hotel.rating}
                </p>
              </div>

              <span className="shrink-0 text-sm font-bold text-gray-900">
                {hotel.price}
              </span>
            </button>
          );
        })}
      </div>

      <button className="mt-3 text-sm font-semibold text-[#BB00FF] hover:underline">
        See more hotels →
      </button>
    </section>
  );
}