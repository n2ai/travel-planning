import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPlace } from "@/lib/places";

export async function POST(req: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { dayId, googlePlaceId, position } = await req.json();

  // Cache the new place (so page can read its coords/name later)
  console.log("ADD stop:", { dayId, googlePlaceId, position });  // ← log input

  // Cache place — don't crash the add if caching fails
  try {
    await getPlace(googlePlaceId);
  } catch (e) {
    console.error("getPlace failed during add:", e);
    // continue — place_id is saved, name will fill in on next load
  }

  // Need trip_id — look it up from the day (RLS ensures ownership)
  const { data: day } = await supabase
    .from("trip_days")
    .select("trip_id")
    .eq("id", dayId)
    .maybeSingle();



  if (!day) {
    return NextResponse.json({ error: "Day not found" }, { status: 404 });
  }

  const { data: stop, error } = await supabase
    .from("trip_places")
    .insert({
      trip_id: day.trip_id,
      day_id: dayId,
      google_place_id: googlePlaceId,
      position,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ stop });
}

// Reorder: update positions of multiple stops in one call
export async function PATCH(req: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orders } = await req.json();
  // orders: [{ id: string, position: number }, ...]

  // Update each stop's position (RLS ensures ownership)
  for (const o of orders) {
    const { error } = await supabase
      .from("trip_places")
      .update({ position: o.position })
      .eq("id", o.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}