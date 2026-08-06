import { NextResponse } from "next/server";
import { collectCandidates } from "@/lib/trip-gen/collect";
import { trimByRating, kMeans, balanceClusters } from "@/lib/trip-gen/cluster";
import { orderByNearest,insertMeals,assignTimes } from "@/lib/trip-gen/order";
import { Interest } from "@/lib/type";

export async function GET() {
  try {
    const hotel = { lat: 21.0285, lng: 105.8542 };
    const days = 3;
    const perDay = 6;
    const interests:Interest[] = ["food"];
    // Pha 1: thu thập
    const { activities, meals } = await collectCandidates(
    hotel, interests, "medium"
  );

    // Pha 2a: cắt còn days × perDay
    const trimmed = trimByRating(activities, days * perDay);

    // Pha 2b: gom thành `days` cụm
    const clusters = kMeans(trimmed, days);
    const balanced = balanceClusters(clusters, Math.ceil(trimmed.length / days));

    const usedIds = new Set<string>();
    
    balanced.flat().forEach((c) => usedIds.add(c.placeId));
    
    return NextResponse.json({
    clusters: balanced.map((cluster, i) => {
      const ordered = orderByNearest(cluster, hotel);
      const schedule = insertMeals(ordered, meals, usedIds, interests);
      const scheduleWithTimes = assignTimes(schedule);
      return {
        day: i + 1,
        schedule: scheduleWithTimes.map((item) =>
        item.kind === "meal"
          ? `${item.time} 🍜 ${item.mealType}: ${item.name}`
          : `${item.time} 📍 ${item.name}`
      ),
      };
    }),
  });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}