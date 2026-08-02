import { NextResponse } from "next/server";
import { collectCandidates } from "@/lib/trip-gen/collect";
import { trimByRating, kMeans, balanceClusters } from "@/lib/trip-gen/cluster";
import { orderByNearest } from "@/lib/trip-gen/order";

export async function GET() {
  try {
    const hotel = { lat: 21.0285, lng: 105.8542 };
    const days = 3;
    const perDay = 4;

    // Pha 1: thu thập
    const { activities } = await collectCandidates(
      hotel, ["food", "culture", "nature"], "medium"
    );

    // Pha 2a: cắt còn days × perDay
    const trimmed = trimByRating(activities, days * perDay);

    // Pha 2b: gom thành `days` cụm
    const clusters = kMeans(trimmed, days);
    const balanced = balanceClusters(clusters, Math.ceil(trimmed.length / days));

    return NextResponse.json({
      clusters: balanced.map((cluster, i) => {
        const ordered = orderByNearest(cluster, hotel);
        return {
          day: i + 1,
          route: ordered.map((c, idx) => `${idx + 1}. ${c.name}`),
        };
      }),
    });

    return NextResponse.json({
      totalTrimmed: trimmed.length,
      clusters: balanced.map((cluster, i) => ({
        day: i + 1,
        count: cluster.length,
        places: cluster.map((c) => `${c.name} (⭐${c.rating})`),
      })),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}