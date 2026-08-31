import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import PlanLayout from "./PlanLayout";
import { estimateBudget, type StopForBudget } from "@/lib/trip-gen/budget";


export default async function PlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  const supabase = await createClient();

  // 1. Fetch trip + days + places (RLS filters by user)
  const { data: trip } = await supabase
    .from("trips")
    .select(`
      id, plan_id, title, start_date, end_date, google_place_id, country_code,
      trip_days (
        id, day_index, date,
        trip_places ( id, google_place_id, position, start_time, note, interest )
      )
    `)
    .eq("plan_id", planId)
    .maybeSingle();

  if (!trip) notFound();

  // 2. Collect all place_ids, read name + coords from place_cache in one query
  const allIds = trip.trip_days.flatMap((d) =>
    d.trip_places.map((p) => p.google_place_id)
  );

  const { data: places } = await supabaseAdmin
    .from("place_cache")
    .select("google_place_id, name, lat, lng, price_level") 
    .in("google_place_id", allIds);

  // Lookup map: place_id -> place info
  const placeMap = new Map(
    (places ?? []).map((p) => [p.google_place_id, p])
  );

  // 3. Sort days + places into correct order
  const days = [...trip.trip_days]
    .sort((a, b) => a.day_index - b.day_index)
    .map((day) => ({
      dayIndex: day.day_index,
      date: day.date,
      places: [...day.trip_places]
        .sort((a, b) => a.position - b.position)
        .map((p) => ({
          ...p,
          name: placeMap.get(p.google_place_id)?.name ?? "Unknown",
          lat: placeMap.get(p.google_place_id)?.lat,
          lng: placeMap.get(p.google_place_id)?.lng,
        })),
    }));

  // 4. Render layout with data
  const hasPlan = trip.trip_days.length > 0;

  // 5. Estimate budget
  const budgetStops: StopForBudget[] = trip.trip_days.flatMap((day) =>
    day.trip_places.map((p) => ({
      interest: p.interest ?? "meal",
      priceLevel: placeMap.get(p.google_place_id)?.price_level ?? null,
    }))
  );

  const numDays = trip.trip_days.length;

  const budget = estimateBudget(budgetStops, numDays, trip.country_code ?? null);

  return (
    <PlanLayout
      cityName={trip.title.replace(" Trip", "")}
      hasPlan={hasPlan}
      days={days}
      budget={budget}
    />
  );
}