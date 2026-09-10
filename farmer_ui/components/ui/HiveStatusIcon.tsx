import React from 'react';
import { HiveHealthStatus } from '../../lib/types';
import { ShieldCheck, AlertTriangle, AlertOctagon, SignalZero } from 'lucide-react';

interface HiveStatusIconProps {
  status: HiveHealthStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  pulse?: boolean;
}

export const HiveStatusIcon: React.FC<HiveStatusIconProps> = ({
  status,
  size = 'md',
  pulse = true,
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-12 h-12 p-2.5',
    lg: 'w-16 h-16 p-3.5',
    xl: 'w-20 h-20 p-4',
  };

  const iconSizeMap = {
    sm: 18,
    md: 24,
    lg: 32,
    xl: 40,
  };

  switch (status) {
    case 'healthy':
      return (
        <div
          className={`relative rounded-full bg-emerald-100 text-emerald-700 border-2 border-emerald-500 shadow-md flex items-center justify-center ${sizeMap[size]}`}
          title="Healthy Hive"
        >
          <ShieldCheck size={iconSizeMap[size]} strokeWidth={2.5} />
        </div>
      );
    case 'watch':
      return (
        <div
          className={`relative rounded-2xl bg-amber-100 text-amber-700 border-2 border-amber-500 shadow-md flex items-center justify-center ${sizeMap[size]}`}
          title="Attention Recommended"
        >
          <AlertTriangle size={iconSizeMap[size]} strokeWidth={2.5} />
        </div>
      );
    case 'alert':
      return (
        <div className="relative inline-flex items-center justify-center">
          {pulse && (
            <span className="absolute inline-flex h-full w-full rounded-2xl bg-red-400 opacity-75 animate-ping" />
          )}
          <div
            className={`relative rounded-2xl bg-red-100 text-red-700 border-4 border-red-600 shadow-lg flex items-center justify-center ${sizeMap[size]}`}
            title="Urgent Alert"
          >
            <AlertOctagon size={iconSizeMap[size]} strokeWidth={3} />
          </div>
        </div>
      );
    case 'no_signal':
    default:
      return (
        <div
          className={`relative rounded-xl bg-gray-200 text-gray-500 border-2 border-gray-400 flex items-center justify-center ${sizeMap[size]}`}
          title="No Signal / Stale Data"
        >
          <SignalZero size={iconSizeMap[size]} strokeWidth={2} />
        </div>
      );
  }
};
