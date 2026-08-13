type ExploreCard = {
    id:string;
    title:string;
    subtitle:string;
    emoji:string;
}

// Mock Data
const MOCK_CARDS: ExploreCard[] = [
  { id: "1", title: "Chỗ tham quan hàng đầu", subtitle: "Bảo tàng, đền chùa nổi bật", emoji: "🏛️" },
  { id: "2", title: "Quán ăn ngon", subtitle: "Được đánh giá cao ở Hà Nội", emoji: "🍜" },
  { id: "3", title: "Công viên & thiên nhiên", subtitle: "Không gian xanh trong thành phố", emoji: "🌳" },
];

export default function ExploreSection() {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black text-gray-900">Khám phá</h2>
        <button className="text-sm font-semibold text-[#BB00FF] hover:underline">
          Xem tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {MOCK_CARDS.map((card) => (
          <button
            key={card.id}
            className="group flex flex-col items-start rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-2xl">{card.emoji}</span>
            <p className="mt-2 font-semibold text-gray-900">{card.title}</p>
            <p className="mt-0.5 text-xs text-gray-500">{card.subtitle}</p>
          </button>
        ))}
      </div>
    </section>
  );
}