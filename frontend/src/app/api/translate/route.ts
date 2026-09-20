import { NextRequest, NextResponse } from "next/server";
import { SARVAM_API_KEY, SARVAM_TRANSLATE_URL } from "@/lib/sarvam";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, targetLang, sourceLang = "en-IN" } = body;

    if (!text || !targetLang) {
      return NextResponse.json({ error: "Missing text or targetLang" }, { status: 400 });
    }

    // Call Sarvam AI Translation API
    const response = await fetch(SARVAM_TRANSLATE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": SARVAM_API_KEY,
      },
      body: JSON.stringify({
        input: text,
        source_language_code: sourceLang,
        target_language_code: targetLang,
        mode: "formal",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Sarvam AI returned ${response.status}: ${errText}`);
      // Return 200 with fallback text so frontend UI continues seamlessly
      return NextResponse.json({
        translatedText: text,
        sourceLang,
        targetLang,
        isFallback: true,
        upstreamStatus: response.status,
      });
    }

    const data = await response.json();
    return NextResponse.json({
      translatedText: data.translated_text || text,
      sourceLang,
      targetLang,
    });
  } catch (error: any) {
    return NextResponse.json({
      translatedText: "fallback",
      error: error.message,
      isFallback: true,
    });
  }
}
