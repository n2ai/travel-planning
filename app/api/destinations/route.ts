import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const q = req.nextUrl.searchParams.get('q');
    if (!q) return NextResponse.json({ suggestions:[] });

    const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': process.env.GOOGLE_PLACES_KEY!,
        },
        body:JSON.stringify({
            input: q,
            languageCode: 'vi',
            includedPrimaryTypes: [
                'country',
                'administrative_area_level_1',
                'locality',
            ], 
        })
    })

    const data = await res.json();
    if(data.error){
        console.error('Autocomplete error:', data.error);
        return NextResponse.json({suggestions:[]}, {status:502})
    }

    //normalized for user
    const suggestions = (data.suggestions ?? []).map((s:any) => ({
        placeId: s.placePrediction.placeId,
        text: s.placePrediction.text.text,
        mainText: s.placePrediction.structuredFormat.mainText.text,
        types: s.placePrediction.types
    }));

    return NextResponse.json({ suggestions });
}