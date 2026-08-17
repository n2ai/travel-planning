type Stop = {
  id: string;
  name: string;
  position: number;
  start_time: string | null;
  note: string | null; // "lunch" | "dinner" | null
  rating?: number | null;
};

export default function StopCard({ stop }: { stop: Stop }) {
  const isMeal = stop.note === "lunch" || stop.note === "dinner";
  const time = stop.start_time?.slice(0, 5) ?? "";

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-3 transition hover:shadow-md ${
        isMeal ? "border-amber-200 bg-amber-50/60" : "border-gray-200 bg-white"
      }`}
    >
      {/* Gradient order badge */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#BB00FF] to-[#2F80ED] text-sm font-bold text-white">
        {stop.position}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {time && (
            <span className="text-xs font-semibold text-gray-500">{time}</span>
          )}
          {isMeal && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              {stop.note === "lunch" ? "🍜 Lunch" : "🍜 Dinner"}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate font-medium text-gray-900">{stop.name}</p>
        {stop.rating != null && (
          <p className="mt-0.5 text-xs text-gray-500">⭐ {stop.rating}</p>
        )}
      </div>
    </div>
  );
}