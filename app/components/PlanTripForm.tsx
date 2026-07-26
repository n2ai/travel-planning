"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type SuggestedDestination = {
  placeId: string;
  text: string;
  mainText: string;
  types: string[];
};

export type PickedDestination = {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
};

function typeIcon(types: string[]) {
  if (types.includes("country")) return "🌏";
  if (types.includes("administrative_area_level_1")) return "🗺️";
  return "📍";
}

export default function PlanTripForm() {
  const [destination, setDestination] = useState<SuggestedDestination | null>(null);
  const [startDate, setStartDate] = useState("");
  const [query,setQuery] = useState("")
  const [endDate, setEndDate] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestedDestination[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [pickedPlanId, setPickedPlanId] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleChange = (q: string) => {
    setQuery(q);
    clearTimeout(timer.current);
    if (q.trim().length < 2) return setSuggestions([]);

    timer.current = setTimeout(async () => {
      const res = await fetch(`/api/destinations?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
      setOpen(true);
    }, 350);
  };

  const handleSelect = async (s: SuggestedDestination) => {
    setDestination(s);
    setQuery(s.mainText);
    setSuggestions([]);
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pickedPlanId = destination?.placeId
    if (!pickedPlanId) {
      alert("Please pick a destination from the list");
      return;
    }
    
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const qs = params.toString();
    

    router.push(`/plan/${pickedPlanId}${qs ? `?${qs}` : ""}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 w-full max-w-[620px]">
      {/* relative để dropdown bám theo khối này */}
      <div className="relative" ref={boxRef}>
        <div className="flex h-[58px] items-center rounded-xl border border-gray-300 bg-white px-4 shadow-sm">
          <label className="mr-3 shrink-0 text-base font-black text-[#111827]">
            Where to?
          </label>

          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="e.g. Paris, Hawaii, Japan"
            className="w-full bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>

        {/* DROPDOWN */}
        {suggestions.length > 0 && open && (
          <ul className="absolute left-0 top-[62px] z-20 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            {suggestions.map((s) => (
              <li key={s.placeId}>
                <button
                  type="button"
                  onClick={() => handleSelect(s)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-gray-50"
                >
                  <span>{typeIcon(s.types)}</span>
                  <span className="text-gray-800">{s.text}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dates — giữ nguyên như cũ */}
      <div className="mt-4 rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm">
        <p className="mb-2 text-sm font-black text-[#111827]">
          Dates <span className="font-semibold text-gray-500">(optional)</span>
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="w-full bg-transparent text-base text-gray-700 outline-none"
          />
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="w-full bg-transparent text-base text-gray-700 outline-none"
          />
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center">
        <button
          type="submit"
          disabled={!destination}
          className="rounded-full bg-linear-to-r from-[#2F80ED] to-[#BB00FF] px-9 py-4 text-base font-black text-white shadow-[0_14px_28px_rgba(124,58,237,0.28)] transition hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:hover:translate-y-0"
        >
          Start planning
        </button>
        <button
          type="button"
          className="mt-7 text-sm font-black text-gray-600 hover:text-[#BB00FF]"
        >
          Or write a new guide
        </button>
      </div>
    </form>
  );
}