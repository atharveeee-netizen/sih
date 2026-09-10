import React, { useState } from 'react';
import { Mic, MicOff, Check, AlertCircle, Sparkles, Volume2 } from 'lucide-react';
import { LanguageCode } from '../../lib/types';
import { getTranslation } from '../../lib/i18n/dictionaries';
import { speakNarration } from '../../lib/voice/narration';

interface HivePalInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  hiveId: number;
  hiveName: string;
  currentLanguage: LanguageCode;
  onSaveInspection?: (data: InspectionRecord) => void;
}

export interface InspectionRecord {
  hiveId: number;
  date: string;
  queenSeen: boolean | null;
  broodPatternScore: number; // 0-10
  honeyStoresScore: number; // 0-10
  temperamentScore: number; // 0-10
  notes: string;
  treatmentApplied: string;
}

const SCALE_PRESETS = [0, 2, 5, 7, 10];

export const HivePalInspectionModal: React.FC<HivePalInspectionModalProps> = ({
  isOpen,
  onClose,
  hiveId,
  hiveName,
  currentLanguage,
  onSaveInspection,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [queenSeen, setQueenSeen] = useState<boolean | null>(null);
  const [broodScore, setBroodScore] = useState<number>(7);
  const [storesScore, setStoresScore] = useState<number>(8);
  const [temperament, setTemperament] = useState<number>(8);
  const [notes, setNotes] = useState<string>('');
  const [treatment, setTreatment] = useState<string>('None');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechFeedback, setSpeechFeedback] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const steps = [
    { id: 'queen', title: 'Queen & Brood Activity', subtitle: 'Step 1 of 3' },
    { id: 'stores', title: 'Honey Stores & Health', subtitle: 'Step 2 of 3' },
    { id: 'voice_notes', title: 'Audio & Field Notes', subtitle: 'Step 3 of 3' },
  ];

  // Speech Recognition integration (Web Speech API) for hands-free farmer voice notes
  const toggleVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSpeechFeedback('Voice recognition not supported on this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    try {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechFeedback('Listening... Speak field observations clearly.');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNotes((prev) => (prev ? `${prev}. ${transcript}` : transcript));
        setSpeechFeedback(`Recorded: "${transcript}"`);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        setSpeechFeedback(`Voice error: ${event.error || 'Check microphone permission'}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e: any) {
      setSpeechFeedback('Mic failed: ' + e.message);
      setIsListening(false);
    }
  };

  const handleSave = () => {
    const record: InspectionRecord = {
      hiveId,
      date: new Date().toISOString(),
      queenSeen,
      broodPatternScore: broodScore,
      honeyStoresScore: storesScore,
      temperamentScore: temperament,
      notes,
      treatmentApplied: treatment,
    };

    if (onSaveInspection) {
      onSaveInspection(record);
    }
    setIsSaved(true);
    speakNarration('Field inspection saved successfully', currentLanguage, true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col justify-end sm:justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl w-full max-w-md mx-auto overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-white">
        
        {/* Top Header & Progress Segments */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-black tracking-wider uppercase text-amber-400">
                {steps[currentStep].subtitle} - {hiveName} (#{hiveId})
              </span>
              <h2 className="text-xl font-black text-white mt-0.5">
                {steps[currentStep].title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>
          </div>

          {/* Segmented Progress bar */}
          <div className="mt-4 flex gap-1.5">
            {steps.map((s, idx) => (
              <div
                key={s.id}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  idx < currentStep
                    ? 'bg-amber-400'
                    : idx === currentStep
                    ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Step 1: Queen & Brood */}
          {currentStep === 0 && (
            <div className="space-y-5">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Queen Spotted in Hive?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: true, label: 'Yes, Queen Seen' },
                    { val: false, label: 'No Queen' },
                    { val: null, label: 'Not Checked' },
                  ].map((opt) => {
                    const isSelected = queenSeen === opt.val;
                    return (
                      <button
                        key={String(opt.val)}
                        type="button"
                        onClick={() => setQueenSeen(opt.val)}
                        className={`py-3.5 px-2 rounded-2xl border text-xs font-black transition-all flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full flex items-center justify-center border border-current text-[10px]">
                          {isSelected ? '✓' : '•'}
                        </span>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brood Pattern TapScale */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Brood Pattern Density
                  </span>
                  <span className="text-sm font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/60">
                    {broodScore} / 10
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBroodScore((v) => Math.max(0, v - 1))}
                    className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-lg font-black text-slate-300 hover:bg-slate-700 active:scale-95"
                  >
                    -
                  </button>
                  <div className="grid grid-cols-5 gap-1 flex-1">
                    {SCALE_PRESETS.map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setBroodScore(num)}
                        className={`h-12 rounded-xl border text-sm font-black transition-all active:scale-95 ${
                          broodScore === num
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setBroodScore((v) => Math.min(10, v + 1))}
                    className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-lg font-black text-slate-300 hover:bg-slate-700 active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Stores & Temperament */}
          {currentStep === 1 && (
            <div className="space-y-5">
              {/* Stores TapScale */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Honey & Pollen Reserves
                  </span>
                  <span className="text-sm font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/60">
                    {storesScore} / 10
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStoresScore((v) => Math.max(0, v - 1))}
                    className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-lg font-black text-slate-300 hover:bg-slate-700 active:scale-95"
                  >
                    -
                  </button>
                  <div className="grid grid-cols-5 gap-1 flex-1">
                    {SCALE_PRESETS.map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setStoresScore(num)}
                        className={`h-12 rounded-xl border text-sm font-black transition-all active:scale-95 ${
                          storesScore === num
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                            : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStoresScore((v) => Math.min(10, v + 1))}
                    className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-lg font-black text-slate-300 hover:bg-slate-700 active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Colony Temperament */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Colony Calmness / Behavior
                  </span>
                  <span className="text-sm font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
                    {temperament} / 10 (Gentle)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 10, label: 'Very Gentle' },
                    { val: 6, label: 'Moderate' },
                    { val: 2, label: 'Aggressive / Defensive' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setTemperament(opt.val)}
                      className={`py-3 px-2 rounded-2xl border text-xs font-bold transition-all ${
                        temperament === opt.val
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Treatment applied */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
                  Field Treatment Applied
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['None', 'Sugar Syrup Fed', 'Oxalic Acid (Mite)', 'Organic Thymol'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTreatment(t)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all ${
                        treatment === t
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Voice Dictation & Notes */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center space-y-3">
                <div className="text-xs font-bold text-slate-400">
                  Farmer Field Hands-Free Voice Dictation
                </div>

                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50'
                      : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 hover:scale-105 active:scale-95'
                  }`}
                >
                  {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                </button>

                <p className="text-xs font-bold text-amber-300 min-h-[18px]">
                  {speechFeedback || 'Tap mic and speak notes without taking off gloves.'}
                </p>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                  Inspection Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Hive active, supers 80% filled, healthy capped brood..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              {isSaved && (
                <div className="p-3 bg-emerald-950 border border-emerald-500 rounded-xl text-emerald-300 text-xs font-black flex items-center justify-center gap-2">
                  <Check size={16} /> Inspection Synced to HoneyChain
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex gap-2">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s - 1)}
              className="py-3.5 px-4 rounded-2xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 active:scale-95"
            >
              Back
            </button>
          )}

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm active:scale-95 transition-all shadow-md shadow-amber-500/20"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaved}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm active:scale-95 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Check size={18} /> Confirm & Save Inspection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
