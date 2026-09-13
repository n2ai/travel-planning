import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Guests shouldn't reach the dashboard
  if (!user) redirect("/login");

  // Fetch the user's trips (RLS filters by user)
  const { data: trips } = await supabase
    .from("trips")
    .select("plan_id, title, start_date, end_date")
    .order("updated_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#f4eddf] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* ─── Header ─── */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#BB00FF] to-[#2F80ED]" />
            <span className="text-xl font-black text-gray-900">Trippie</span>
          </div>
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>

        {/* ─── Your trips ─── */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900">Your trips</h2>
            <Link
              href="/plan-trip"
              className="rounded-full bg-gradient-to-r from-[#BB00FF] to-[#2F80ED] px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5"
            >
              + Plan new trip
            </Link>
          </div>

          {!trips || trips.length === 0 ? (
            <p className="text-sm text-gray-500">
              You don&apos;t have any trip plans yet.{" "}
              <Link
                href="/plan-trip"
                className="font-semibold text-[#BB00FF] hover:underline"
              >
                Plan a new trip
              </Link>
              .
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <Link
                  key={trip.plan_id}
                  href={`/plan/${trip.plan_id}`}
                  className="rounded-xl border border-gray-200 p-4 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-3 flex h-20 items-center justify-center rounded-lg bg-gradient-to-br from-[#BB00FF]/15 to-[#2F80ED]/15 text-2xl">
                    ✈️
                  </div>
                  <p className="font-bold text-gray-900">{trip.title}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {trip.start_date
                      ? `${trip.start_date} → ${trip.end_date ?? "?"}`
                      : "No dates yet"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ─── Explore ─── */}
        <section className="mt-10">
          <h2 className="mb-1 text-3xl font-black text-gray-900">Explore</h2>
          <p className="mb-4 text-sm font-semibold text-gray-600">
            Popular destinations
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {POPULAR.map((d) => (
              <div
                key={d.city}
                className="rounded-xl border border-gray-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex h-28 items-center justify-center rounded-lg bg-gradient-to-br from-[#BB00FF]/20 to-[#2F80ED]/20 text-4xl">
                  {d.emoji}
                </div>
                <p className="font-bold text-gray-900">{d.city}</p>
                <p className="mt-0.5 text-xs text-gray-500">{d.blurb}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

// Static picks for now — wire real data later
const POPULAR = [
  { city: "Hanoi, Vietnam", emoji: "🍜", blurb: "Street food and old quarter charm" },
  { city: "Bangkok, Thailand", emoji: "🛕", blurb: "Temples, markets, and night life" },
  { city: "Seoul, South Korea", emoji: "🏮", blurb: "Palaces, cafes, and mountain hikes" },
];