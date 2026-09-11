import React, { useState } from 'react';
import {
  ClipboardCheck,
  ArrowRight,
  CheckCircle2,
  Mic,
  Sliders,
  Sparkles,
  Layers,
  Thermometer,
  Droplets,
  Calendar,
  AlertCircle,
  BarChart3,
  Search,
  Plus
} from 'lucide-react';
import { HiveStatus, LanguageCode } from '../../lib/types';
import { HivePalInspectionModal, InspectionRecord } from './HivePalInspectionModal';

interface HivePalInspectionTabProps {
  hives: HiveStatus[];
  currentLanguage: LanguageCode;
  onInspectionSaved?: (rec: InspectionRecord) => void;
}

export const HivePalInspectionTab: React.FC<HivePalInspectionTabProps> = ({
  hives,
  currentLanguage,
  onInspectionSaved,
}) => {
  const [activeHiveForInspection, setActiveHiveForInspection] = useState<HiveStatus | null>(hives[0] || null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [completedHives, setCompletedHives] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'needs_inspection' | 'inspected'>('all');

  const handleStart = (hive: HiveStatus) => {
    setActiveHiveForInspection(hive);
    setIsModalOpen(true);
  };

  const handleRecordSaved = (rec: InspectionRecord) => {
    if (!completedHives.includes(rec.hiveId)) {
      setCompletedHives((prev) => [...prev, rec.hiveId]);
    }
    if (onInspectionSaved) onInspectionSaved(rec);
  };

  const filteredHives = hives.filter((h) => {
    const matchesSearch = h.hiveName.toLowerCase().includes(searchQuery.toLowerCase()) || String(h.hiveId).includes(searchQuery);
    const isDone = completedHives.includes(h.hiveId);
    if (selectedFilter === 'needs_inspection') return matchesSearch && !isDone;
    if (selectedFilter === 'inspected') return matchesSearch && isDone;
    return matchesSearch;
  });

  const inspectedCount = completedHives.length;
  const pendingCount = hives.length - inspectedCount;
  const avgTemp = Math.round(hives.reduce((acc, h) => acc + h.temperatureC, 0) / (hives.length || 1));

  return (
    <div className="p-4 pb-28 max-w-md mx-auto space-y-4">
      {/* Editorial Nordic/Slate Apiary Overview Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 text-stone-100 shadow-2xl relative overflow-hidden">
        {/* Subtle warm glow backdrop */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Tagline */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
              Beevil Knievel Apiary Management
            </span>
          </div>
          <span className="text-[10px] font-extrabold bg-stone-800 text-amber-400 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
            {inspectedCount}/{hives.length} Inspected
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Active Apiary Dashboard
        </h2>
        <p className="text-xs text-stone-400 mt-1 font-normal">
          Field-ready inspection flow with automated voice recording, Queen tracking, and live telemetry.
        </p>

        {/* Key Metrics Grid - Minimal Nordic Styling */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-800/80">
          <div className="bg-stone-950/60 p-2.5 rounded-2xl border border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              Total Hives
            </span>
            <div className="text-xl font-bold text-white mt-0.5">
              {hives.length}
            </div>
          </div>

          <div className="bg-stone-950/60 p-2.5 rounded-2xl border border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              Due Today
            </span>
            <div className="text-xl font-bold text-amber-400 mt-0.5">
              {pendingCount}
            </div>
          </div>

          <div className="bg-stone-950/60 p-2.5 rounded-2xl border border-stone-800">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              Mean Temp
            </span>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              {avgTemp}°C
            </div>
          </div>
        </div>

        {/* Quick Action Feature Pill Bar */}
        <div className="mt-3 flex items-center justify-between gap-1.5 text-xs text-stone-300 bg-stone-950/40 p-2 rounded-2xl border border-stone-800/60">
          <span className="flex items-center gap-1 text-[11px] font-medium text-stone-300">
            <CheckCircle2 size={13} className="text-emerald-400" /> Queen Tracking
          </span>
          <span className="text-stone-700">·</span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-stone-300">
            <Sliders size={13} className="text-amber-400" /> TapScale 0-10
          </span>
          <span className="text-stone-700">·</span>
          <span className="flex items-center gap-1 text-[11px] font-medium text-stone-300">
            <Mic size={13} className="text-cyan-400" /> Audio Notes
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search hive number or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-900/90 border border-stone-800 text-stone-100 rounded-2xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-amber-500/60 placeholder-stone-500 font-medium"
            />
          </div>

          {/* New Fast Inspection Action Button */}
          {hives.length > 0 && (
            <button
              onClick={() => handleStart(hives[0])}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-2xl font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <Plus size={15} strokeWidth={2.5} /> Quick Add
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800/80 rounded-2xl">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === 'all'
                ? 'bg-stone-800 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            All ({hives.length})
          </button>
          <button
            onClick={() => setSelectedFilter('needs_inspection')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === 'needs_inspection'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setSelectedFilter('inspected')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === 'inspected'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Done ({inspectedCount})
          </button>
        </div>
      </div>

      {/* Hive Cards List */}
      <div className="space-y-2.5">
        {filteredHives.map((hive) => {
          const isDone = completedHives.includes(hive.hiveId);
          return (
            <div
              key={hive.hiveId}
              className="bg-stone-900/95 border border-stone-800 hover:border-stone-700 rounded-3xl p-4 transition-all duration-200 shadow-sm text-stone-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                {/* Modern Badge */}
                <div
                  className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold text-xs border ${
                    isDone
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                      : 'bg-stone-800/80 border-stone-700 text-amber-300'
                  }`}
                >
                  <span className="text-[9px] uppercase font-bold opacity-60">Hive</span>
                  <span className="text-sm font-black leading-none">#{hive.hiveId}</span>
                </div>

                {/* Hive Details */}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-stone-100 leading-tight">
                      {hive.hiveName}
                    </h4>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 size={10} /> Inspected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-400 mt-1 font-medium">
                    <span className="flex items-center gap-1">
                      <Thermometer size={12} className="text-amber-500" /> {hive.temperatureC}°C
                    </span>
                    <span className="flex items-center gap-1">
                      <Droplets size={12} className="text-sky-400" /> {hive.humidityPct}%
                    </span>
                    <span className="text-[11px] text-stone-400">
                      VOC {hive.vocIndex}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleStart(hive)}
                className={`py-2.5 px-3.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
                  isDone
                    ? 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 font-black'
                }`}
              >
                <span>{isDone ? 'Edit' : 'Inspect'}</span>
                <ArrowRight size={13} strokeWidth={2.5} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Hive-Pal Modal instance */}
      {activeHiveForInspection && (
        <HivePalInspectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          hiveId={activeHiveForInspection.hiveId}
          hiveName={activeHiveForInspection.hiveName}
          currentLanguage={currentLanguage}
          onSaveInspection={handleRecordSaved}
        />
      )}
    </div>
  );
};
