import React from 'react';

interface GaugeMeterProps {
  label: string;
  value: string | number;
  unit: string;
  level: 'normal' | 'watch' | 'danger';
  icon: React.ReactNode;
  translatedLevelName: string;
}

export const GaugeMeter: React.FC<GaugeMeterProps> = ({
  label,
  value,
  unit,
  level,
  icon,
  translatedLevelName,
}) => {
  const getLevelStyle = () => {
    switch (level) {
      case 'normal':
        return {
          barBg: 'bg-emerald-500',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          percent: '33%',
        };
      case 'watch':
        return {
          barBg: 'bg-amber-500',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          percent: '66%',
        };
      case 'danger':
        return {
          barBg: 'bg-red-600',
          badgeBg: 'bg-red-100 text-red-800 border-red-300',
          percent: '100%',
        };
    }
  };

  const style = getLevelStyle();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">{icon}</div>
          <span className="text-base">{label}</span>
        </div>
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full border ${style.badgeBg}`}
        >
          {translatedLevelName}
        </span>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <span className="text-2xl font-black text-gray-900">
          {value} <span className="text-sm font-medium text-gray-500">{unit}</span>
        </span>
      </div>

      {/* Visual Gauge Bar */}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
        <div
          className={`h-full transition-all duration-500 ${style.barBg}`}
          style={{ width: style.percent }}
        />
      </div>
    </div>
  );
};
