import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createClient } from "@/lib/supabase/server";
import { collectCandidates } from "@/lib/trip-gen/collect";
import { trimByRating, kMeans, balanceClusters } from "@/lib/trip-gen/cluster";
import { orderByNearest, insertMeals, assignTimes } from "@/lib/trip-gen/order";
import { saveTrip } from "@/lib/trip-gen/save";
import type { Interest, Pace } from "@/lib/type";

const PACE_PERDAY: Record<Pace, number> = {
  relaxed: 3,
  medium: 4,
  packed: 6,
};

export async function POST(req: Request) {
  try {
    // 1. User Verify
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    // 2. Read input from request body
    const body = await req.json();
    const {
      cityPlaceId,
      cityName,
      hotel,          // { lat, lng }
      startDate,
      endDate,
      interests,      // Interest[]
      pace,           // Pace
    } = body as {
      cityPlaceId: string;
      cityName: string;
      hotel: { lat: number; lng: number };
      startDate: string | null;
      endDate: string | null;
      interests: Interest[];
      pace: Pace;
    };

    // 3. Count days
    const days = countDays(startDate, endDate);
    const perDay = PACE_PERDAY[pace];

    // 4. Run pipeline
    const { activities, meals } = await collectCandidates(hotel, interests, pace);
    const trimmed = trimByRating(activities, days * perDay);
    const clusters = kMeans(trimmed, days);
    const balanced = balanceClusters(clusters, Math.ceil(trimmed.length / days));

    const usedIds = new Set<string>();
    balanced.flat().forEach((c) => usedIds.add(c.placeId));

    const scheduleByDay = balanced.map((cluster) => {
      const ordered = orderByNearest(cluster, hotel);
      const schedule = insertMeals(ordered, meals, usedIds, interests);
      return assignTimes(schedule);
    });

    // 5. Save into DB
    const planId = nanoid(12);
    await saveTrip({
      planId,
      userId: user.id,
      cityPlaceId,
      title: `${cityName} Trip`,
      startDate,
      endDate,
      days: scheduleByDay,
    });

    // 6. Return planId for client redirect
    return NextResponse.json({ planId });
  } catch (e) {
    console.error("Generate lỗi:", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// Counting days from start and end date, inclusive. If either is null, default to 3 days.
function countDays(start: string | null, end: string | null): number {
  if (!start || !end) return 3;   // default is 3 days if theres no start or end date
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff + 1);
}