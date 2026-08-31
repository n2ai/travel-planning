import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createClient } from "@/lib/supabase/server";
import { getPlace } from "@/lib/places";

export async function POST(req: Request) {
  const supabase = await createClient();  

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cityPlaceId, startDate, endDate } = await req.json();

  const city = await getPlace(cityPlaceId);
  const planId = nanoid(12);

  const { error } = await supabase.from("trips").insert({
    plan_id: planId,
    user_id: user.id,
    google_place_id: cityPlaceId,
    country_code: city.country_code,
    title: `${city.name} Trip`,
    start_date: startDate || null,
    end_date: endDate || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ planId });
}