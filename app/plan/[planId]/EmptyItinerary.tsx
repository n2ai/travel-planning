export default function EmptyItinerary() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50 py-16 text-center">
      <span className="text-4xl">🗺️</span>
      <h3 className="mt-3 font-black text-gray-900">No itinerary yet</h3>
      <p className="mt-1 max-w-xs text-sm text-gray-500">
        Pick a hotel and hit Generate to automatically build your trip plan.
      </p>
      <button className="mt-5 rounded-full bg-gradient-to-r from-[#BB00FF] to-[#2F80ED] px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5">
        ✨ Generate itinerary
      </button>
    </div>
  );
}