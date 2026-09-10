import React, { useState } from 'react';
import { FieldOfficer, LanguageCode } from '../../lib/types';
import { getTranslation } from '../../lib/i18n/dictionaries';
import { Phone, MessageSquare, PhoneIncoming, CheckCircle2, ChevronRight, BookOpen, Clock } from 'lucide-react';

interface HelpScreenProps {
  officer: FieldOfficer;
  currentLanguage: LanguageCode;
  onRequestCallback: () => void;
  callbackStatus: 'none' | 'queued' | 'sent';
}

export const HelpScreen: React.FC<HelpScreenProps> = ({
  officer,
  currentLanguage,
  onRequestCallback,
  callbackStatus,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(1);

  return (
    <div className="flex flex-col gap-4 pb-24 max-w-md mx-auto px-4 pt-4">
      {/* Assigned Officer Card */}
      <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-amber-300 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center font-black text-white shadow-md border-2 border-amber-300">
            <Phone size={28} />
          </div>
          <div>
            <span className="text-[11px] font-black text-amber-700 uppercase tracking-wider">
              Assigned KVIC Field Officer
            </span>
            <h3 className="text-xl font-black text-gray-900 leading-tight">
              {officer.name}
            </h3>
            <p className="text-xs font-bold text-gray-500 mt-0.5">
              {officer.roleTitle}
            </p>
          </div>
        </div>

        {/* Call & SMS Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${officer.phoneNumber}`}
            className="min-h-[48px] py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Phone size={18} />
            {getTranslation(currentLanguage, 'call_officer')}
          </a>

          <a
            href={`sms:${officer.phoneNumber}`}
            className="min-h-[48px] py-3 bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-900 font-extrabold text-xs rounded-2xl border border-amber-300 flex items-center justify-center gap-2 transition-all"
          >
            <MessageSquare size={18} className="text-amber-700" />
            {getTranslation(currentLanguage, 'send_sms')}
          </a>
        </div>

        <hr className="border-amber-100 my-1" />

        {/* One-Tap Request Call Back Button */}
        <div>
          <button
            onClick={onRequestCallback}
            disabled={callbackStatus !== 'none'}
            className={`w-full min-h-[52px] py-3 px-4 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all ${
              callbackStatus === 'sent'
                ? 'bg-emerald-100 text-emerald-900 border-2 border-emerald-500'
                : callbackStatus === 'queued'
                ? 'bg-amber-100 text-amber-900 border-2 border-amber-500'
                : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-95'
            }`}
          >
            {callbackStatus === 'sent' ? (
              <>
                <CheckCircle2 size={22} className="text-emerald-600" />
                {getTranslation(currentLanguage, 'callback_sent')}
              </>
            ) : callbackStatus === 'queued' ? (
              <>
                <Clock size={22} className="text-amber-700 animate-spin" />
                {getTranslation(currentLanguage, 'callback_queued')}
              </>
            ) : (
              <>
                <PhoneIncoming size={22} />
                {getTranslation(currentLanguage, 'request_callback')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Step-by-Step FAQ Guides */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-amber-200 space-y-3">
        <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
          <BookOpen size={20} className="text-amber-600" />
          Physical Action Guides
        </h3>

        {/* Step Card 1 */}
        <div
          onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
          className="bg-amber-50 rounded-2xl p-4 border border-amber-200 cursor-pointer transition-all hover:border-amber-400"
        >
          <div className="flex items-center justify-between font-extrabold text-amber-950 text-sm">
            <span>{getTranslation(currentLanguage, 'step_faq_1_title')}</span>
            <ChevronRight
              size={18}
              className={`transition-transform ${activeFaq === 1 ? 'rotate-90' : ''}`}
            />
          </div>
          {activeFaq === 1 && (
            <p className="text-xs font-bold text-amber-900 mt-2 pt-2 border-t border-amber-200 leading-relaxed">
              {getTranslation(currentLanguage, 'step_faq_1_body')}
            </p>
          )}
        </div>

        {/* Step Card 2 */}
        <div
          onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}
          className="bg-amber-50 rounded-2xl p-4 border border-amber-200 cursor-pointer transition-all hover:border-amber-400"
        >
          <div className="flex items-center justify-between font-extrabold text-amber-950 text-sm">
            <span>{getTranslation(currentLanguage, 'step_faq_2_title')}</span>
            <ChevronRight
              size={18}
              className={`transition-transform ${activeFaq === 2 ? 'rotate-90' : ''}`}
            />
          </div>
          {activeFaq === 2 && (
            <p className="text-xs font-bold text-amber-900 mt-2 pt-2 border-t border-amber-200 leading-relaxed">
              {getTranslation(currentLanguage, 'step_faq_2_body')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
