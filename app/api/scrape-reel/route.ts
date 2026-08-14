import { ApifyClient } from "apify-client";
import { NextResponse } from "next/server";
import { detectLocationFromReel } from "@/lib/gemini/gemini";;

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { reelUrl } = await req.json();

    if (!reelUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "Reel URL is required",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // 1. Scrape Reel with Apify
    // -----------------------------

    const input = {
      username: [reelUrl],
      resultsLimit: 1,
      skipPinnedPosts: false,
      skipTrialReels: false,
      includeSharesCount: false,
      includeTranscript: false,
      includeDownloadedVideo: false,
    };

    const run = await client.actor("xMc5Ga1oCONPmWJIa").call(input);


    const { items } = await client
      .dataset(run.defaultDatasetId)
      .listItems();

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No Reel data found",
        },
        { status: 404 }
      );
    }

    const reel = items[0] as any;

    const location = reel.locationName || null;
    const caption = reel.caption || "";

    const hashtags = Array.isArray(reel.hashtags)
      ? reel.hashtags
      : [];

    const displayUrl = reel.displayUrl || null;

    const images = Array.isArray(reel.images)
      ? reel.images
      : [];

    const videoUrl = reel.videoUrl || null;
    const audioUrl = reel.audioUrl || null;

    // -----------------------------
    // 2. Nếu Instagram có location
    // -----------------------------

    if (location && location.trim() !== "") {
      return NextResponse.json({
        success: true,
        source: "instagram",
        location: location.trim(),
      });
    }

    // -----------------------------
    // 3. Không có location
    // → gọi Gemini
    // -----------------------------

    if (!videoUrl) {
      return NextResponse.json({
        success: true,
        source: "none",
        location: null,
        caption,
        hashtags,
        videoUrl,
      });
    }

    const aiResult = await detectLocationFromReel({
      videoUrl,
      caption,
      hashtags,
    });

    // -----------------------------
    // 4. Gemini tìm được location
    // -----------------------------

    if (
      aiResult.found &&
      aiResult.location
    ) {
      return NextResponse.json({
        success: true,
        source: "gemini",
        location: aiResult.location,
        confidence: aiResult.confidence,
        reason: aiResult.reason,
        videoUrl,
      });
    }

    // -----------------------------
    // 5. Gemini cũng không tìm được
    // -----------------------------

    return NextResponse.json({
      success: true,
      source: "none",
      location: null,

      caption,
      hashtags,
      videoUrl,
    });

  } catch (err: any) {
    console.error("Scrape Reel Error:", err);

    return NextResponse.json(
      {
        success: false,
        message:
          err.message ||
          "Failed to scrape Reel",
      },
      { status: 500 }
    );
  }
}