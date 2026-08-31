import { supabaseAdmin } from "./supabase/admin";

const TTL = 25 * 24 * 60 * 60 * 1000 //25 days
export type PlaceRow = {
    google_place_id:string;
    name:string;
    formatted_address:string|null;
    lat:number;
    lng:number;
    viewport:unknown|null;
    country_code:string|null;
    cached_at:string;
}

export async function getPlace(placeId:string):Promise<PlaceRow>{
    //1 Watch cached
    const { data: cached } = await supabaseAdmin
        .from("place_cache")
        .select("*")
        .eq("google_place_id", placeId)
        .maybeSingle()
        ;
    
    if (cached && Date.now() - new Date(cached.cached_at).getTime() < TTL){
        console.log("CACHE_HIT",placeId);
        return cached as PlaceRow
    }

    //2 Call google
    console.log("CACHE_MISS -> Call google API",placeId);
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`,{
        headers:{
            "X-Goog-Api-Key": process.env.GOOGLE_PLACES_KEY!,
            "X-Goog-FieldMask": "id,displayName,formattedAddress,location,viewport,addressComponents",
        }
    })

    if(!res.ok) throw new Error(`Places ${res.status}: ${await res.text()}`);
    const p = await res.json();

    //3 After you have response, check if the place is valid 
    const country = p.addressComponents?.find((c:any)=> c.type?.includes("country"))?.shortText ?? null;

    //4 Save cache
    const row:PlaceRow = {
        google_place_id:p.id,
        name:p.displayName?.text ?? "",
        formatted_address:p.formattedAddress?? null,
        lat:p.location.latitude,
        lng:p.location.longitude,
        viewport:p.viewport ?? null,
        cached_at: new Date().toISOString(),
        country_code:country,
    };
    await supabaseAdmin.from("place_cache").upsert(row);
    return row;
}