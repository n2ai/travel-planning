"use client";

import { useState } from "react";
import DayColumn from "./DayColumn";
import AuthModal from "./AuthModal";
import ChangePlaceModal from "./ChangePlaceModal";
import { type Stop, type Day } from "./type";

// What the modal is currently doing: changing an existing stop, or adding to a day
type ModalMode =
  | { type: "change"; dayIndex: number; stopId: string }
  | { type: "add"; dayIndex: number }
  | null;

export default function ItineraryList({
  days: initialDays,
  isGuest = false,
  cityCenter,
  onItineraryChange,
}: {
  days: Day[];
  isGuest?: boolean;
  cityCenter: { lat: number; lng: number } | null;
  onItineraryChange?: () => void;
}) {
  const [days, setDays] = useState<Day[]>(initialDays);
  const [showAuth, setShowAuth] = useState(false);
  const [modal, setModal] = useState<ModalMode>(null);

  const requireAuth = () => setShowAuth(true);

  // ---- Edit: time / note ----
  const updateStop = async (
    dayIndex: number,
    stopId: string,
    patch: Partial<Stop>
  ) => {
    if (isGuest) return requireAuth();

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

    // Wait for the DB write so the budget is recalculated from fresh data
    await saveStop(stopId, patch);
    onItineraryChange?.();
  };

  // ---- Delete ----
  const deleteStop = async (dayIndex: number, stopId: string) => {
    if (isGuest) return requireAuth();

    setDays((prev) =>
      prev.map((day) =>
        day.dayIndex !== dayIndex
          ? day
          : { ...day, places: day.places.filter((s) => s.id !== stopId) }
      )
    );

    await deleteStopFromDb(stopId);
    onItineraryChange?.();
  };

  // ---- Reorder within a day: renumber 1,2,3... then persist ----
  const reorderDay = async (dayIndex: number, newOrder: Stop[]) => {
    if (isGuest) return requireAuth();

    const renumbered = newOrder.map((s, i) => ({ ...s, position: i + 1 }));

    setDays((prev) =>
      prev.map((day) =>
        day.dayIndex !== dayIndex ? day : { ...day, places: renumbered }
      )
    );

    const orders = renumbered.map((s) => ({ id: s.id, position: s.position }));
    await reorderStopsInDb(orders);
    // Reordering doesn't change cost, but keeps everything consistent
    onItineraryChange?.();
  };

  // ---- Open modal to change a stop's place ----
  const openChange = (dayIndex: number, stopId: string) => {
    if (isGuest) return requireAuth();
    setModal({ type: "change", dayIndex, stopId });
  };

  // ---- Open modal to add a place to a day ----
  const openAdd = (dayIndex: number) => {
    if (isGuest) return requireAuth();
    setModal({ type: "add", dayIndex });
  };

  // ---- Handle a pick from the modal ----
  const handlePick = async (placeId: string, name: string) => {
    if (!modal) return;

    if (modal.type === "change") {
      // Replace place of an existing stop
      const { dayIndex, stopId } = modal;

      setDays((prev) =>
        prev.map((day) =>
          day.dayIndex !== dayIndex
            ? day
            : {
                ...day,
                places: day.places.map((s) =>
                  s.id === stopId ? { ...s, name, google_place_id: placeId } : s
                ),
              }
        )
      );

      await saveStop(stopId, { google_place_id: placeId } as Partial<Stop>);
      onItineraryChange?.();
    } else {
      // Add a new stop at the end of the day
      const { dayIndex } = modal;
      const day = days.find((d) => d.dayIndex === dayIndex);
      const dayId = day?.dayId;
      if (!dayId) return;

      const maxPos = day ? Math.max(0, ...day.places.map((p) => p.position)) : 0;
      const res = await addStopToDb(dayId, placeId, maxPos + 1);

      if (res?.stop) {
        setDays((prev) =>
          prev.map((d) =>
            d.dayIndex !== dayIndex
              ? d
              : {
                  ...d,
                  places: [
                    ...d.places,
                    {
                      id: res.stop.id,
                      name,
                      position: maxPos + 1,
                      start_time: null,
                      note: null,
                      google_place_id: placeId,
                    },
                  ],
                }
          )
        );
        onItineraryChange?.();
      }
    }

    setModal(null);
  };

  return (
    <>
      <div>
        {days.map((day) => (
          <DayColumn
            key={day.dayIndex}
            day={day}
            onUpdateStop={updateStop}
            onDeleteStop={deleteStop}
            onChangePlace={openChange}
            onAddPlace={openAdd}
            onReorder={reorderDay}
          />
        ))}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {modal && cityCenter && (
        <ChangePlaceModal
          cityCenter={cityCenter}
          title={modal.type === "add" ? "Add place" : "Change place"}
          onClose={() => setModal(null)}
          onPick={handlePick}
        />
      )}
    </>
  );
}

// ---- Server calls ----

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

async function deleteStopFromDb(stopId: string) {
  try {
    const res = await fetch(`/api/stops/${stopId}`, { method: "DELETE" });
    if (!res.ok) console.error("Delete failed:", await res.text());
  } catch (e) {
    console.error("Delete error:", e);
  }
}

// Add a new stop, returns the created row (with its id)
async function addStopToDb(
  dayId: string,
  placeId: string,
  position: number
): Promise<{ stop: { id: string } } | null> {
  try {
    const res = await fetch("/api/stops", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dayId, googlePlaceId: placeId, position }),
    });
    if (!res.ok) {
      console.error("Add failed:", await res.text());
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error("Add error:", e);
    return null;
  }
}

// Persist reordered positions in one batch call
async function reorderStopsInDb(orders: { id: string; position: number }[]) {
  try {
    const res = await fetch("/api/stops", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orders }),
    });
    if (!res.ok) console.error("Reorder failed:", await res.text());
  } catch (e) {
    console.error("Reorder error:", e);
  }
}