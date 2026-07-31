import type { Candidate, Interest, Pace } from "@/lib/type";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { viewport } from "three/tsl";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.location",
  "places.rating",
].join(",");

// Like suggestion 
const TYPE_MAP: Record<Interest, string[]> = {
  food: ["restaurant", "cafe"],
  culture: ["museum", "tourist_attraction", "historical_landmark"],
  nature: ["park", "national_park", "garden"],
  shopping: ["shopping_mall", "amusement_park"],
};

const MEAL_TYPES = ["restaurant"];

function toCandidate(
    p:any,
    interest: Interest | "meal",
): Candidate | null {
    //If theres no Id, dont use
    if(!p.id || !p.location) return null;

    return {
        placeId: p.id,
        name: p.displayName?.text ?? "",
        lat: p.location.latitude,
        lng: p.location.longitude,
        rating: p.rating ?? null, 
        interest
    }
}

const RADIUS:Record<Pace,number> = {
    relaxed: 3000,
    medium: 5000,
    packed: 7000
}

export async function collectCandidates(
    hotel:{lat:number; lng:number},
    interests: Interest[],
    pace: Pace
): Promise<{activities:Candidate[]; meals:Candidate[]}>{
    const radius = RADIUS[pace];

    const activityCalls = interests.map(async (interest)=>{
        const raw = await nearbySearch(TYPE_MAP[interest], hotel, radius);
        return raw 
            .map((p)=>toCandidate(p, interest))
            .filter((c):c is Candidate => c !== null);
    });

    const mealCall = nearbySearch(MEAL_TYPES, hotel, radius).then((raw)=>
        raw
            .map((p)=>toCandidate(p, "meal"))
            .filter((c):c is Candidate => c !== null)
    )

    const [meals, ...activityGroups] = await Promise.all([mealCall, ...activityCalls]);

    //Group acitivties and get rid of duplicated  
    const seen = new Set<string>();
    const activities:Candidate[] = [];
    for (const group of activityGroups){
      for (const c of group){
        if (!seen.has(c.placeId)){
          seen.add(c.placeId);
          activities.push(c)
        }
      }
    }

    //Remove any meals that are in activities 
    // const mealsDedup = meals.filter((c)=>!seen.has(c.placeId));

    //Cache into place_cache
    await cacheCandidates([...activities, ...meals])

    return {activities, meals};
}

//Saving candidate to place_cache
async function cacheCandidates(candidates:Candidate[]){
  if(candidates.length === 0) return;
  
  const rows = candidates.map((c)=>({
    google_place_id: c.placeId,
    name: c.name,
    formatted_address:null,
    lat:c.lat,
    lng:c.lng,
    viewport:null,
    cached_at:new Date().toISOString()
  }))

  await supabaseAdmin.from("place_cache").upsert(rows, {onConflict:"google_place_id", ignoreDuplicates:true});
}

export async function nearbySearch(
  types: string[],                        
  center: { lat: number; lng: number },   
  radius: number                          
): Promise<any[]> {
  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_PLACES_KEY!,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify({
        includedTypes: types,
        maxResultCount: 15,
        locationRestriction: {
          circle: {
            center: { latitude: center.lat, longitude: center.lng },
            radius,
          },
        },
        rankPreference: "POPULARITY",
      }),
    }
  );

  if (!res.ok) {
    console.error("Nearby Search:", res.status, await res.text());
    return [];
  }

  const data = await res.json();
  return data.places ?? [];
}