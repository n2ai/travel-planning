"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Stop = {
  id: string;
  name: string;
  position: number;
  start_time: string | null;
  note: string | null;
  rating?: number | null;
  google_place_id?: string;
};

export default function StopCard({
  stop,
  dayIndex,
  onUpdate,
  onDelete,
  onChangePlace,
}: {
  stop: Stop;
  dayIndex: number;
  onUpdate: (dayIndex: number, stopId: string, patch: Partial<Stop>) => void;
  onDelete?: (dayIndex: number, stopId: string) => void;
  onChangePlace?: (dayIndex: number, stopId: string) => void;
}) {
  const isMeal = stop.note === "lunch" || stop.note === "dinner";
  const [editingTime, setEditingTime] = useState(false);
  const [editingNote, setEditingNote] = useState(false);
  const time = stop.start_time?.slice(0, 5) ?? "";

  // dnd-kit sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Meal stops use `note` for their label, so their editable note stays empty
  const noteText = isMeal ? "" : stop.note ?? "";

  const handleTimeChange = (v: string) => {
    setEditingTime(false);
    if (v && v !== time) onUpdate(dayIndex, stop.id, { start_time: `${v}:00` });
  };

  const handleNoteChange = (v: string) => {
    setEditingNote(false);
    const t = v.trim();
    if (t !== noteText) onUpdate(dayIndex, stop.id, { note: t || null });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex gap-2 rounded-xl border p-3 transition hover:shadow-md ${
        isMeal ? "border-amber-200 bg-amber-50/60" : "border-gray-200 bg-white"
      }`}
    >
      {/* Drag handle — only this grabs to reorder */}
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="mt-1 shrink-0 cursor-grab touch-none text-gray-300 opacity-0 transition group-hover:opacity-100 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        ⣿
      </div>

      {/* Gradient order badge */}
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#BB00FF] to-[#2F80ED] text-xs font-bold text-white">
        {stop.position}
      </div>

      <div className="min-w-0 flex-1">
        {/* Top row: time + meal label */}
        <div className="flex items-center gap-2">
          {editingTime ? (
            <input
              type="time"
              defaultValue={time}
              autoFocus
              onBlur={(e) => handleTimeChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTimeChange(e.currentTarget.value);
                if (e.key === "Escape") setEditingTime(false);
              }}
              className="rounded border border-gray-300 px-1 text-xs outline-none focus:border-[#BB00FF]"
            />
          ) : (
            <button
              onClick={() => setEditingTime(true)}
              className="text-xs font-semibold text-gray-500 hover:text-[#BB00FF]"
            >
              {time || "Set time"}
            </button>
          )}
          {isMeal && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              {stop.note === "lunch" ? "🍜 Lunch" : "🍜 Dinner"}
            </span>
          )}
        </div>

        {/* Name */}
        <p className="mt-0.5 truncate font-semibold text-gray-900">{stop.name}</p>

        {/* Note — always visible, faded when empty (non-meal only) */}
        {!isMeal &&
          (editingNote ? (
            <input
              type="text"
              defaultValue={noteText}
              autoFocus
              placeholder="Add notes, links, etc. here"
              onBlur={(e) => handleNoteChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNoteChange(e.currentTarget.value);
                if (e.key === "Escape") setEditingNote(false);
              }}
              className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-[#BB00FF]"
            />
          ) : (
            <button
              onClick={() => setEditingNote(true)}
              className={`mt-1 block truncate text-left text-xs ${
                noteText ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {noteText || "Add notes, links, etc. here"}
            </button>
          ))}

        {/* Action row */}
        <div className="mt-2 flex items-center gap-3 text-[11px] font-medium text-gray-400">
          <button className="hover:text-[#BB00FF]">✓ Mark visited</button>
          <button className="hover:text-[#BB00FF]">$ Add cost</button>
          {onChangePlace && (
            <button
              onClick={() => onChangePlace(dayIndex, stop.id)}
              className="hover:text-[#BB00FF]"
            >
              ⇄ Change
            </button>
          )}
          {stop.rating != null && (
            <span className="ml-auto text-gray-500">⭐ {stop.rating}</span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete?.(dayIndex, stop.id)}
        className="absolute right-2 top-2 text-gray-300 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
        aria-label="Delete stop"
      >
        🗑
      </button>
    </div>
  );
}