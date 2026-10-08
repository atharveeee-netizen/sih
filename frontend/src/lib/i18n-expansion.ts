/**
 * Indic language expansion set.
 *
 * TRANSLATIONS in i18n.ts carries written dictionaries for five languages.
 * The six below are the planned expansion, listed with the locale codes a
 * translation service expects, so the target set is recorded rather than
 * rediscovered later.
 *
 * These are intentionally not offered in the language picker. A picker that
 * lists a language and then renders English is worse than a shorter one that
 * is honest, so an entry moves into Language in i18n.ts only once its
 * dictionary is actually written.
 */

export interface IndicLanguage {
  /** ISO 639-1 code. */
  code: string;
  name: string;
  nativeName: string;
  /** Locale code used by Indic translation APIs. */
  localeCode: string;
}

/** Shipping now, with full dictionaries in i18n.ts. */
export const TRANSLATED_LANGUAGES: IndicLanguage[] = [
  { code: "en", name: "English", nativeName: "English", localeCode: "en-IN" },
  { code: "hi", name: "Hindi", nativeName: "\u0939\u093f\u0902\u0926\u0940", localeCode: "hi-IN" },
  { code: "bn", name: "Bengali", nativeName: "\u09ac\u09be\u0982\u09b2\u09be", localeCode: "bn-IN" },
  { code: "ta", name: "Tamil", nativeName: "\u0ba4\u0bae\u0bbf\u0bb4\u0bcd", localeCode: "ta-IN" },
  { code: "kn", name: "Kannada", nativeName: "\u0c95\u0ca8\u0ccd\u0ca8\u0ca1", localeCode: "kn-IN" },
];

/** Planned, dictionaries not yet written. Not shown in the picker. */
export const PLANNED_LANGUAGES: IndicLanguage[] = [
  { code: "mr", name: "Marathi", nativeName: "\u092e\u0930\u093e\u0920\u0940", localeCode: "mr-IN" },
  { code: "te", name: "Telugu", nativeName: "\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41", localeCode: "te-IN" },
  { code: "gu", name: "Gujarati", nativeName: "\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0", localeCode: "gu-IN" },
  { code: "ml", name: "Malayalam", nativeName: "\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02", localeCode: "ml-IN" },
  { code: "pa", name: "Punjabi", nativeName: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40", localeCode: "pa-IN" },
  { code: "od", name: "Odia", nativeName: "\u0b13\u0b21\u0b3c\u0b3f\u0b06", localeCode: "od-IN" },
];
