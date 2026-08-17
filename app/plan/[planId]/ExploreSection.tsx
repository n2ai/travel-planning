type ExploreCard = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
};

// Mock data — replace with real candidates later
const MOCK_CARDS: ExploreCard[] = [
  { id: "1", title: "Top attractions", subtitle: "Popular museums & temples", emoji: "🏛️" },
  { id: "2", title: "Best places to eat", subtitle: "Highly rated in Hanoi", emoji: "🍜" },
  { id: "3", title: "Parks & nature", subtitle: "Green spaces around the city", emoji: "🌳" },
];

export default function ExploreSection() {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black text-gray-900">Explore</h2>
        <button className="text-sm font-semibold text-[#BB00FF] hover:underline">
          Browse all
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