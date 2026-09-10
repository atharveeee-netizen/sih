import React, { useEffect } from 'react';
import { HiveStatus, LanguageCode } from '../../lib/types';
import { getTranslation } from '../../lib/i18n/dictionaries';
import { HiveStatusIcon } from '../ui/HiveStatusIcon';
import { GaugeMeter } from '../ui/GaugeMeter';
import { speakNarration } from '../../lib/voice/narration';
import { Thermometer, Droplets, Volume2, Wind, AlertOctagon, X, PhoneCall, Volume2 as VoiceIcon, AlertTriangle, Bug, Flame, ClipboardCheck } from 'lucide-react';

interface HiveDetailModalProps {
  hive: HiveStatus | null;
  onClose: () => void;
  currentLanguage: LanguageCode;
  voiceEnabled: boolean;
  onRequestHelp: (hiveId: number, riskType: string) => void;
  onOpenInspection?: (hiveId: number, hiveName: string) => void;
}

export const HiveDetailModal: React.FC<HiveDetailModalProps> = ({
  hive,
  onClose,
  currentLanguage,
  voiceEnabled,
  onRequestHelp,
  onOpenInspection,
}) => {
  const triggerVoiceNarration = () => {
    if (!hive) return;
    const statusText = getTranslation(currentLanguage, `hive_${hive.overallStatus}`);
    let riskText = '';
    if (hive.activeRisks.length > 0) {
      const translatedRisks = hive.activeRisks
        .map((r) => getTranslation(currentLanguage, r.recommendedAction))
        .join('. ');
      riskText = `. ${translatedRisks}`;
    }
    const fullText = `${hive.hiveName}, ${statusText}${riskText}`;
    speakNarration(fullText, currentLanguage, true);
  };

  useEffect(() => {
    if (hive && voiceEnabled) {
      triggerVoiceNarration();
    }
  }, [hive, currentLanguage, voiceEnabled]);

  if (!hive) return null;

  const isStale =
    hive.overallStatus === 'no_signal' ||
    (hive.lastSeenAt && Date.now() - new Date(hive.lastSeenAt).getTime() > 30 * 60 * 1000);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end sm:justify-center p-3 sm:p-4">
      <div className="bg-stone-900 rounded-3xl p-6 w-full max-w-md mx-auto shadow-2xl border border-stone-800 max-h-[90vh] overflow-y-auto text-stone-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <HiveStatusIcon status={hive.overallStatus} size="lg" />
            <div>
              <h2 className="text-2xl font-bold text-white leading-tight">
                {hive.hiveName}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-stone-400">
                  Hive ID #{hive.hiveId}
                </span>
                {/* Voice Re-play Button */}
                <button
                  onClick={triggerVoiceNarration}
                  className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-full text-[11px] font-bold flex items-center gap-1 border border-stone-700 shadow-xs active:scale-95"
                >
                  <VoiceIcon size={12} /> Voice Alert ({currentLanguage.toUpperCase()})
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-full font-bold flex items-center justify-center text-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stale Warning Banner if offline/delayed */}
        {isStale && (
          <div className="mb-4 p-3 bg-gray-200 border border-gray-400 rounded-2xl text-xs font-bold text-gray-700 flex items-center gap-2">
            <AlertTriangle size={14} /> {getTranslation(currentLanguage, 'stale_warning')} (
            {getTranslation(currentLanguage, 'last_updated')}:{' '}
            {hive.lastSeenAt ? new Date(hive.lastSeenAt).toLocaleTimeString() : 'N/A'})
          </div>
        )}

        {/* Active Risk Alerts List */}
        {hive.activeRisks.length > 0 && (
          <div className="mb-4 space-y-2">
            <h3 className="text-xs font-black text-red-800 uppercase tracking-wider flex items-center justify-between">
              <span>Active Distress Flags</span>
              <span className="text-[10px] text-red-700 font-bold flex items-center gap-1"><Volume2 size={10} /> Audio Narrated in {currentLanguage.toUpperCase()}</span>
            </h3>
            {hive.activeRisks.map((risk) => (
              <div
                key={risk.id}
                className="bg-red-100 border-2 border-red-400 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="text-red-600" size={24} />
                    <span className="font-extrabold text-red-950 text-sm flex items-center gap-1">
                      {risk.type === 'swarm'
                        ? <><AlertOctagon size={14} /> Swarm Risk</>
                        : risk.type === 'pest'
                        ? <><Bug size={14} /> Pest / Mite Risk</>
                        : <><Flame size={14} /> Heat Stress</>}
                    </span>
                  </div>
                  <span className="text-xs font-black bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
                    {Math.round(risk.confidence * 100)}% AI Match
                  </span>
                </div>
                <p className="text-sm font-black text-red-950 mt-2 leading-snug">
                  {getTranslation(currentLanguage, risk.recommendedAction)}
                </p>

                <button
                  onClick={() => onRequestHelp(hive.hiveId, risk.type)}
                  className="mt-3 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <PhoneCall size={14} /> Request Field Officer Support
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Sensor Gauges Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <GaugeMeter
            label={getTranslation(currentLanguage, 'temperature')}
            value={hive.temperatureC}
            unit="°C"
            level={hive.temperatureC > 37 ? 'danger' : hive.temperatureC > 35 ? 'watch' : 'normal'}
            icon={<Thermometer size={20} />}
            translatedLevelName={getTranslation(
              currentLanguage,
              hive.temperatureC > 37 ? 'danger' : hive.temperatureC > 35 ? 'watch' : 'normal'
            )}
          />

          <GaugeMeter
            label={getTranslation(currentLanguage, 'humidity')}
            value={hive.humidityPct}
            unit="%"
            level={hive.humidityPct > 75 ? 'danger' : hive.humidityPct > 65 ? 'watch' : 'normal'}
            icon={<Droplets size={20} />}
            translatedLevelName={getTranslation(
              currentLanguage,
              hive.humidityPct > 75 ? 'danger' : hive.humidityPct > 65 ? 'watch' : 'normal'
            )}
          />

          <GaugeMeter
            label={getTranslation(currentLanguage, 'acoustics')}
            value={hive.acousticActivityLevel.toUpperCase()}
            unit=""
            level={hive.acousticActivityLevel === 'high' ? 'watch' : 'normal'}
            icon={<Volume2 size={20} />}
            translatedLevelName={getTranslation(
              currentLanguage,
              hive.acousticActivityLevel === 'high' ? 'watch' : 'normal'
            )}
          />

          <GaugeMeter
            label={getTranslation(currentLanguage, 'gas_voc')}
            value={hive.vocIndex}
            unit="VOC"
            level={hive.vocIndex > 80 ? 'danger' : hive.vocIndex > 60 ? 'watch' : 'normal'}
            icon={<Wind size={20} />}
            translatedLevelName={getTranslation(
              currentLanguage,
              hive.vocIndex > 80 ? 'danger' : hive.vocIndex > 60 ? 'watch' : 'normal'
            )}
          />
        </div>

        <div className="space-y-2 pt-2">
          {onOpenInspection && (
            <button
              onClick={() => {
                onClose();
                onOpenInspection(hive.hiveId, hive.hiveName);
              }}
              className="w-full min-h-[48px] py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <ClipboardCheck size={18} /> Start HoneyChain Field Inspection
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full min-h-[44px] py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs rounded-2xl transition-all active:scale-98 border border-stone-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
