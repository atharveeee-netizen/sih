import React, { useState } from 'react';
import { LanguageCode } from '../../lib/types';
import { getTranslation } from '../../lib/i18n/dictionaries';
import { Phone, ShieldCheck, UserCheck, Key, ArrowRight, Lock, Hexagon, Download, AlertTriangle } from 'lucide-react';

/** Native spelling only. Someone who cannot read the interface cannot
    read an English language name either. */
const LANGUAGE_CHOICES: { code: LanguageCode; label: string }[] = [
  { code: 'hi', label: 'हिंदी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'मराठी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'en', label: 'English' },
];

interface LoginScreenProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (code: LanguageCode) => void;
  onLoginSuccess: (farmerData: any, token: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  currentLanguage,
  onLanguageChange,
  onLoginSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [requestId, setRequestId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Assisted Login Modal State
  const [showAssistedModal, setShowAssistedModal] = useState(false);
  const [officerId, setOfficerId] = useState('FO-KVIC-782');
  const [officerPin, setOfficerPin] = useState('9402');
  const [assistedFarmerId, setAssistedFarmerId] = useState('KVIC-BK-9402');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRequestId(data.requestId);
        setStep('otp');
        setOtp(data.demoOtpHint || '1234');
      } else {
        setErrorMsg(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setErrorMsg('Network error requesting OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, otp, phoneNumber }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onLoginSuccess(data.farmer, data.sessionToken);
      } else {
        setErrorMsg(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setErrorMsg('Network error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleAssistedLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/assisted-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officerId,
          officerPin,
          farmerId: assistedFarmerId,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowAssistedModal(false);
        onLoginSuccess(data.farmer, data.sessionToken);
      } else {
        setErrorMsg(data.error || 'Officer verification failed');
      }
    } catch (err) {
      setErrorMsg('Network error during assisted login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ground flex flex-col">
      {/* Same masthead as the public portal, so the app is recognisably the
          same government service. */}
      <div className="bg-navy-deep text-white border-b-2 border-amber px-4 py-2">
        <p className="text-[10px] font-semibold tracking-wide text-center">
          भारत सरकार · GOVERNMENT OF INDIA · MINISTRY OF MSME
        </p>
      </div>

      {/* Language first. Everything below this is unreadable until it is set,
          so it cannot sit further down the page. */}
      <div className="bg-navy px-3 py-2.5">
        <div className="max-w-md mx-auto">
          <p className="text-[10px] uppercase tracking-wider text-white/60 font-semibold mb-1.5 px-0.5">
            भाषा · Language
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {LANGUAGE_CHOICES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => onLanguageChange(lang.code)}
                aria-pressed={currentLanguage === lang.code}
                className={`min-h-[44px] px-1 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                  currentLanguage === lang.code
                    ? 'bg-amber text-navy-deep border-amber'
                    : 'bg-white/10 text-white border-white/20 active:bg-white/20'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between p-4 max-w-md mx-auto w-full">
      {/* Top Banner & Mascot */}
      <div className="pt-6 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-amber rounded-xl p-4 flex items-center justify-center mb-3">
          <Hexagon size={40} className="text-navy-deep" />
        </div>
        <h2 className="text-2xl font-bold text-navy tracking-tight">
          {getTranslation(currentLanguage, 'app_title')}
        </h2>
        <p className="text-sm font-medium text-text-2 mt-1 max-w-xs">
          KVIC Apiary Cluster Beekeeping Companion
        </p>
      </div>

      {/* Main Form Box */}
      <div className="bg-paper rounded-lg p-6 border border-rule my-auto">
        <h3 className="text-xl font-extrabold text-gray-900 mb-1">
          {getTranslation(currentLanguage, 'login_heading')}
        </h3>
        <p className="text-xs text-gray-600 mb-6 font-medium">
          {getTranslation(currentLanguage, 'login_subtext')}
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-300 flex items-center gap-2">
            <AlertTriangle size={14} /> {errorMsg}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {getTranslation(currentLanguage, 'farmer_id_or_phone')}
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 text-amber-600" size={20} />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-amber-50/50 border-2 border-amber-300 rounded-lg font-bold text-lg text-gray-900 focus:outline-none focus:border-amber-600"
                  placeholder="9876543210"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[56px] py-4 bg-navy hover:bg-gov-blue text-white font-bold text-lg rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? 'Sending...' : getTranslation(currentLanguage, 'send_otp')}
              <ArrowRight size={22} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {getTranslation(currentLanguage, 'enter_otp')}
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-3.5 text-amber-600" size={20} />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-amber-50/50 border-2 border-amber-300 rounded-lg font-black text-2xl text-gray-900 tracking-widest text-center focus:outline-none focus:border-amber-600"
                  placeholder="1234"
                  required
                />
              </div>
              <p className="text-xs text-amber-700 font-bold mt-1 text-center">
                Demo OTP Auto-Filled: 1234
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[56px] py-4 bg-verified hover:opacity-90 text-white font-bold text-lg rounded-lg flex items-center justify-center gap-2 transition-opacity"
            >
              {loading ? 'Verifying...' : getTranslation(currentLanguage, 'verify_login')}
              <ShieldCheck size={22} />
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full py-2 text-xs font-bold text-amber-800 hover:underline text-center"
            >
              ← Change Mobile Number / Farmer ID
            </button>
          </form>
        )}

        <hr className="my-6 border-amber-100" />

        {/* Direct Android APK Download Button for Rural Farmers */}
        <a
          href="/honeychain-farmer.apk"
          download="HoneyChain-Farmer-v1.0.apk"
          className="w-full min-h-[44px] py-2.5 px-4 text-gov-blue font-semibold text-xs flex items-center justify-center gap-2 underline underline-offset-2"
        >
          <Download size={20} /> Download Android App (.apk)
        </a>

        {/* Assisted Login Button */}
        <button
          type="button"
          onClick={() => setShowAssistedModal(true)}
          className="w-full min-h-[48px] py-3 bg-paper hover:bg-ground text-navy font-semibold text-sm rounded-lg border border-rule-strong flex items-center justify-center gap-2 transition-colors"
        >
          <UserCheck size={18} />
          {getTranslation(currentLanguage, 'assisted_login_btn')}
        </button>
      </div>

      </div>

      {/* Assisted Login Modal */}
      {showAssistedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl border-2 border-amber-400">
            <div className="flex items-center gap-2 text-amber-800 mb-2">
              <ShieldCheck size={28} />
              <h3 className="font-extrabold text-lg">
                {getTranslation(currentLanguage, 'assisted_login_title')}
              </h3>
            </div>
            <p className="text-xs text-gray-600 font-medium mb-4">
              {getTranslation(currentLanguage, 'assisted_login_desc')}
            </p>

            <form onSubmit={handleAssistedLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {getTranslation(currentLanguage, 'officer_id')}
                </label>
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {getTranslation(currentLanguage, 'officer_pass')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="password"
                    value={officerPin}
                    onChange={(e) => setOfficerPin(e.target.value)}
                    className="w-full pl-9 p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Target Farmer ID
                </label>
                <input
                  type="text"
                  value={assistedFarmerId}
                  onChange={(e) => setAssistedFarmerId(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-sm"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssistedModal(false)}
                  className="w-1/2 py-3 bg-gray-100 font-bold text-xs rounded-xl text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 py-3 bg-amber-600 font-black text-xs rounded-xl text-white shadow-md"
                >
                  Unlock Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <div className="text-center pb-4 text-xs text-amber-800 font-medium">
        Ministry of MSME • KVIC Beekeeping Initiative
      </div>
    </div>
  );
};
