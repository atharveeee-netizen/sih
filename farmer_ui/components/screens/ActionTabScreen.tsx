import React from 'react';
import { HiveStatus, LanguageCode } from '../../lib/types';
import { getTranslation } from '../../lib/i18n/dictionaries';
import { HiveStatusIcon } from '../ui/HiveStatusIcon';
import { speakNarration } from '../../lib/voice/narration';
import { CheckCircle2, PhoneCall, Volume2, Zap } from 'lucide-react';

interface ActionTabScreenProps {
  hives: HiveStatus[];
  currentLanguage: LanguageCode;
  onMarkActionDone: (hiveId: number, riskId: string) => void;
  onRequestHelp: (hiveId: number, riskType: string) => void;
}

export const ActionTabScreen: React.FC<ActionTabScreenProps> = ({
  hives,
  currentLanguage,
  onMarkActionDone,
  onRequestHelp,
}) => {
  const hivesWithRisks = hives.filter((h) => h.activeRisks.length > 0);

  const handleSpeakRisk = (hiveName: string, actionKey: string) => {
    const text = `${hiveName}. ${getTranslation(currentLanguage, actionKey)}`;
    speakNarration(text, currentLanguage, true);
  };

  return (
    <div className="flex flex-col gap-4 pb-24 max-w-md mx-auto px-4 pt-4">
      {/* Title Card */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-amber-200">
        <h2 className="text-xl font-black text-amber-950 flex items-center justify-between">
          <span className="flex items-center gap-2"><Zap size={18} className="text-amber-600" /> {getTranslation(currentLanguage, 'actions_title')}</span>
          <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
            Language: {currentLanguage.toUpperCase()}
          </span>
        </h2>
        <p className="text-xs text-gray-600 font-bold mt-1">
          AI Risk Warnings & Recommended Hive Maintenance
        </p>
      </div>

      {/* Empty State when no active risks */}
      {hivesWithRisks.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-200 text-center flex flex-col items-center my-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 shadow-inner">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-xl font-extrabold text-emerald-950">
            {getTranslation(currentLanguage, 'no_actions_title')}
          </h3>
          <p className="text-xs font-bold text-gray-500 max-w-xs mt-1">
            {getTranslation(currentLanguage, 'no_actions_sub')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {hivesWithRisks.map((hive) =>
            hive.activeRisks.map((risk) => (
              <div
                key={risk.id}
                className="bg-white rounded-3xl p-5 shadow-md border-2 border-amber-300 flex flex-col gap-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HiveStatusIcon status={hive.overallStatus} size="sm" />
                    <div>
                      <h4 className="font-extrabold text-base text-gray-900">
                        {hive.hiveName} <span className="text-xs text-amber-700">(#{hive.hiveId})</span>
                      </h4>
                      <span className="text-[11px] font-bold text-gray-500">
                        Detected {new Date(risk.detectedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* Voice Speak Warning Button */}
                  <button
                    onClick={() => handleSpeakRisk(hive.hiveName, risk.recommendedAction)}
                    className="p-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1 border border-amber-400"
                    title={`Hear warning in ${currentLanguage.toUpperCase()}`}
                  >
                    <Volume2 size={18} />
                    <span className="text-[10px] uppercase font-black">{currentLanguage}</span>
                  </button>
                </div>

                {/* Instruction Card */}
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                  <p className="text-sm font-extrabold text-amber-950 leading-snug">
                    {getTranslation(currentLanguage, risk.recommendedAction)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onMarkActionDone(hive.hiveId, risk.id)}
                    className="min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 size={18} />
                    {getTranslation(currentLanguage, 'mark_done')}
                  </button>

                  <button
                    onClick={() => onRequestHelp(hive.hiveId, risk.type)}
                    className="min-h-[48px] py-3 bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-900 font-extrabold text-xs rounded-2xl border border-amber-300 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <PhoneCall size={18} className="text-amber-700" />
                    {getTranslation(currentLanguage, 'request_help')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
