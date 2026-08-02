import type { Candidate } from "../type";
import { haversine } from "./cluster";

//Order destination in 1 day, start from hotel, and return the ordered list of candidates
// Heuristic: nearest neighbor, always go to the neasest candidate but not visit the same candidate twice
export function orderByNearest(
  places: Candidate[],
  hotel: { lat: number; lng: number }
): Candidate[] {
  const remaining = [...places];   // copy, không phá mảng gốc
  const ordered: Candidate[] = [];

  // Vị trí hiện tại, bắt đầu từ khách sạn
  let current: { lat: number; lng: number } = hotel;

  while (remaining.length > 0) {
    // Find the nearest candidate to the current position
    let nearestIdx = 0;
    let minDist = Infinity;
    remaining.forEach((p, i) => {
      const d = haversine(current, p);
      if (d < minDist) {
        minDist = d;
        nearestIdx = i;
      }
    });

    // Add that candidate to the ordered list and remove it from remaining
    const [next] = remaining.splice(nearestIdx, 1);
    ordered.push(next);

    // move current position to the next candidate
    current = { lat: next.lat, lng: next.lng };
  }

  return ordered;
}