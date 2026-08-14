import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function detectLocationFromReel({
  videoUrl,
  caption,
  hashtags,
}: {
  videoUrl: string;
  caption: string;
  hashtags: string[];
}) {
  // 1. Download public video
  const videoResponse = await fetch(videoUrl);

  if (!videoResponse.ok) {
    throw new Error(
      `Failed to download video: ${videoResponse.status}`
    );
  }

  const arrayBuffer = await videoResponse.arrayBuffer();

  const mimeType =
    videoResponse.headers.get("content-type") || "video/mp4";

  const videoBlob = new Blob([arrayBuffer], {
    type: mimeType,
  });

  console.log("Video size:", videoBlob.size);
  console.log("Video type:", videoBlob.type);

  if (videoBlob.size === 0) {
    throw new Error("Downloaded video is empty");
  }

  // 2. Upload video to Gemini Files API
  const file = await ai.files.upload({
    file: videoBlob,
    config: {
      mimeType,
    },
  });

  console.log("Gemini file:", file.name);

  // 3. Wait until video processing is complete
  let processedFile = await ai.files.get({
    name: file.name!,
  });

  while (processedFile.state === "PROCESSING") {
    console.log("Gemini is processing video...");

    await new Promise((resolve) =>
      setTimeout(resolve, 5000)
    );

    processedFile = await ai.files.get({
      name: file.name!,
    });
  }

  if (processedFile.state === "FAILED") {
    throw new Error(
      "Gemini failed to process video"
    );
  }

  console.log("Gemini video processing completed");

  // 4. Prompt
  const prompt = `
You are a real-world location extraction system.

Determine the most likely real-world location where this
Instagram Reel was filmed or is referring to.

Use ALL available evidence:

1. Visual information from the video
2. Text visible inside the video
3. Spoken words and audio
4. Instagram caption
5. Instagram hashtags

Instagram caption:
${caption || "(none)"}

Instagram hashtags:
${
  hashtags.length > 0
    ? hashtags.join(", ")
    : "(none)"
}

IMPORTANT RULES:

- Do NOT guess a location.
- Do NOT infer a city simply because a country hashtag exists.
- Look for strong evidence such as:
  landmarks,
  street signs,
  business names,
  city names,
  spoken location names,
  visible text,
  recognizable buildings,
  or other location-specific evidence.
- If there is not enough evidence, return found=false.
- Prefer the most specific location possible.
- Do not invent a location.

Return ONLY valid JSON.

Example when a location is found:

{
  "found": true,
  "location": "Da Nang, Vietnam",
  "confidence": 0.95,
  "reason": "The video shows a recognizable landmark in Da Nang."
}

Example when no location can be determined:

{
  "found": false,
  "location": null,
  "confidence": 0,
  "reason": "No reliable location evidence found."
}
`;

  // 5. Gemini Interactions API
  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input: [
      {
        type: "video",
        uri: processedFile.uri!,
        mime_type: processedFile.mimeType || mimeType,
      },
      {
        type: "text",
        text: prompt,
      },
    ],
  });

  // 6. Get text result
  const text = interaction.output_text || "";

  console.log("Gemini response:", text);

  // 7. Clean possible markdown
  const cleanText = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(cleanText);
  } catch {
    throw new Error(
      `Gemini returned invalid JSON: ${text}`
    );
  }
}