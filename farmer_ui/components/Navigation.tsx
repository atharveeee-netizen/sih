import React from 'react';
import { Map, Zap, HelpCircle, ClipboardCheck } from 'lucide-react';
import { LanguageCode } from '../lib/types';
import { getTranslation } from '../lib/i18n/dictionaries';

export type NavTab = 'map' | 'actions' | 'inspect' | 'help';

interface NavigationProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  currentLanguage: LanguageCode;
  alertCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  currentLanguage,
  alertCount = 0,
}) => {
  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40 px-3 max-w-md mx-auto">
      <div className="bg-stone-900/95 backdrop-blur-xl border border-stone-800 shadow-2xl rounded-3xl p-1.5 grid grid-cols-4 gap-1">
        {/* Hive-Pal Main Dashboard Tab */}
        <button
          onClick={() => onChangeTab('inspect')}
          className={`flex flex-col items-center justify-center min-h-[54px] py-1.5 px-2 rounded-2xl transition-all ${
            activeTab === 'inspect'
              ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md scale-102'
              : 'text-stone-400 hover:text-stone-200 font-semibold'
          }`}
        >
          <ClipboardCheck size={22} strokeWidth={activeTab === 'inspect' ? 2.5 : 2} />
          <span className="text-[10px] mt-1 tracking-tight">Dashboard</span>
        </button>

        {/* Hive Map Tab */}
        <button
          onClick={() => onChangeTab('map')}
          className={`flex flex-col items-center justify-center min-h-[54px] py-1.5 px-2 rounded-2xl transition-all ${
            activeTab === 'map'
              ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md scale-102'
              : 'text-stone-400 hover:text-stone-200 font-semibold'
          }`}
        >
          <Map size={22} strokeWidth={activeTab === 'map' ? 2.5 : 2} />
          <span className="text-[10px] mt-1 tracking-tight">{getTranslation(currentLanguage, 'nav_map')}</span>
        </button>

        {/* Action Items Tab */}
        <button
          onClick={() => onChangeTab('actions')}
          className={`relative flex flex-col items-center justify-center min-h-[54px] py-1.5 px-2 rounded-2xl transition-all ${
            activeTab === 'actions'
              ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md scale-102'
              : 'text-stone-400 hover:text-stone-200 font-semibold'
          }`}
        >
          <Zap size={22} strokeWidth={activeTab === 'actions' ? 2.5 : 2} />
          <span className="text-[10px] mt-1 tracking-tight">{getTranslation(currentLanguage, 'nav_actions')}</span>
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-2 w-4 h-4 bg-red-600 text-white font-black text-[9px] rounded-full flex items-center justify-center shadow-md animate-bounce">
              {alertCount}
            </span>
          )}
        </button>

        {/* Help Center Tab */}
        <button
          onClick={() => onChangeTab('help')}
          className={`flex flex-col items-center justify-center min-h-[54px] py-1.5 px-2 rounded-2xl transition-all ${
            activeTab === 'help'
              ? 'bg-amber-500 text-stone-950 font-extrabold shadow-md scale-102'
              : 'text-stone-400 hover:text-stone-200 font-semibold'
          }`}
        >
          <HelpCircle size={22} strokeWidth={activeTab === 'help' ? 2.5 : 2} />
          <span className="text-[10px] mt-1 tracking-tight">{getTranslation(currentLanguage, 'nav_help')}</span>
        </button>
      </div>
    </nav>
  );
};
