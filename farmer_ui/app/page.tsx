'use client';

import React, { useState, useEffect } from 'react';
import { Farmer, FieldOfficer, HiveStatus, LanguageCode } from '../lib/types';
import { DEFAULT_FARMER, MOCK_FIELD_OFFICER, INITIAL_HIVES } from '../lib/mockData';
import { getTranslation } from '../lib/i18n/dictionaries';
import { speakNarration, stopNarration } from '../lib/voice/narration';
import {
  saveCachedFarmer,
  getCachedFarmer,
  saveCachedFieldOfficer,
  getCachedFieldOfficer,
  saveCachedHives,
  getCachedHives,
  queueCallbackRequest,
  queueActionLog,
} from '../lib/db/offlineStore';
import { flushOutboxQueue } from '../lib/db/syncOutbox';

import { VoiceHeader } from '../components/VoiceHeader';
import { Navigation, NavTab } from '../components/Navigation';
import { LoginScreen } from '../components/screens/LoginScreen';
import { LanguageScreen } from '../components/screens/LanguageScreen';
import { HiveMapScreen } from '../components/screens/HiveMapScreen';
import { HiveDetailModal } from '../components/screens/HiveDetailModal';
import { ActionTabScreen } from '../components/screens/ActionTabScreen';
import { HelpScreen } from '../components/screens/HelpScreen';
import { HivePalInspectionModal, InspectionRecord } from '../components/screens/HivePalInspectionModal';
import { HivePalInspectionTab } from '../components/screens/HivePalInspectionTab';

