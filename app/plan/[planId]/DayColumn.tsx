"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import StopCard from "../../components/StopCard";
import { type Stop, type Day } from "./type";

export default function DayColumn({
  day,
  onUpdateStop,
  onDeleteStop,
  onChangePlace,
  onAddPlace,
  onReorder,
}: {
  day: Day;
  onUpdateStop: (dayIndex: number, stopId: string, patch: Partial<Stop>) => void;
  onDeleteStop?: (dayIndex: number, stopId: string) => void;
  onChangePlace?: (dayIndex: number, stopId: string) => void;
  onAddPlace?: (dayIndex: number) => void;
  onReorder?: (dayIndex: number, newOrder: Stop[]) => void;
}) {
  // dnd-kit renders extra aria attributes only on the client.
  // Render a plain list until mounted to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = day.places.findIndex((p) => p.id === active.id);
    const newIndex = day.places.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(day.places, oldIndex, newIndex);
    onReorder?.(day.dayIndex, reordered);
  };

  // Shared stop list — used both before and after mount
  const stopList = (
    <div className="space-y-2">
      {day.places.map((stop) => (
        <StopCard
          key={stop.id}
          stop={stop}
          dayIndex={day.dayIndex}
          onUpdate={onUpdateStop}
          onDelete={onDeleteStop}
          onChangePlace={onChangePlace}
        />
      ))}
    </div>
  );

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-baseline gap-3">
        <h2 className="text-lg font-black text-gray-900">Day {day.dayIndex}</h2>
        {day.date && (
          <span className="text-sm text-gray-500">{formatDate(day.date)}</span>
        )}
        <span className="ml-auto text-xs text-gray-400">
          {day.places.length} stops
        </span>
      </div>

      {mounted ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={day.places.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {stopList}
          </SortableContext>
        </DndContext>
      ) : (
        stopList
      )}

      {/* Add place button at the end of the day */}
      {onAddPlace && (
        <button
          onClick={() => onAddPlace(day.dayIndex)}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-semibold text-gray-500 transition hover:border-[#BB00FF] hover:text-[#BB00FF]"
        >
          + Add place
        </button>
      )}
    </section>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}