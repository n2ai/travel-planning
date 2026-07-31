import { NextResponse } from "next/server";
import { collectCandidates } from "@/lib/trip-gen/collect";
import { haversine } from "@/lib/trip-gen/cluster";

export async function GET() {
  try {
    const result = await collectCandidates(
      { lat: 21.0285, lng: 105.8542 },   // Hồ Gươm, Hà Nội
      ["food", "culture", "nature"],     // 3 sở thích
      "medium"                            // nhịp độ
    );
    
    const d = haversine(
    { lat: 21.0285, lng: 105.8542 },
    { lat: 21.0587, lng: 105.8230 }
    );
    console.log("Khoảng cách:", d.toFixed(2), "km");

    return NextResponse.json({
      activityCount: result.activities.length,
      mealCount: result.meals.length,
      activities: result.activities.map(
        (c) => `${c.name} — ${c.interest} — ⭐${c.rating ?? "?"}`
      ),
      meals: result.meals.map((c) => `${c.name} — ⭐${c.rating ?? "?"}`),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}