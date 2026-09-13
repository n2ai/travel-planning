import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { estimateBudget, type StopForBudget } from "@/lib/trip-gen/budget";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ planId: string }> }
) {
  const { planId } = await params;
  const supabase = await createClient();

  // Fetch trip + stops (RLS ensures ownership)
  const { data: trip } = await supabase
    .from("trips")
    .select(`
      country_code,
      trip_days ( id, trip_places ( google_place_id, interest ) )
    `)
    .eq("plan_id", planId)
    .maybeSingle();

  if (!trip) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Gather place_ids for price_level lookup
  const allIds = trip.trip_days.flatMap((d) =>
    d.trip_places.map((p) => p.google_place_id)
  );

  const { data: places } = await supabaseAdmin
    .from("place_cache")
    .select("google_place_id, price_level")
    .in("google_place_id", allIds);

  const priceMap = new Map(
    (places ?? []).map((p) => [p.google_place_id, p.price_level])
  );

  // Build stops for budget
  const stops: StopForBudget[] = trip.trip_days.flatMap((d) =>
    d.trip_places.map((p) => ({
      interest: (p.interest ?? "meal") as StopForBudget["interest"],
      priceLevel: priceMap.get(p.google_place_id) ?? null,
    }))
  );

  const numDays = trip.trip_days.length;
  const budget = estimateBudget(stops, numDays, trip.country_code ?? null);

  return NextResponse.json({ budget });
}