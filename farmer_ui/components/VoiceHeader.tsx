import React from 'react';
import { Volume2, VolumeX, Globe, WifiOff, Sparkles, Radio, Hexagon } from 'lucide-react';
import { LanguageCode } from '../lib/types';
import { getTranslation } from '../lib/i18n/dictionaries';

interface VoiceHeaderProps {
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  currentLanguage: LanguageCode;
  onOpenLanguageModal: () => void;
  isOffline?: boolean;
  isSpeaking?: boolean;
}

export const VoiceHeader: React.FC<VoiceHeaderProps> = ({
  voiceEnabled,
  onToggleVoice,
  currentLanguage,
  onOpenLanguageModal,
  isOffline = false,
  isSpeaking = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 text-stone-100 shadow-lg px-4 py-3 border-b border-stone-800 backdrop-blur-md">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Brand Logo & Live Connectivity Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 text-stone-950 font-black rounded-2xl flex items-center justify-center shadow-md border border-amber-400">
            <Hexagon size={22} />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight tracking-tight text-white flex items-center gap-1.5">
              Beevil Knievel Companion
            </h1>
            {isOffline ? (
              <span className="flex items-center gap-1 text-[11px] text-stone-400 bg-stone-800 px-2 py-0.5 rounded-full font-medium">
                <WifiOff size={11} /> Offline Cached
              </span>
            ) : (
              <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
                <Radio size={12} className="text-emerald-400 animate-pulse" /> Live Telemetry Mesh
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Native Language Selector Button */}
          <button
            onClick={onOpenLanguageModal}
            className="min-h-[40px] px-3 py-1.5 bg-stone-800 hover:bg-stone-700 active:scale-95 rounded-xl flex items-center gap-1.5 text-xs font-bold border border-stone-700 text-stone-200 shadow-xs transition-all"
            aria-label="Select Language"
          >
            <Globe size={16} className="text-amber-400" />
            <span className="uppercase tracking-wider">{currentLanguage}</span>
          </button>

          {/* Voice Guidance Switch */}
          <button
            onClick={onToggleVoice}
            className={`min-h-[40px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold text-xs shadow-xs transition-all active:scale-95 border ${
              voiceEnabled
                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
            aria-label="Toggle Voice Guidance"
          >
            {voiceEnabled ? (
              <>
                <Volume2 size={18} className={isSpeaking ? 'animate-bounce' : ''} />
                {isSpeaking && <Sparkles size={12} className="text-amber-300 animate-spin" />}
              </>
            ) : (
              <VolumeX size={18} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
