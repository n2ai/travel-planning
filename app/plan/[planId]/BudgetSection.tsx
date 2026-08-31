type Budget = {
  food: number;
  tickets: number;
  hotel: number;
  total: number;
  perDay: number;
  currency: string;
};

export default function BudgetSection({ budget }: { budget: Budget }) {
  const rows = [
    { label: "🍜 Food", value: budget.food },
    { label: "🎟️ Attractions", value: budget.tickets },
    { label: "🏨 Hotel", value: budget.hotel },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      {/* Total + per day */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-sm text-gray-500">Estimated total</p>
          <p className="text-3xl font-black text-gray-900">
            ${budget.total}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Per day</p>
          <p className="text-xl font-black text-[#BB00FF]">${budget.perDay}</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
          >
            <span className="text-sm font-medium text-gray-700">{row.label}</span>
            <span className="font-bold text-gray-900">${row.value}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Estimate based on backpacker prices. Actual costs may vary.
      </p>
    </div>
  );
}