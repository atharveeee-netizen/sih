"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity, 
  Thermometer, 
  Droplet, 
  Wind, 
  Scale, 
  Cpu, 
  ShieldCheck, 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Layers, 
  PlusCircle, 
  CheckCircle2,
  Radio,
  Sliders,
  ChevronRight,
  Printer
} from "lucide-react";
import { keccak256String } from "@/lib/merkle";
import JarLabelModal from "@/components/JarLabelModal";

export default function BeekeeperDashboard() {
  const [selectedHive, setSelectedHive] = useState(42);
  const [liveBroodTemp, setLiveBroodTemp] = useState(34.82);
  const [liveHumidity, setLiveHumidity] = useState(58.4);
  const [liveVoc, setLiveVoc] = useState(45.2);
  const [liveCo2, setLiveCo2] = useState(620);
  const [liveWeight, setLiveWeight] = useState(38.4);
  const [fftBands, setFftBands] = useState([12, 18, 55, 92, 38, 22, 11, 6]);

  // Jar Label Modal State
  const [showLabelModal, setShowLabelModal] = useState(false);

  // Harvest Proposal Modal State
  const [showHarvestModal, setShowHarvestModal] = useState(false);
  const [harvestMoisture, setHarvestMoisture] = useState("17.4");
  const [isSelfDeclared, setIsSelfDeclared] = useState(true);
  const [submittingBatch, setSubmittingBatch] = useState(false);
  const [batchSuccess, setBatchSuccess] = useState<string | null>(null);

  // Offline SQLite Queue Simulation State
  const [offlineQueuedCount, setOfflineQueuedCount] = useState(0);
  const [isOnline, setIsOnline] = useState(true);

  // Simulated live telemetry jitter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBroodTemp(prev => Number((34.8 + (Math.random() - 0.5) * 0.15).toFixed(2)));
      setLiveHumidity(prev => Number((58.0 + (Math.random() - 0.5) * 0.8).toFixed(1)));
      setLiveVoc(prev => Number((45.0 + (Math.random() - 0.5) * 1.2).toFixed(1)));
      setLiveCo2(prev => Math.floor(620 + (Math.random() - 0.5) * 20));
      setFftBands([
        Math.floor(10 + Math.random() * 5),
        Math.floor(16 + Math.random() * 6),
        Math.floor(50 + Math.random() * 10),
        Math.floor(88 + Math.random() * 12),
        Math.floor(35 + Math.random() * 8),
        Math.floor(20 + Math.random() * 5),
        Math.floor(10 + Math.random() * 3),
        Math.floor(5 + Math.random() * 3),
      ]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleProposeHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBatch(true);
    setTimeout(() => {
      const dummyRoot = keccak256String(`harvest-hive-${selectedHive}-telemetry-${Date.now()}`);
      setSubmittingBatch(false);
      setBatchSuccess(dummyRoot);
      if (!isOnline) {
        setOfflineQueuedCount(prev => prev + 1);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🐝</span>
              <span className="font-bold text-lg text-amber-400 tracking-tight">HONEYCHAIN FLEET OS</span>
            </Link>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 font-mono">
              Yard Alpha · 20 Hives Online
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsOnline(!isOnline)}
              className={`text-xs px-3 py-1 rounded-full border flex items-center gap-1.5 font-mono transition ${
                isOnline 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? "RPC Oracles Connected" : "Offline SQLite Cache"}</span>
            </button>

            <Link 
              href="/verify"
              className="text-xs bg-amber-500 hover:bg-amber-400 text-black font-semibold px-3 py-1.5 rounded-lg transition"
            >
              Verify QR Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Actions & Offline Sync Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Live LoRa Concentrator: 865.0625 MHz (IN865 Band)</h2>
              <p className="text-xs text-slate-400">
                Continuous 32-byte ECDSA-signed telemetry frames streaming from Nordic nRF52840 nodes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {offlineQueuedCount > 0 && (
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg font-mono flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                {offlineQueuedCount} Queued in SQLite
              </span>
            )}

            <button
              onClick={() => setShowLabelModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow transition"
            >
              <Printer className="w-4 h-4" />
              <span>🖨️ Generate Jar QR Label</span>
            </button>

            <button
              onClick={() => {
                setBatchSuccess(null);
                setShowHarvestModal(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Propose Harvest Batch</span>
            </button>
          </div>
        </div>

        {/* 2-Column Hive Monitor View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Hive Selector & Health Matrix */}
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Apiary Cluster Hives (20 Active)
              </h3>

              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1 font-mono text-xs">
                {[42, 108, 14, 27, 88, 19, 5, 73, 91, 33].map(id => (
                  <button
                    key={id}
                    onClick={() => setSelectedHive(id)}
                    className={`w-full p-3 rounded-lg flex items-center justify-between border transition text-left ${
                      selectedHive === id 
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-300" 
                        : "bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>HIVE #{id.toString().padStart(3, "0")}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Day 21 Curing · 34.8°C</span>
                    </div>

                    <div className="text-right">
                      <span className="text-emerald-400 font-bold">98.5%</span>
                      <div className="text-[10px] text-slate-500">AI Health</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* TinyML Edge Triage Status Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Model V2 Edge Triage
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  99.8% ACCURACY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Running locally on nRF52840 (980 B flash). Filtering nominal telemetry to conserve 95% LoRa duty cycle.
              </p>
            </div>
          </div>

          {/* Right Column: Live Telemetry & AI Pathology Gauges */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Sensor Dials */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>Live Telemetry — Hive #{selectedHive.toString().padStart(3, "0")}</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Continuous physical multi-sensor readings with cryptographic device signature.
                  </p>
                </div>
                <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full">
                  ECDSA SIGNATURE VERIFIED
                </span>
              </div>

              {/* 4 Big Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center justify-between">
                    <span>Brood Core Temp</span>
                    <Thermometer className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{liveBroodTemp} °C</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Nominal Homeostasis</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center justify-between">
                    <span>Air Humidity</span>
                    <Droplet className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{liveHumidity}%</div>
                  <div className="text-[10px] text-cyan-400 font-mono">Cavity Health Signal</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center justify-between">
                    <span>VOC Gas &amp; CO2</span>
                    <Wind className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{liveVoc} kΩ</div>
                  <div className="text-[10px] text-slate-400 font-mono">{liveCo2} ppm CO2</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <div className="text-slate-400 text-xs flex items-center justify-between">
                    <span>Nectar Weight</span>
                    <Scale className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{liveWeight} kg</div>
                  <div className="text-[10px] text-purple-400 font-mono">+6.4 kg (Capped)</div>
                </div>
              </div>

              {/* 8-Band Acoustic FFT Spectrum Bar Chart */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-amber-400" />
                    Acoustic 8-Band FFT Spectrum (1D-CNN Disease Classifier Input)
                  </span>
                  <span className="font-mono text-emerald-400 text-[11px]">
                    STATUS: HEALTHY QUEEN-RIGHT
                  </span>
                </div>

                <div className="grid grid-cols-8 gap-2 items-end h-24 pt-4">
                  {fftBands.map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 h-full justify-end">
                      <div 
                        className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t transition-all duration-300"
                        style={{ height: `${Math.min(100, (val / 120) * 100)}%` }}
                      />
                      <span className="text-[9px] text-slate-500 font-mono">B{idx+1}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 font-mono text-center">
                  Bands 1-2: Mechanical (0-100Hz) · Bands 3-4: Queen Hum (150-250Hz) · Bands 5-6: Stress (300-500Hz) · Bands 7-8: Varroa (600-800Hz)
                </p>
              </div>
            </div>

            {/* AI Diagnostics & Swarm Prediction Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  Gateway AI Multi-Model Diagnostic Engine
                </h3>
                <span className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-0.5 rounded font-mono">
                  Raspberry Pi CM4 + Coral TPU
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">1D-CNN Acoustic Model</div>
                  <div className="font-bold text-emerald-400 text-sm mt-1">Zero Pathology</div>
                  <div className="text-[10px] text-slate-500">96.4% Varroa/Foulbrood accuracy</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Swarm-Prediction LSTM</div>
                  <div className="font-bold text-emerald-400 text-sm mt-1">Risk Score: 0.12 (Nominal)</div>
                  <div className="text-[10px] text-slate-500">24-hour horizon (96.0% accuracy)</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Autoencoder Fault Detector</div>
                  <div className="font-bold text-emerald-400 text-sm mt-1">Sensors Calibrated</div>
                  <div className="text-[10px] text-slate-500">Loss: 0.084 (89.0% accuracy)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Harvest Proposal Modal */}
      {showHarvestModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🍯</span> Propose Harvest Batch — Hive #{selectedHive}
              </h3>
              <button 
                onClick={() => setShowHarvestModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {batchSuccess ? (
              <div className="space-y-4 text-center py-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Batch Successfully Proposed!</h4>
                <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-left text-slate-300 break-all space-y-1">
                  <div className="text-slate-500">Calculated Keccak-256 Merkle Root:</div>
                  <div className="text-emerald-400 font-bold">{batchSuccess}</div>
                </div>
                <p className="text-xs text-slate-400">
                  Harvest proposal broadcasted to 2-of-3 Oracle Quorum for on-chain finalization on Polygon Amoy.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setShowHarvestModal(false);
                      setShowLabelModal(true);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition"
                  >
                    <Printer className="w-4 h-4" />
                    <span>🖨️ Print Jar Label</span>
                  </button>
                  <Link
                    href="/verify"
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center transition"
                  >
                    View Consumer QR
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProposeHarvest} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Honey Moisture Content (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="12.0"
                    max="22.0"
                    value={harvestMoisture}
                    onChange={(e) => setHarvestMoisture(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                    required
                  />
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="selfDeclared"
                      checked={isSelfDeclared}
                      onChange={(e) => setIsSelfDeclared(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                    />
                    <label htmlFor="selfDeclared" className="text-xs text-amber-400/90 font-mono">
                      Flag as &ldquo;Self-Declared Field Entry&rdquo; (Pending P2 Refractometer Probe)
                    </label>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between text-slate-300">
                    <span>Curing Period Days:</span>
                    <span className="font-mono text-white">21 Days</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>AI Health Verdict:</span>
                    <span className="font-mono text-emerald-400">Certified Organic Healthy</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Consensus Threshold:</span>
                    <span className="font-mono text-amber-400">2-of-3 Multi-Oracle Quorum</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submittingBatch}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow transition"
                >
                  <Layers className="w-4 h-4" />
                  <span>{submittingBatch ? "Building Keccak-256 Merkle Tree..." : "Submit Batch to Oracles"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* High-Resolution SVG Jar Label Modal */}
      <JarLabelModal
        isOpen={showLabelModal}
        onClose={() => setShowLabelModal(false)}
        batchId={1}
        hiveId={selectedHive}
        clusterName="KVIC Coorg Cluster · Yard Alpha"
        moisturePct={parseFloat(harvestMoisture) || 17.4}
        isSelfDeclared={isSelfDeclared}
        merkleRoot={batchSuccess || "0x7f4e92a18b56012c49d84e3650221379e49c7199fa68e2195f128e4692751f0b"}
      />
    </div>
  );
}
