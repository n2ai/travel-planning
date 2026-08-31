// lib/trip-gen/save.ts
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ScheduleItem } from "./order";

type SaveInput = {
  planId: string;
  userId: string;
  cityPlaceId: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  days: ScheduleItem[][];
};

export async function saveTrip(input: SaveInput): Promise<string> {
    const daysJson = input.days.map((items, dayIdx) => ({
    date: dateForDay(input.startDate, dayIdx),
    places: items.map((item) => ({
      placeId: item.placeId,
      time: item.time ?? null,
      note: item.kind === "meal" ? item.mealType : null,
      interest: item.interest
    })),
  }));

  const { data, error } = await supabaseAdmin.rpc("create_trip_with_days", {
    p_plan_id: input.planId,
    p_user_id: input.userId,
    p_city_place_id: input.cityPlaceId,
    p_title: input.title,
    p_start_date: input.startDate,
    p_end_date: input.endDate,
    p_days: daysJson,
  });

  if (error) throw new Error(`Error in saveTrip: ${error.message}`);
  return data as string;   
}

function dateForDay(startDate: string | null, offset: number): string | null {
  if (!startDate) return null;
  const d = new Date(startDate);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}