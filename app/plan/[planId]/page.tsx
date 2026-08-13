import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import PlanLayout from "./PlanLayout";

export default async function PlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  const supabase = await createClient();

  // 1. Lấy trip + days + places (RLS tự lọc theo user)
  const { data: trip } = await supabase
    .from("trips")
    .select(`
      id, plan_id, title, start_date, end_date, google_place_id,
      trip_days (
        id, day_index, date,
        trip_places ( id, google_place_id, position, start_time, note )
      )
    `)
    .eq("plan_id", planId)
    .maybeSingle();

  if (!trip) notFound();

  // 2. Gom tất cả place_id, đọc toạ độ + tên từ place_cache MỘT lần
  const allIds = trip.trip_days.flatMap((d) =>
    d.trip_places.map((p) => p.google_place_id)
  );

  const { data: places } = await supabaseAdmin
    .from("place_cache")
    .select("google_place_id, name, lat, lng")
    .in("google_place_id", allIds);

  // map để tra nhanh: place_id → thông tin
  const placeMap = new Map(
    (places ?? []).map((p) => [p.google_place_id, p])
  );

  // 3. Sắp ngày + địa điểm theo đúng thứ tự
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

  // 4. Tạm render đơn giản để kiểm tra data
  return <PlanLayout cityName={trip.title.replace(" Trip", "")} />;
}