import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { collectCandidates } from "@/lib/trip-gen/collect";
import { trimByRating, kMeans, balanceClusters } from "@/lib/trip-gen/cluster";
import { orderByNearest, insertMeals, assignTimes } from "@/lib/trip-gen/order";
import { saveTrip } from "@/lib/trip-gen/save";
import type { Interest } from "@/lib/type";

export async function GET() {
  try {
    const hotel = { lat: 21.0285, lng: 105.8542 };
    const interests: Interest[] = ["food", "culture", "nature"];
    const days = 3;
    const perDay = 4;

    const { activities, meals } = await collectCandidates(hotel, interests, "medium");
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

    const planId = nanoid(12);
    await saveTrip({
      planId,
      userId: "16ba72d7-8874-4cf6-a53e-660034d69459",   // tạm hardcode
      cityPlaceId: "ChIJ_hanoi_placeid",
      title: "Hanoi Trip",
      startDate: "2026-05-01",
      endDate: "2026-05-03",
      days: scheduleByDay,
    });

    return NextResponse.json({ planId, message: "Đã lưu!" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}