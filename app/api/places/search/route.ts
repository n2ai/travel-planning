import { NextResponse } from "next/server";

// Autocomplete restricted to a circle around the city center
export async function POST(req: Request) {
  const { query, lat, lng } = await req.json();

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const res = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_PLACES_KEY!,
      },
      body: JSON.stringify({
        input: query,
        includedPrimaryTypes: ["establishment"],
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 30000,
          },
        },
      }),
    }
  );

  if (!res.ok) {
    console.error("Autocomplete failed:", res.status, await res.text());
    return NextResponse.json({ suggestions: [] });
  }

  const data = await res.json();
  const suggestions = (data.suggestions ?? []).map((s: any) => ({
    placeId: s.placePrediction?.placeId,
    text: s.placePrediction?.text?.text ?? "",
  }));

  return NextResponse.json({ suggestions });
}