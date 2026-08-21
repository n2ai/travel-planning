"use client";

import { useState } from "react";
import DayColumn from "./DayColumn";

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

export default function ItineraryList({ days: initialDays }: { days: Day[] }) {
  // Local state — starts from server data, mutates on edits
  const [days, setDays] = useState<Day[]>(initialDays);

  // Update one field of one stop, then persist to DB
  const updateStop = (
    dayIndex: number,
    stopId: string,
    patch: Partial<Stop>
  ) => {
    setDays((prev) =>
      prev.map((day) =>
        day.dayIndex !== dayIndex
          ? day
          : {
              ...day,
              places: day.places.map((s) =>
                s.id === stopId ? { ...s, ...patch } : s
              ),
            }
      )
    );

    saveStop(stopId, patch);
  };

  // Delete one stop, then persist to DB
  const deleteStop = (dayIndex: number, stopId: string) => {
    setDays((prev) =>
      prev.map((day) =>
        day.dayIndex !== dayIndex
          ? day
          : { ...day, places: day.places.filter((s) => s.id !== stopId) }
      )
    );

    deleteStopFromDb(stopId);
  };

  return (
    <div>
      {days.map((day) => (
        <DayColumn
          key={day.dayIndex}
          day={day}
          onUpdateStop={updateStop}
          onDeleteStop={deleteStop}
        />
      ))}
    </div>
  );
}

// Save a single stop change to the server
async function saveStop(stopId: string, patch: Partial<Stop>) {
  try {
    const res = await fetch(`/api/stops/${stopId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) console.error("Save failed:", await res.text());
  } catch (e) {
    console.error("Save error:", e);
  }
}

// Delete a stop on the server
async function deleteStopFromDb(stopId: string) {
  try {
    const res = await fetch(`/api/stops/${stopId}`, { method: "DELETE" });
    if (!res.ok) console.error("Delete failed:", await res.text());
  } catch (e) {
    console.error("Delete error:", e);
  }
}