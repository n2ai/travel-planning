"use client";

import { useState, useRef } from "react";

type Suggestion = { placeId: string; text: string };

export default function ChangePlaceModal({
  cityCenter,
  title = "Change place",
  onClose,
  onPick,
}: {
  cityCenter: { lat: number; lng: number };
  title?: string;
  onClose: () => void;
  onPick: (placeId: string, name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleChange = (q: string) => {
    setQuery(q);
    clearTimeout(timer.current);

    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/places/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: q,
            lat: cityCenter.lat,
            lng: cityCenter.lng,
          }),
        });
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
      } catch (e) {
        console.error(e);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-32"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-3 text-lg font-black text-gray-900">{title}</h3>

        <input
          type="text"
          value={query}
          autoFocus
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search a place in this city..."
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#BB00FF]"
        />

        {/* Results */}
        <ul className="mt-2 max-h-64 overflow-y-auto">
          {loading && (
            <li className="px-3 py-2 text-sm text-gray-400">Searching...</li>
          )}
          {!loading &&
            suggestions.map((s) => (
              <li key={s.placeId}>
                <button
                  onClick={() => onPick(s.placeId, s.text)}
                  className="flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-gray-800 hover:bg-gray-50"
                >
                  <span className="mt-0.5">📍</span>
                  <span>{s.text}</span>
                </button>
              </li>
            ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-3 text-xs text-gray-400 hover:text-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}