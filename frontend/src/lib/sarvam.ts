/**
 * Sarvam AI Indic Language Translation & Speech Engine
 * Powered by Sarvam AI Samvaad API (SIH 26021 Multilingual Platform)
 * API Key: sk_samvaad_ovr3ypex_CpgaqbjChsfAVGsFPAyqWhS7
 */

export const SARVAM_API_KEY = "sk_samvaad_ovr3ypex_CpgaqbjChsfAVGsFPAyqWhS7";
export const SARVAM_TRANSLATE_URL = "https://api.sarvam.ai/translate";

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  sarvamCode: string;
}

export const INDIC_LANGUAGES: SupportedLanguage[] = [
  { code: "en", name: "English", nativeName: "English", sarvamCode: "en-IN" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", sarvamCode: "hi-IN" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", sarvamCode: "mr-IN" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", sarvamCode: "bn-IN" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", sarvamCode: "ta-IN" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", sarvamCode: "te-IN" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", sarvamCode: "kn-IN" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", sarvamCode: "gu-IN" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", sarvamCode: "ml-IN" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", sarvamCode: "pa-IN" },
  { code: "od", name: "Odia", nativeName: "ଓଡ଼ିଆ", sarvamCode: "od-IN" },
];

// In-memory memory cache for fast client transitions without redundant API hits
const memoryCache = new Map<string, string>();

/**
 * Translates text from English into any supported Indian language using Sarvam AI.
 * Uses aggressive localStorage + memory caching to prevent redundant mobile data usage.
 */
export async function translateWithSarvam(
  text: string,
  targetLangCode: string,
  sourceLangCode = "en-IN"
): Promise<string> {
  if (!text || targetLangCode === "en" || targetLangCode === "en-IN") {
    return text;
  }

  const langMeta = INDIC_LANGUAGES.find((l) => l.code === targetLangCode || l.sarvamCode === targetLangCode);
  if (!langMeta) {
    return text;
  }

  const targetSarvam = langMeta.sarvamCode;
  const cacheKey = `sarvam_${targetSarvam}_${text.trim().substring(0, 80)}`;

  // 1. Check in-memory cache
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  // 2. Check browser localStorage if available
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        memoryCache.set(cacheKey, stored);
        return stored;
      }
    } catch {
      // localStorage disabled or quota exceeded
    }
  }

  // 3. Call local proxy or direct Sarvam API
  try {
    const isBrowser = typeof window !== "undefined";
    const endpoint = isBrowser ? "/api/translate" : SARVAM_TRANSLATE_URL;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    let bodyPayload: any;

    if (isBrowser) {
      bodyPayload = { text, targetLang: targetSarvam, sourceLang: sourceLangCode };
    } else {
      headers["api-subscription-key"] = SARVAM_API_KEY;
      bodyPayload = {
        input: text,
        source_language_code: sourceLangCode,
        target_language_code: targetSarvam,
        mode: "formal",
      };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(bodyPayload),
    });

    if (!response.ok) {
      console.warn(`Sarvam AI translation returned ${response.status}`);
      return text;
    }

    const data = await response.json();
    const translated = data?.translatedText || data?.translated_text || text;

    // Cache result
    memoryCache.set(cacheKey, translated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(cacheKey, translated);
      } catch {}
    }

    return translated;
  } catch (err) {
    console.warn("Sarvam AI translation network fallback:", err);
    return text;
  }
}
