import type { Candidate, Interest } from "../type";
import { haversine } from "./cluster";

// Schedule: acitivity or meal 
export type ScheduleItem = Candidate & {
  kind: "activity" | "meal";
  mealType?: "lunch" | "dinner";
  time?: string; // optional time for the schedule item
}

export function assignTimes(schedule:ScheduleItem[]):ScheduleItem[]{
  const START_HOUR = 8;
  const ACTIVITY_MIN = 90;
  const MEAL_MIN = 60;

  let minutes = START_HOUR * 60; //change to minutes

  return schedule.map((item)=>{
    const time = formatTime(minutes);
    minutes += item.kind === "activity" ? ACTIVITY_MIN : MEAL_MIN;
    return { ...item, time };
  })
}

const formatTime = (minutes:number):string=>{
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

//Order destination in 1 day, start from hotel, and return the ordered list of candidates
// Heuristic: nearest neighbor, always go to the neasest candidate but not visit the same candidate twice
export function orderByNearest(
  places: Candidate[],
  hotel: { lat: number; lng: number }
): Candidate[] {
  const remaining = [...places];   // copy, không phá mảng gốc
  const ordered: Candidate[] = [];

  //Start from hotel
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

//Add lunch and dinner to the ordered list of candidates, return the new list
export function insertMeals(
  ordered:Candidate[],
  meals:Candidate[],
  usedPlaceIds:Set<string>,
  interests:Interest[]
):ScheduleItem[] {
  const activities:ScheduleItem[] = ordered.map((p) => ({ ...p, kind: "activity" }));

  //FOOD-TOUR: if user only interested in food, then we don't need to insert meals
  if(interests.length === 1 && interests[0] === "food") {
    return activities;
  }

  function findMeal(near:{lat:number, lng:number}):Candidate | null{
    let best: Candidate | null = null;
    let bestDist = Infinity;
    for (const meal of meals) {
      if (usedPlaceIds.has(meal.placeId)) continue; // skip if already used
      const d = haversine(near, meal);
      if (d < bestDist) {
        bestDist = d;
        best = meal;
      }
    }

    if (best) {
      usedPlaceIds.add(best.placeId);
    }
    return best;
  }

  const result: ScheduleItem[] = [];
  const mid = Math.floor(activities.length / 2);

  activities.forEach((item, i) => {
    result.push(item);

    //Add the lunch to the middle of the day, after the first half of activities
    if (i === mid - 1) {
      const lunch = findMeal(item);
      if (lunch) {
        result.push({ ...lunch, kind: "meal", mealType: "lunch" });
      }
    }
  });

  //Add Dinner at the end
  const lastPos = activities[activities.length - 1] ?? { lat: 0, lng: 0 };
  const dinner = findMeal(lastPos);
  if (dinner) {
    result.push({ ...dinner, kind: "meal", mealType: "dinner" });
  }

  return result;

}