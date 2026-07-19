"use client";

import { FormEvent, useState } from "react";

export default function PlanTripForm() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tripType, setTripType] = useState("Friends");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (destination.trim() === "") {
      alert("Please enter a destination");
      return;
    }

    alert(`Starting trip plan for ${destination}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 w-full max-w-[620px]">
      <div className="flex h-[58px] items-center rounded-xl border border-gray-300 bg-white px-4 shadow-sm">
        <label className="mr-3 shrink-0 text-base font-black text-[#111827]">
          Where to?
        </label>

        <input
          type="text"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder="e.g. Paris, Hawaii, Japan"
          className="w-full bg-transparent text-base text-gray-800 outline-none placeholder:text-gray-400"
        />
      </div>

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
          className="rounded-full bg-linear-to-r from-[#2F80ED] to-[#BB00FF] px-9 py-4 text-base font-black text-white shadow-[0_14px_28px_rgba(124,58,237,0.28)] transition hover:-translate-y-1 hover:shadow-xl"
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