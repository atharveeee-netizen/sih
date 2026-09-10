import React from 'react';
import { LanguageCode } from '../../lib/types';
import { LANGUAGE_OPTIONS, getTranslation } from '../../lib/i18n/dictionaries';
import { speakNarration } from '../../lib/voice/narration';
import { Check, Volume2 } from 'lucide-react';

interface LanguageScreenProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  onClose: () => void;
  voiceEnabled: boolean;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({
  currentLanguage,
  onSelectLanguage,
  onClose,
  voiceEnabled,
}) => {
  const handleSelect = (code: LanguageCode) => {
    const selectedOption = LANGUAGE_OPTIONS.find((l) => l.code === code);
    onSelectLanguage(code);

    if (voiceEnabled && selectedOption) {
      speakNarration(selectedOption.sampleAudioText, code, true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col justify-end sm:justify-center p-4">
      <div className="bg-amber-50 rounded-3xl p-6 w-full max-w-md mx-auto shadow-2xl border-4 border-amber-400 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-amber-950">
              {getTranslation(currentLanguage, 'select_language')}
            </h2>
            <p className="text-xs text-amber-800 font-medium">
              Tap any language for instant native audio voice output
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-full font-bold flex items-center justify-center text-lg"
          >
            ✕
          </button>
        </div>

        {/* Language Cards Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = lang.code === currentLanguage;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between items-start text-left min-h-[96px] transition-all active:scale-95 shadow-sm ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md font-black ring-4 ring-amber-300'
                    : 'bg-white text-gray-800 border-amber-200 hover:border-amber-400 font-bold'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">{lang.code.toUpperCase()}</span>
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-white text-amber-600 flex items-center justify-center">
                      <Check size={16} strokeWidth={3} />
                    </div>
                  ) : (
                    <Volume2 size={18} className="text-amber-500 opacity-60" />
                  )}
                </div>

                <div>
                  <div className="text-xl leading-tight font-extrabold mt-2">
                    {lang.nativeName}
                  </div>
                  <div
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-amber-100' : 'text-gray-500'
                    }`}
                  >
                    {lang.englishName}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full min-h-[52px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-lg transition-all"
        >
          Confirm & Return to App
        </button>
      </div>
    </div>
  );
};