export default function Home() {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [fieldOfficer, setFieldOfficer] = useState<FieldOfficer>(MOCK_FIELD_OFFICER);
  const [hives, setHives] = useState<HiveStatus[]>(INITIAL_HIVES);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('hi');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTab>('inspect');
  const [selectedHive, setSelectedHive] = useState<HiveStatus | null>(null);
  const [activeInspection, setActiveInspection] = useState<{ id: number; name: string } | null>(null);

  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [callbackStatus, setCallbackStatus] = useState<'none' | 'queued' | 'sent'>('none');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Register Service Worker for PWA
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Service Worker Registered:', reg.scope))
        .catch((err) => console.warn('Service Worker Error:', err));
    }
  }, []);

  // Online / Offline Status Detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOffline(false);
      showToast('Back online! Syncing updates...');
      flushOutboxQueue((msg) => showToast(msg));
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast('Offline Mode - Using Cached Data');
    };

    setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load Initial Data from Cache / Server
  useEffect(() => {
    async function loadInitialData() {
      // Try local cache first (offline tolerant)
      const cachedFarmer = await getCachedFarmer();
      const cachedOfficer = await getCachedFieldOfficer();
      const cachedHives = await getCachedHives();

      if (cachedFarmer) {
        setFarmer(cachedFarmer);
        setCurrentLanguage(cachedFarmer.preferredLanguage);
        setVoiceEnabled(cachedFarmer.voiceEnabled);
        setSessionToken('CACHED-SESSION');
      }

      if (cachedOfficer) setFieldOfficer(cachedOfficer);
      if (cachedHives && cachedHives.length > 0) setHives(cachedHives);

      // Silent background fetch if online
      if (navigator.onLine) {
        fetchHivesData();
      }
    }

    loadInitialData();
  }, []);

  // Auto-narrate screen title on tab change when voice is enabled
  useEffect(() => {
    if (sessionToken && voiceEnabled) {
      let titleKey = 'my_hives';
      if (activeTab === 'actions') titleKey = 'actions_title';
      if (activeTab === 'help') titleKey = 'nav_help';

      const text = getTranslation(currentLanguage, titleKey);
      speakNarration(
        text,
        currentLanguage,
        true,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  }, [activeTab, sessionToken, voiceEnabled, currentLanguage]);

  const fetchHivesData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/hives');
      if (res.ok) {
        const data = await res.json();
        if (data.hives) {
          setHives(data.hives);
          await saveCachedHives(data.hives);
        }
      }
    } catch (err) {
      console.warn('Using cached telemetry:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLoginSuccess = async (farmerData: Farmer, token: string) => {
    setFarmer(farmerData);
    setSessionToken(token);
    setCurrentLanguage(farmerData.preferredLanguage);
    setVoiceEnabled(farmerData.voiceEnabled);

    await saveCachedFarmer(farmerData);
    await saveCachedFieldOfficer(MOCK_FIELD_OFFICER);
    await saveCachedHives(INITIAL_HIVES);

    showToast('Login Verified! Welcome to HoneyChain Companion');

    if (farmerData.voiceEnabled) {
      speakNarration('लॉगिन सफल। हनीचैन किसान ऐप में आपका स्वागत है', farmerData.preferredLanguage, true);
    }
  };

  const handleToggleVoice = () => {
    const nextVoice = !voiceEnabled;
    setVoiceEnabled(nextVoice);
    if (!nextVoice) {
      stopNarration();
      setIsSpeaking(false);
    } else {
      speakNarration('आवाज ऑन है', currentLanguage, true);
    }
  };

  const handleSelectLanguage = (code: LanguageCode) => {
    setCurrentLanguage(code);
    if (farmer) {
      const updated = { ...farmer, preferredLanguage: code };
      setFarmer(updated);
      saveCachedFarmer(updated);
    }
  };

  const handleMarkActionDone = async (hiveId: number, riskId: string) => {
    // Optimistic UI update
    setHives((prev) =>
      prev.map((h) =>
        h.hiveId === hiveId
          ? {
              ...h,
              activeRisks: h.activeRisks.filter((r) => r.id !== riskId),
              overallStatus: h.activeRisks.length <= 1 ? 'healthy' : h.overallStatus,
            }
          : h
      )
    );

    const actionItem = {
      id: `ACT-${Date.now()}`,
      farmerId: farmer?.farmerId || DEFAULT_FARMER.farmerId,
      hiveId,
      riskType: riskId,
      action: 'marked_done' as const,
      createdAt: new Date().toISOString(),
    };

    if (navigator.onLine) {
      try {
        await fetch(`/api/alerts/${riskId}/mark-done`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(actionItem),
        });
        showToast('Action marked as completed!');
      } catch (err) {
        await queueActionLog(actionItem);
        showToast('Offline — Action queued for background sync');
      }
    } else {
      await queueActionLog(actionItem);
      showToast('Offline — Action queued for background sync');
    }
  };

  const handleRequestCallback = async (hiveId?: number, riskType?: string) => {
    const cbReq = {
      id: `CB-${Date.now()}`,
      farmerId: farmer?.farmerId || DEFAULT_FARMER.farmerId,
      fieldOfficerId: fieldOfficer.fieldOfficerId,
      hiveId: hiveId || null,
      riskType: riskType || null,
      status: navigator.onLine ? ('sent' as const) : ('queued' as const),
      createdAt: new Date().toISOString(),
    };

    if (navigator.onLine) {
      try {
        await fetch('/api/callback-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cbReq),
        });
        setCallbackStatus('sent');
        showToast('Call back request sent to Field Officer!');
      } catch (err) {
        await queueCallbackRequest(cbReq);
        setCallbackStatus('queued');
        showToast('Offline — Call back request queued');
      }
    } else {
      await queueCallbackRequest(cbReq);
      setCallbackStatus('queued');
      showToast('Offline — Call back request queued');
    }
  };

  // If unauthenticated, show Login Screen
  if (!sessionToken) {
    return (
      <LoginScreen
        currentLanguage={currentLanguage}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  const alertCount = hives.flatMap((h) => h.activeRisks).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between max-w-md mx-auto relative shadow-2xl border-x border-stone-800">
      {/* Voice & Language Header */}
      <VoiceHeader
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        currentLanguage={currentLanguage}
        onOpenLanguageModal={() => setShowLanguageModal(true)}
        isOffline={isOffline}
        isSpeaking={isSpeaking}
      />

      {/* Floating Toast Banner */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-950 text-white font-extrabold text-xs px-4 py-2.5 rounded-full shadow-2xl border border-amber-400 animate-bounce text-center max-w-xs">
          {toastMessage}
        </div>
      )}

      {/* Screen Views */}
      <main className="flex-1">
        {activeTab === 'map' && (
          <HiveMapScreen
            hives={hives}
            onSelectHive={(hive) => setSelectedHive(hive)}
            currentLanguage={currentLanguage}
            onRefresh={fetchHivesData}
            isRefreshing={isRefreshing}
            onOpenInspection={(hiveId, hiveName) => setActiveInspection({ id: hiveId, name: hiveName })}
          />
        )}

        {activeTab === 'actions' && (
          <ActionTabScreen
            hives={hives}
            currentLanguage={currentLanguage}
            onMarkActionDone={handleMarkActionDone}
            onRequestHelp={(hiveId, riskType) => {
              setActiveTab('help');
              handleRequestCallback(hiveId, riskType);
            }}
          />
        )}

        {activeTab === 'inspect' && (
          <HivePalInspectionTab
            hives={hives}
            currentLanguage={currentLanguage}
            onInspectionSaved={(rec) => {
              showToast(`Hive #${rec.hiveId} inspection recorded!`);
            }}
          />
        )}

        {activeTab === 'help' && (
          <HelpScreen
            officer={fieldOfficer}
            currentLanguage={currentLanguage}
            onRequestCallback={() => handleRequestCallback()}
            callbackStatus={callbackStatus}
          />
        )}
      </main>

      {/* Hive Detail Modal */}
      {selectedHive && (
        <HiveDetailModal
          hive={selectedHive}
          onClose={() => setSelectedHive(null)}
          currentLanguage={currentLanguage}
          voiceEnabled={voiceEnabled}
          onRequestHelp={(hiveId, riskType) => {
            setSelectedHive(null);
            setActiveTab('help');
            handleRequestCallback(hiveId, riskType);
          }}
          onOpenInspection={(hiveId, hiveName) => setActiveInspection({ id: hiveId, name: hiveName })}
        />
      )}

      {/* Hive-Pal Field Inspection Wizard Modal */}
      {activeInspection && (
        <HivePalInspectionModal
          isOpen={!!activeInspection}
          onClose={() => setActiveInspection(null)}
          hiveId={activeInspection.id}
          hiveName={activeInspection.name}
          currentLanguage={currentLanguage}
          onSaveInspection={(rec: InspectionRecord) => {
            showToast(`Hive #${rec.hiveId} inspection saved & synced!`);
          }}
        />
      )}

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <LanguageScreen
          currentLanguage={currentLanguage}
          onSelectLanguage={handleSelectLanguage}
          onClose={() => setShowLanguageModal(false)}
          voiceEnabled={voiceEnabled}
        />
      )}

      {/* Bottom Navigation */}
      <Navigation
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        currentLanguage={currentLanguage}
        alertCount={alertCount}
      />
    </div>
  );
}
