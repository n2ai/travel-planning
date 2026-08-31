import type { Interest } from "../type";

// Base daily costs per country (USD), backpacker tier.
// meal = per meal, ticket = avg attraction entry, hotel = per night (budget).
type BaseCost = { meal: number; ticket: number; hotel: number };

const COUNTRY_BASE: Record<string, BaseCost> = {
  VN: { meal: 2.5, ticket: 2, hotel: 12 },   // Vietnam
  TH: { meal: 3, ticket: 5, hotel: 15 },     // Thailand
  ID: { meal: 3, ticket: 5, hotel: 14 },     // Indonesia
  JP: { meal: 7, ticket: 6, hotel: 35 },     // Japan
  KR: { meal: 7, ticket: 5, hotel: 30 },     // South Korea
  MY: { meal: 3, ticket: 4, hotel: 16 },     // Malaysia
  SG: { meal: 8, ticket: 10, hotel: 60 },    // Singapore
  US: { meal: 15, ticket: 20, hotel: 90 },   // United States
  FR: { meal: 14, ticket: 15, hotel: 70 },   // France
  IT: { meal: 12, ticket: 12, hotel: 60 },   // Italy
};

// Fallback when country not in table
const DEFAULT_BASE: BaseCost = { meal: 8, ticket: 10, hotel: 40 };

// price_level multiplier: adjusts base meal cost when Google has data
const PRICE_MULT: Record<number, number> = {
  0: 0.6,   // free/very cheap
  1: 1.0,   // base
  2: 1.8,
  3: 3.5,
  4: 6.0,
};

export type StopForBudget = {
  interest: Interest | "meal";
  priceLevel: number | null;
};

export type BudgetResult = {
  food: number;
  tickets: number;
  hotel: number;
  total: number;
  perDay: number;
  currency: "USD";
};

export function estimateBudget(
  stops: StopForBudget[],
  numDays: number,
  countryCode: string | null,
  hotelPricePerNight?: number   // if user picked a hotel, use its real price
): BudgetResult {
  const base = COUNTRY_BASE[countryCode ?? ""] ?? DEFAULT_BASE;

  let food = 0;
  let tickets = 0;

  for (const stop of stops) {
    if (stop.interest === "meal" || stop.interest === "food") {
      // Meal: base × price_level multiplier (or base if no level)
      const mult = stop.priceLevel != null ? PRICE_MULT[stop.priceLevel] ?? 1 : 1;
      food += base.meal * mult;
    } else if (stop.interest === "culture" || stop.interest === "nature") {
      // Attraction ticket
      tickets += base.ticket;
    }
    // shopping/other: skip (unpredictable)
  }

  // Breakfast: one per day (not in itinerary)
  food += base.meal * numDays;

  // Hotel: use real price if given, else country base
  const nights = Math.max(1, numDays - 1);
  const nightly = hotelPricePerNight ?? base.hotel;
  const hotel = nightly * nights;

  const total = Math.round(food + tickets + hotel);
  const perDay = Math.round(total / numDays);

  return {
    food: Math.round(food),
    tickets: Math.round(tickets),
    hotel: Math.round(hotel),
    total,
    perDay,
    currency: "USD",
  };
}