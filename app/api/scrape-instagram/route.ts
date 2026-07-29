import { ApifyClient } from "apify-client";
import { NextResponse } from "next/server";

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});


export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    const input = {
      search: keyword,
      searchType: "popular", 
      searchLimit: 1,
    };

    const run = await client
      .actor("DrF9mzPPEuVizVF4l")
      .call(input);

    const { items } = await client
      .dataset(run.defaultDatasetId)
      .listItems();

    return NextResponse.json(items);
  } catch (err: any) {
  console.error("Apify Error:", err);

  return NextResponse.json(
    {
      message: err.message,
      stack: err.stack,
    },
    { status: 500 }
  );
}
}