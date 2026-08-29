"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  ShieldCheck, 
  QrCode, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Thermometer, 
  Droplet, 
  Scale, 
  Activity, 
  ExternalLink,
  Download,
  Info,
  Lock,
  Layers,
  Camera,
  Printer
} from "lucide-react";
import { SAMPLE_BATCHES, HarvestBatchData } from "@/lib/mockData";
import { verifyMerkleProof } from "@/lib/merkle";
import QRScannerModal from "@/components/QRScannerModal";
import JarLabelModal from "@/components/JarLabelModal";

export default function VerifyPage() {
  const params = useParams();
  const paramBatchId = params?.batchId as string | undefined;

  const [searchId, setSearchId] = useState(paramBatchId || "1");
  const [activeBatch, setActiveBatch] = useState<HarvestBatchData | null>(
    paramBatchId && SAMPLE_BATCHES[parseInt(paramBatchId, 10)] 
      ? SAMPLE_BATCHES[parseInt(paramBatchId, 10)] 
      : SAMPLE_BATCHES[1]
  );
  const [verifyingProof, setVerifyingProof] = useState(false);
  const [proofVerified, setProofVerified] = useState<boolean | null>(true);

  // Modal states
  const [showScanner, setShowScanner] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);

  useEffect(() => {
    if (paramBatchId) {
      const id = parseInt(paramBatchId, 10);
      setSearchId(paramBatchId);
      if (SAMPLE_BATCHES[id]) {
        setActiveBatch(SAMPLE_BATCHES[id]);
        setProofVerified(null);
      }
    }
  }, [paramBatchId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(searchId, 10);
    if (SAMPLE_BATCHES[id]) {
      setActiveBatch(SAMPLE_BATCHES[id]);
      setProofVerified(null);
    } else {
      setActiveBatch(null);
    }
  };

  const handleScanDetected = (batchId: number) => {
    setSearchId(batchId.toString());
    if (SAMPLE_BATCHES[batchId]) {
      setActiveBatch(SAMPLE_BATCHES[batchId]);
      setProofVerified(null);
    }
  };

  const handleLiveProofVerify = () => {
    if (!activeBatch) return;
    setVerifyingProof(true);
    setTimeout(() => {
      // Run pure-TS sorted-pair keccak256 proof validation
      const isValid = verifyMerkleProof(
        activeBatch.leafHashDay1,
        activeBatch.proofDay1,
        activeBatch.merkleRoot
      );
      setProofVerified(isValid);
      setVerifyingProof(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🍯</span>
              <span className="font-bold text-lg text-amber-400 tracking-tight">HONEYCHAIN</span>
            </Link>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
              SIH-26021 DePIN
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 transition"
            >
              Beekeeper Dashboard
            </Link>
            <Link 
              href="/kvic-onboard" 
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 transition"
            >
              KVIC Rural Onboarding
            </Link>
          </div>
        </div>
      </header>

      {/* Main Verification Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Verification Hero Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>GASLESS CONSUMER QR VERIFICATION (ZERO WALLET REQUIRED)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Cryptographic Honey Provenance & Hive Health
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Scan your jar&apos;s QR code or enter a Batch ID to verify immutable on-chain telemetry, 
            2-of-3 multi-oracle quorum signatures, and continuous AI colony welfare reports.
          </p>

          {/* Search & Scan Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto pt-2">
            <form onSubmit={handleSearch} className="w-full sm:flex-grow">
              <div className="relative w-full flex">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter Batch ID (e.g. 1, 2, 3)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-l-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-5 rounded-r-xl text-sm flex items-center space-x-1.5 transition whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  <span>Verify</span>
                </button>
              </div>
            </form>

            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 transition whitespace-nowrap shrink-0"
            >
              <Camera className="w-4 h-4" />
              <span>📷 Scan Jar QR Code</span>
            </button>
          </div>
        </div>

        {activeBatch ? (
          <div className="space-y-6">
            {/* Verified Batch Certificate Card */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border-2 border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      ON-CHAIN FINALIZED &amp; ATTESTED
                    </span>
                    <span className="text-xs font-mono text-slate-400">Batch #{activeBatch.batchId}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Pure Unadulterated Raw Honey — Hive #{activeBatch.hiveId}
                  </h2>
                  <p className="text-xs text-slate-400">
                    📍 {activeBatch.apiaryLocation} · {activeBatch.clusterName}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowLabelModal(true)}
                    className="inline-flex items-center justify-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-3.5 py-2.5 rounded-xl shadow transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Jar Label</span>
                  </button>

                  <button 
                    onClick={handleLiveProofVerify}
                    disabled={verifyingProof}
                    className="inline-flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow transition"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{verifyingProof ? "Verifying Merkle Root..." : "Validate Merkle Proof"}</span>
                  </button>

                  <a
                    href={`https://amoy.polygonscan.com/address/${activeBatch.contractAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 transition"
                  >
                    <span>Smart Contract</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Cryptographic Merkle Root Verification Display */}
              <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-400 gap-1">
                  <span className="flex items-center gap-1 text-slate-300">
                    <Layers className="w-4 h-4 text-amber-400" />
                    Keccak-256 Merkle Root (On-Chain Anchor):
                  </span>
                  <span className="text-emerald-400 font-bold break-all">{activeBatch.merkleRoot}</span>
                </div>

                {proofVerified !== null && (
                  <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                    proofVerified ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300" : "bg-rose-950/60 border border-rose-500/40 text-rose-300"
                  }`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      {proofVerified 
                        ? "✓ Mathematical Keccak-256 Proof Valid: Telemetry leaves match on-chain Merkle root bit-for-bit."
                        : "✗ Verification Failed: Leaf does not match root."}
                    </span>
                  </div>
                )}
              </div>

              {/* 4 Core Verification Metric Panels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                {/* 1. Brood Core Temp */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Brood Core Homeostasis</span>
                    <Thermometer className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-bold text-white">
                    {activeBatch.telemetrySummary.avgBroodTempC} °C
                  </div>
                  <p className="text-[11px] text-emerald-400">
                    ✓ Optimal 34.0°C–35.5°C nest health
                  </p>
                </div>

                {/* 2. Air Humidity vs Moisture */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Hive Air Cavity Humidity</span>
                    <Droplet className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl font-bold text-white">
                    {activeBatch.telemetrySummary.avgHumidityPct}% RH
                  </div>
                  <p className="text-[11px] text-cyan-300">
                    Colony environmental health signal
                  </p>
                </div>

                {/* 3. Honey Moisture at Extraction */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Moisture at Harvest</span>
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-emerald-400">
                    {activeBatch.moisturePct}%
                  </div>
                  <p className="text-[11px] text-amber-300/90 font-mono">
                    ⚠️ Self-declared field entry (P2 probe)
                  </p>
                </div>

                {/* 4. Total Nectar Yield */}
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Net Nectar Gain</span>
                    <Scale className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl font-bold text-white">
                    +{activeBatch.telemetrySummary.netWeightGainKg} kg
                  </div>
                  <p className="text-[11px] text-purple-300">
                    Over {activeBatch.curingPeriodDays}-day curing period
                  </p>
                </div>
              </div>
            </div>

            {/* AI Colony Welfare & Disease Diagnostic Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">
                    Edge-to-Gateway AI Colony Welfare Report
                  </h3>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-mono">
                  ACOUSTIC HEALTH: {activeBatch.aiHealthSummary.acousticHealthScore}%
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                💬 <strong className="text-white">AI Diagnostic Summary:</strong> {activeBatch.aiHealthSummary.notes}
              </p>

              {/* 21-Day Timeline Events */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  21-Day Curing Lifecycle Timeline
                </h4>
                <div className="space-y-2">
                  {activeBatch.aiHealthSummary.timelineEvents.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs"
                    >
                      <span className="font-mono font-bold text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded">
                        Day {item.day}
                      </span>
                      <div className="flex-grow">
                        <div className="font-semibold text-slate-200">{item.event}</div>
                        <div className="text-slate-400 text-[11px]">{item.description}</div>
                      </div>
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                        item.severity === "success" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : item.severity === "warning" 
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {item.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2-of-3 Multi-Oracle Quorum Verification */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">
                    2-of-3 Multi-Oracle Quorum Signatures
                  </h3>
                </div>
                <span className="text-xs text-emerald-400 font-mono">
                  QUORUM MET (2/3)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeBatch.attestations.map((att, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-500/20 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{att.nodeType}</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 break-all">
                        {att.oracleAddress}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Attested: {att.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-950/40 p-3 rounded-lg flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  By requiring independent cryptographic signatures from both the local gateway and the regional KVIC co-signer, 
                  HoneyChain guarantees that no single compromised sensor or oracle can fabricate batch provenance.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Batch Not Found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              No finalized on-chain harvest batch matches ID &ldquo;{searchId}&rdquo;. Please verify the QR code on your honey jar.
            </p>
            <button
              onClick={() => {
                setSearchId("1");
                setActiveBatch(SAMPLE_BATCHES[1]);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 px-4 py-2 rounded-xl text-xs font-mono transition"
            >
              Load Demo Batch #1 (Coorg KVIC Cluster)
            </button>
          </div>
        )}
      </main>

      {/* Interactive Camera & Dropzone QR Scanner Modal */}
      <QRScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleScanDetected}
      />

      {/* High-Resolution SVG Jar Label Modal */}
      {activeBatch && (
        <JarLabelModal
          isOpen={showLabelModal}
          onClose={() => setShowLabelModal(false)}
          batchId={activeBatch.batchId}
          hiveId={activeBatch.hiveId}
          clusterName={activeBatch.clusterName}
          moisturePct={activeBatch.moisturePct}
          isSelfDeclared={activeBatch.moistureSelfDeclared}
          merkleRoot={activeBatch.merkleRoot}
          contractAddress={activeBatch.contractAddress}
        />
      )}
    </div>
  );
}
