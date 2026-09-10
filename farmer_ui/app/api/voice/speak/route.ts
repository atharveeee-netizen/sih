import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Server-side audio buffer cache (SHA-256 keyed)
const voiceCache = new Map<string, Uint8Array>();

// Language code mapper to BCP 47 tags for Sarvam AI & Open-Source TTS
const SARVAM_LANG_MAP: Record<string, string> = {
  hi: 'hi-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  bn: 'bn-IN',
  en: 'en-IN',
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.text || !body.language) {
      return NextResponse.json({ error: 'Text and language parameters required' }, { status: 400 });
    }

    const { text, language } = body;
    const langCode = SARVAM_LANG_MAP[language] || 'hi-IN';
    const cacheKey = crypto.createHash('sha256').update(`${text}_${langCode}`).digest('hex');

    // 1. Return from Server SHA-256 Cache if available
    if (voiceCache.has(cacheKey)) {
      const cachedBuffer = voiceCache.get(cacheKey)!;
      return new Response(Buffer.from(cachedBuffer), {
        headers: {
          'Content-Type': 'audio/wav',
          'X-Voice-Engine': 'Cache-Hit',
        },
      });
    }

    const sarvamApiKey = process.env.SARVAM_API_KEY;

    // 2. Sarvam AI 'bulbul:v1' Speech Model Integration
    if (sarvamApiKey) {
      try {
        const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-subscription-key': sarvamApiKey,
          },
          body: JSON.stringify({
            inputs: [text],
            target_language_code: langCode,
            speaker: 'meera',
            pitch: 0,
            pace: 0.95,
            loudness: 1.5,
            speech_sample_rate: 22050,
            enable_preprocessing: true,
            model: 'bulbul:v1',
          }),
        });

        if (sarvamRes.ok) {
          const json = await sarvamRes.json();
          if (json.audios && json.audios[0]) {
            const base64Audio = json.audios[0];
            const audioBuffer = new Uint8Array(Buffer.from(base64Audio, 'base64'));

            voiceCache.set(cacheKey, audioBuffer);

            return new Response(Buffer.from(audioBuffer), {
              headers: {
                'Content-Type': 'audio/wav',
                'X-Voice-Engine': 'Sarvam-AI-Bulbul',
              },
            });
          }
        }
      } catch (sarvamErr) {
        console.warn('Sarvam AI model call fallback:', sarvamErr);
      }
    }

    // 3. Open-Source Speech Synthesis Fallback (gTTS / Free Indic Audio Stream)
    try {
      const encodedText = encodeURIComponent(text);
      const openSourceUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${language}&client=tw-ob`;

      const osRes = await fetch(openSourceUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (osRes.ok) {
        const arrayBuf = await osRes.arrayBuffer();
        const uintArray = new Uint8Array(arrayBuf);
        voiceCache.set(cacheKey, uintArray);
        return new Response(Buffer.from(uintArray), {
          headers: {
            'Content-Type': 'audio/mpeg',
            'X-Voice-Engine': 'OpenSource-IndicTTS',
          },
        });
      }
    } catch (osErr) {
      console.warn('Open-source TTS proxy fallback:', osErr);
    }

    // Return 204 No Content safely so client WebSpeech API triggers smoothly
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Voice proxy route handler error:', error);
    return new Response(null, { status: 204 });
  }
}
