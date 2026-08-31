import { NextResponse } from "next/server";
import { estimateBudget } from "@/lib/trip-gen/budget";
export async function GET() {
  // Test data: 2 meals + 2 attractions, 3 days in Vietnam
  const vn = estimateBudget(
    [
      { interest: "meal", priceLevel: 1 },
      { interest: "meal", priceLevel: 2 },
      { interest: "culture", priceLevel: null },
      { interest: "nature", priceLevel: null },
    ],
    3,        // days
    "VN",     // Vietnam
    15        // hotel $15/night
  );

  // Same trip but in Japan — should cost more
  const jp = estimateBudget(
    [
      { interest: "meal", priceLevel: 1 },
      { interest: "meal", priceLevel: 2 },
      { interest: "culture", priceLevel: null },
      { interest: "nature", priceLevel: null },
    ],
    3,
    "JP",
    35
  );

  return NextResponse.json({ vietnam: vn, japan: jp });
}