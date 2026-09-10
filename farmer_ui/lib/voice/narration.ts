import { LanguageCode } from '../types';

let currentAudio: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

export async function speakNarration(
  text: string,
  lang: LanguageCode,
  enabled: boolean = true,
  onStart?: () => void,
  onEnd?: () => void
) {
  if (!enabled || typeof window === 'undefined') return;

  // Stop any currently active playback
  stopNarration();

  onStart?.();

  try {
    // 1. Request audio from server voice API (Sarvam AI 'bulbul:v1' or Open-Source Indic TTS)
    const response = await fetch('/api/voice/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language: lang }),
    });

    const engine = response.headers.get('X-Voice-Engine') || 'ServerProxy';

    if (response.ok && response.status === 200) {
      const blob = await response.blob();
      if (blob.size > 100) {
        console.log(`🔊 Playing audio narration via ${engine} (${lang})`);
        const audioUrl = URL.createObjectURL(blob);
        currentAudio = new Audio(audioUrl);
        currentAudio.onended = () => {
          onEnd?.();
          currentAudio = null;
        };
        currentAudio.onerror = () => {
          fallbackWebSpeech(text, lang, onEnd);
        };
        await currentAudio.play();
        return;
      }
    }
  } catch (err) {
    console.warn('Server voice endpoint unavailable, triggering browser WebSpeech fallback', err);
  }

  // 2. Fallback to Web Speech API
  fallbackWebSpeech(text, lang, onEnd);
}

function fallbackWebSpeech(text: string, lang: LanguageCode, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);

  const langMap: Record<LanguageCode, string> = {
    hi: 'hi-IN',
    mr: 'mr-IN',
    gu: 'gu-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    kn: 'kn-IN',
    bn: 'bn-IN',
    en: 'en-IN',
  };

  utterance.lang = langMap[lang] || 'hi-IN';
  utterance.rate = 0.9;
  utterance.onend = () => {
    onEnd?.();
    currentUtterance = null;
  };
  utterance.onerror = () => {
    onEnd?.();
    currentUtterance = null;
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopNarration() {
  if (typeof window === 'undefined') return;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}
