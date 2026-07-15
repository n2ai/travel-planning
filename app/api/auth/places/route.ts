import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const q = req.nextUrl.searchParams.get('q');

    if(!q) return NextResponse.json({ places: []});

    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_KEY!,
        'X-Goog-FieldMask':
            'places.id,places.displayName,places.formattedAddress,places.location',
        },
        body: JSON.stringify({ textQuery: q, languageCode: 'vi' }),
    });

    const data = await res.json();
    return NextResponse.json({ places: data.places ?? []});
}