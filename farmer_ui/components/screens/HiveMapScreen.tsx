import React, { useState } from 'react';
import { HiveStatus, LanguageCode, HiveHealthStatus } from '../../lib/types';
import { getTranslation } from '../../lib/i18n/dictionaries';
import { triggerHapticFeedback } from '../../lib/utils/haptics';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  RefreshCw,
  SignalZero,
  Thermometer,
  Droplets,
  FlaskConical,
  ClipboardCheck,
  Compass,
  ArrowRight,
  Hexagon
} from 'lucide-react';

interface HiveMapScreenProps {
  hives: HiveStatus[];
  onSelectHive: (hive: HiveStatus) => void;
  currentLanguage: LanguageCode;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onOpenInspection?: (hiveId: number, hiveName: string) => void;
}

// True regular hexagon points centered in a 120x138 coordinate space
// pointy-topped hexagon: width 120, height 138.56
const HEX_POINTS = "60,4 116,35 116,103 60,134 4,103 4,35";
const INNER_HEX_POINTS = "60,9 110,38 110,100 60,129 10,100 10,38";

export const HiveMapScreen: React.FC<HiveMapScreenProps> = ({
  hives,
  onSelectHive,
  currentLanguage,
  onRefresh,
  isRefreshing = false,
  onOpenInspection,
}) => {
  const [filter, setFilter] = useState<HiveHealthStatus | 'all'>('all');
  const [selectedHiveId, setSelectedHiveId] = useState<number>(hives[0]?.hiveId || 101);

  const healthyCount = hives.filter((h) => h.overallStatus === 'healthy').length;
  const watchCount = hives.filter((h) => h.overallStatus === 'watch').length;
  const alertCount = hives.filter((h) => h.overallStatus === 'alert').length;
  const nosignalCount = hives.filter((h) => h.overallStatus === 'no_signal').length;

  const activeHive = hives.find((h) => h.hiveId === selectedHiveId) || hives[0];

  const handleHiveClick = (hive: HiveStatus) => {
    setSelectedHiveId(hive.hiveId);
    if (hive.overallStatus === 'alert') {
      triggerHapticFeedback('alert');
    } else if (hive.overallStatus === 'watch') {
      triggerHapticFeedback('warning');
    } else {
      triggerHapticFeedback('light');
    }
  };

  // Fixed 7-cell classic honeycomb cluster layout (center hive surrounded by perimeter ring)
  // Row 1: 2 hives [col 1, col 2] (shifted right by half hex width)
  // Row 2: 3 hives [col 0, col 1, col 2]
  // Row 3: 2 hives [col 1, col 2] (shifted right by half hex width)
  const clusterLayout = [
    { hiveIndex: 0, row: 0, col: 0.5 }, // North West
    { hiveIndex: 1, row: 0, col: 1.5 }, // North East
    { hiveIndex: 2, row: 1, col: 0 },   // West
    { hiveIndex: 3, row: 1, col: 1 },   // Central Hive
    { hiveIndex: 4, row: 1, col: 2 },   // East
    { hiveIndex: 5, row: 2, col: 0.5 }, // South West
  ];

  return (
    <div className="flex flex-col gap-4 pb-28 max-w-md mx-auto px-4 pt-3 text-stone-100">
      
      {/* Top Header Card */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
              Apiary Yard Layout
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Honeycomb Hive Array
          </h2>
        </div>

        <button
          onClick={() => {
            triggerHapticFeedback('light');
            onRefresh();
          }}
          disabled={isRefreshing}
          className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition-all border border-stone-700 active:scale-95"
          title="Refresh Telemetry"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin text-amber-400' : ''} />
        </button>
      </div>

      {/* Filterable Health Pills */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl">
        <button
          onClick={() => setFilter(filter === 'healthy' ? 'all' : 'healthy')}
          className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            filter === 'healthy'
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Safe ({healthyCount})</span>
        </button>

        <button
          onClick={() => setFilter(filter === 'watch' ? 'all' : 'watch')}
          className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            filter === 'watch'
              ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>Watch ({watchCount})</span>
        </button>

        <button
          onClick={() => setFilter(filter === 'alert' ? 'all' : 'alert')}
          className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            filter === 'alert'
              ? 'bg-red-950 text-red-300 border border-red-500/50'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span>Alert ({alertCount})</span>
        </button>

        <button
          onClick={() => setFilter(filter === 'no_signal' ? 'all' : 'no_signal')}
          className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            filter === 'no_signal'
              ? 'bg-stone-800 text-stone-200 border border-stone-600'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
          <span>Off ({nosignalCount})</span>
        </button>
      </div>

      {/* Actual Honeycomb Interlocking Geometry SVG Canvas */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 shadow-xl relative overflow-hidden">
        {/* Top yard indicator */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-stone-800 text-xs text-stone-400">
          <div className="flex items-center gap-1.5 font-medium">
            <Compass size={14} className="text-amber-400" />
            <span>Flight Entrance: Facing South</span>
          </div>
          <span className="text-[11px] text-stone-500">Natural Bee Spacing</span>
        </div>

        {/* Real Geometric Honeycomb SVG (Precise hexagonal interlocking math) */}
        {/* Each hexagon: width = 110, height = 127. Horizontal step = 114, Vertical step = 96 */}
        <div className="w-full flex justify-center py-2">
          <svg
            viewBox="0 0 380 330"
            className="w-full max-w-[360px] h-auto select-none"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
          >
            {/* Background alignment gridlines */}
            <defs>
              <pattern id="hex-dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#332d29" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hex-dot-grid)" opacity="0.4" rx="16" />

            {clusterLayout.map(({ hiveIndex, row, col }) => {
              const hive = hives[hiveIndex];
              if (!hive) return null;

              const isSelected = hive.hiveId === selectedHiveId;
              const isFilteredOut = filter !== 'all' && hive.overallStatus !== filter;

              // Hexagon math parameters:
              // R = 56, W = 2*R*cos(30) = 97, H = 2*R = 112
              // Horizontal distance between centers = 100
              // Vertical distance between centers = 84
              const originX = 58;
              const originY = 55;
              const cx = originX + col * 105;
              const cy = originY + row * 92;

              // Color definitions for cell theme
              let strokeColor = '#44403c'; // stone-700
              let fillColor = '#1c1917';   // stone-900
              let badgeColor = '#78716c';  // stone-500
              let textColor = '#e7e5e4';   // stone-200

              if (hive.overallStatus === 'healthy') {
                strokeColor = isSelected ? '#10b981' : '#059669'; // emerald
                fillColor = isSelected ? '#064e3b' : '#022c22';
                badgeColor = '#34d399';
              } else if (hive.overallStatus === 'watch') {
                strokeColor = isSelected ? '#f59e0b' : '#d97706'; // amber
                fillColor = isSelected ? '#78350f' : '#451a03';
                badgeColor = '#fbbf24';
              } else if (hive.overallStatus === 'alert') {
                strokeColor = isSelected ? '#ef4444' : '#dc2626'; // red
                fillColor = isSelected ? '#7f1d1d' : '#450a0a';
                badgeColor = '#f87171';
              }

              return (
                <g
                  key={hive.hiveId}
                  transform={`translate(${cx}, ${cy})`}
                  onClick={() => handleHiveClick(hive)}
                  className="cursor-pointer transition-all duration-200"
                  opacity={isFilteredOut ? 0.3 : 1}
                  style={{
                    transformOrigin: `${cx}px ${cy}px`,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <polygon
                      points="0,-57 49.3,-28.5 49.3,28.5 0,57 -49.3,28.5 -49.3,-28.5"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="4"
                      strokeDasharray="4 2"
                      opacity="0.9"
                    />
                  )}

                  {/* Main Hexagon Cell */}
                  <polygon
                    points="0,-52 45,-26 45,26 0,52 -45,26 -45,-26"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isSelected ? "2.5" : "1.8"}
                  />

                  {/* Inner decorative rim */}
                  <polygon
                    points="0,-45 39,-22.5 39,22.5 0,45 -39,22.5 -39,-22.5"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="0.8"
                    opacity="0.5"
                  />

                  {/* Status Indicator Dot at Top Apex */}
                  <circle
                    cx="0"
                    cy="-34"
                    r="4.5"
                    fill={badgeColor}
                    stroke="#1c1917"
                    strokeWidth="1.5"
                  />

                  {/* Hive Number */}
                  <text
                    x="0"
                    y="-8"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="14"
                    fontWeight="800"
                    letterSpacing="0.5"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    #{hive.hiveId}
                  </text>

                  {/* Hive Temperature */}
                  <text
                    x="0"
                    y="11"
                    textAnchor="middle"
                    fill="#fde68a"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {hive.temperatureC}°C
                  </text>

                  {/* Humidity Pill */}
                  <rect
                    x="-24"
                    y="19"
                    width="48"
                    height="14"
                    rx="7"
                    fill="#000000"
                    opacity="0.5"
                  />
                  <text
                    x="0"
                    y="29.5"
                    textAnchor="middle"
                    fill="#93c5fd"
                    fontSize="9"
                    fontWeight="700"
                    fontFamily="system-ui, -apple-system, sans-serif"
                  >
                    {hive.humidityPct}% RH
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Healthy
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Watch
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Alert
            </span>
          </div>
          <span className="text-[11px] text-stone-500 font-medium">Tap cell to focus</span>
        </div>
      </div>

      {/* Selected Hive Telemetry Deck */}
      {activeHive && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-md space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  {activeHive.hiveName}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    activeHive.overallStatus === 'healthy'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                      : activeHive.overallStatus === 'watch'
                      ? 'bg-amber-950 text-amber-300 border-amber-500/30'
                      : activeHive.overallStatus === 'alert'
                      ? 'bg-red-950 text-red-300 border-red-500/30'
                      : 'bg-stone-800 text-stone-400 border-stone-700'
                  }`}
                >
                  {getTranslation(currentLanguage, `hive_${activeHive.overallStatus}`)}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Hive ID #{activeHive.hiveId} · Central Apiary Node
              </p>
            </div>

            {/* Quick Inspect Button */}
            {onOpenInspection && (
              <button
                type="button"
                onClick={() => onOpenInspection(activeHive.hiveId, activeHive.hiveName)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <ClipboardCheck size={14} strokeWidth={2.5} /> Inspect
              </button>
            )}
          </div>

          {/* Telemetry Metric Deck */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-800">
            <div className="bg-stone-950/70 p-2.5 rounded-xl border border-stone-800/80">
              <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                <Thermometer size={12} className="text-amber-500" /> Temp
              </span>
              <div className="text-base font-bold text-white mt-1">
                {activeHive.temperatureC}°C
              </div>
            </div>

            <div className="bg-stone-950/70 p-2.5 rounded-xl border border-stone-800/80">
              <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                <Droplets size={12} className="text-sky-400" /> Humidity
              </span>
              <div className="text-base font-bold text-white mt-1">
                {activeHive.humidityPct}%
              </div>
            </div>

            <div className="bg-stone-950/70 p-2.5 rounded-xl border border-stone-800/80">
              <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                <FlaskConical size={12} className="text-emerald-400" /> VOC
              </span>
              <div className="text-base font-bold text-white mt-1">
                {activeHive.vocIndex}
              </div>
            </div>
          </div>

          {/* Full Sensor Diagnostics Trigger */}
          <button
            type="button"
            onClick={() => onSelectHive(activeHive)}
            className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-stone-700"
          >
            <span>Open Full Sensor Diagnostics</span>
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
};
