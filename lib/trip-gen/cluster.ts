import type { Candidate } from "../type";

type Cluster = {
    center : { lat:number, lng:number},
    points : Candidate[]
}

//Range between 2 position
export function haversine(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371; 
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function toRad(dog:number):number{
    return (dog * Math.PI)/180;
}

export function trimByRating(
    candidate: Candidate[],
    limit:number
):Candidate[]{
    return [...candidate]
        .sort(((a,b)=> (b.rating ?? 0) - (a.rating ?? 0) ))
        .slice(0, limit)
}