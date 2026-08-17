import StopCard from "../../components/StopCard";

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

export default function DayColumn({ day }: { day: Day }) {
  return (
    <section className="mb-8">
      {/* Day header */}
      <div className="mb-3 flex items-baseline gap-3">
        <h2 className="text-lg font-black text-gray-900">Day {day.dayIndex}</h2>
        {day.date && (
          <span className="text-sm text-gray-500">{formatDate(day.date)}</span>
        )}
        <span className="ml-auto text-xs text-gray-400">
          {day.places.length} stops
        </span>
      </div>

      {/* Stops */}
      <div className="space-y-2">
        {day.places.map((stop) => (
          <StopCard key={stop.id} stop={stop} />
        ))}
      </div>
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