"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  ShieldCheck, 
  QrCode, 
  Cpu, 
  Database, 
  Building2, 
  LayoutDashboard, 
  Boxes, 
  ShoppingBag, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  Layers,
  MapPin,
  TrendingUp,
  Activity,
  FileCheck
} from "lucide-react";

export default function HoneyChainHome() {
  const router = useRouter();
  const [packageCode, setPackageCode] = useState("");
  const [stats, setStats] = useState({
    clusters_active: 3,
    registered_beekeepers: 5,
    total_monitored_hives: 12,
    healthy_colonies: 11,
    at_risk_colonies: 1,
    total_harvested_honey_kg: 107.5,
    total_honey_batches: 2,
    verified_market_batches: 2,
    traceability_compliance_pct: 100.0,
    suspicious_counterfeit_alerts: 1
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/stats/kvic")
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => {
        // Graceful fallback to seeded values
      });
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = packageCode.trim() || "HC-PKG-A7F93E12";
    router.push(`/v/${code}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-[#f1f5f9] font-sans selection:bg-[#f59e0b] selection:text-[#090b10]">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#283144] overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#f59e0b]/10 to-transparent pointer-events-none blur-3xl -z-10" />

          <div className="max-w-6xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181d28] border border-[#283144] text-[11px] font-mono text-[#ffc833]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span>Smart India Hackathon 2024 • Problem Statement ID 26021</span>
              <span className="text-[#64748b]">•</span>
              <span className="text-[#94a3b8]">Ministry of MSME — KVIC Honey Mission</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#f1f5f9] uppercase font-mono">
              HONEY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#d97706]">CHAIN</span>
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#94a3b8] leading-relaxed">
              An integrated <span className="text-[#f1f5f9] font-semibold">Permissioned Cryptographic Ledger</span>, 
              <span className="text-[#f1f5f9] font-semibold"> IoT Smart Hive Monitoring</span>, and 
              <span className="text-[#f1f5f9] font-semibold"> QR Consumer Verification</span> ecosystem designed to eliminate counterfeit honey, 
              restore consumer trust, and empower rural beekeepers across national KVIC clusters.
            </p>

            {/* QUICK CONSUMER QR TRACKER */}
            <div className="max-w-2xl mx-auto mt-8 p-4 bg-[#11141d] border border-[#3d4964] rounded-lg shadow-xl font-mono text-left">
              <label htmlFor="package-input" className="block text-xs uppercase tracking-wider text-[#94a3b8] mb-2 font-semibold">
                Instant Package Authenticity & Provenance Check
              </label>
              <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#64748b]">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <input
                    id="package-input"
                    type="text"
                    value={packageCode}
                    onChange={(e) => setPackageCode(e.target.value)}
                    placeholder="Enter Package Code (e.g. HC-PKG-A7F93E12)"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#090b10] border border-[#283144] rounded text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#f59e0b]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#090b10] font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify</span>
                </button>
              </form>

              {/* Demo Test Chips */}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#64748b] text-[11px]">Demo Profiles:</span>
                <button
                  type="button"
                  onClick={() => router.push("/v/HC-PKG-A7F93E12")}
                  className="px-2 py-1 bg-[#181d28] hover:bg-[#1f2637] border border-[#10b981]/50 text-[#10b981] rounded text-[11px] flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Authentic Nilgiris (HC-PKG-A7F93E12)</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/v/HC-PKG-B8C24D91")}
                  className="px-2 py-1 bg-[#181d28] hover:bg-[#1f2637] border border-[#ef4444]/50 text-[#ef4444] rounded text-[11px] flex items-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Flagged Reuse Anomaly (HC-PKG-B8C24D91)</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* KVIC MACRO IMPACT METRICS */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 bg-[#0b0e14] border-b border-[#283144] font-mono">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm uppercase tracking-wider font-bold text-[#f1f5f9]">National Apiculture Status</h2>
                <p className="text-xs text-[#94a3b8]">Live telemetry & audit aggregates from KVIC Honey Mission regional nodes</p>
              </div>
              <Link href="/kvic" className="text-xs text-[#f59e0b] hover:underline flex items-center gap-1">
                <span>View Full KVIC Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
                <div className="flex items-center justify-between text-[#94a3b8] text-xs mb-1">
                  <span>ACTIVE CLUSTERS</span>
                  <MapPin className="w-3.5 h-3.5 text-[#f59e0b]" />
                </div>
                <div className="text-2xl font-bold text-[#f1f5f9]">{stats.clusters_active}</div>
                <div className="text-[10px] text-[#64748b] mt-1">Nilgiris, Gir, Kashmir Valley</div>
              </div>

              <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
                <div className="flex items-center justify-between text-[#94a3b8] text-xs mb-1">
                  <span>MONITORED HIVES</span>
                  <Activity className="w-3.5 h-3.5 text-[#10b981]" />
                </div>
                <div className="text-2xl font-bold text-[#f1f5f9]">{stats.total_monitored_hives}</div>
                <div className="text-[10px] text-[#10b981] mt-1">{stats.healthy_colonies} Healthy • {stats.at_risk_colonies} At-Risk</div>
              </div>

              <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
                <div className="flex items-center justify-between text-[#94a3b8] text-xs mb-1">
                  <span>HONEY HARVESTED</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#3b82f6]" />
                </div>
                <div className="text-2xl font-bold text-[#f1f5f9]">{stats.total_harvested_honey_kg} kg</div>
                <div className="text-[10px] text-[#64748b] mt-1">{stats.total_honey_batches} Verified Batches</div>
              </div>

              <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
                <div className="flex items-center justify-between text-[#94a3b8] text-xs mb-1">
                  <span>LEDGER INTEGRITY</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                </div>
                <div className="text-2xl font-bold text-[#10b981]">{stats.traceability_compliance_pct}%</div>
                <div className="text-[10px] text-[#64748b] mt-1">SHA-256 Unbroken Chain</div>
              </div>
            </div>
          </div>
        </section>

        {/* 6-TIER CANONICAL ARCHITECTURE PIPELINE */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-[#283144]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-xs font-mono font-bold text-[#f59e0b] uppercase tracking-wider">End-to-End Cyber-Physical Architecture</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#f1f5f9] font-mono mt-1 uppercase">
                From Smart Hive to Verified Bottle
              </h2>
              <p className="max-w-2xl mx-auto text-sm text-[#94a3b8] mt-2">
                Every physical action generates an immutable cryptographic event with cryptographic proof and anti-tamper verification.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
              {/* Stage 1 */}
              <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-[#f59e0b] font-bold mb-1">STAGE 01</div>
                  <div className="font-bold text-[#f1f5f9] mb-2">SMART HIVES</div>
                  <p className="text-[11px] text-[#94a3b8] leading-tight">
                    16-sensor IoT matrix with 5-point frame temperature gradient, load-cell comb weight, CO2, and acoustics.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#283144] text-[10px] text-[#64748b]">
                  LoRa 865-867 MHz
                </div>
              </div>

              {/* Stage 2 */}
              <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-[#f59e0b] font-bold mb-1">STAGE 02</div>
                  <div className="font-bold text-[#f1f5f9] mb-2">EDGE AI</div>
                  <p className="text-[11px] text-[#94a3b8] leading-tight">
                    On-MCU CMSIS-DSP 256-pt Real FFT, Page-CUSUM drift detector, and gateway sensor fusion diagnostics.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#283144] text-[10px] text-[#64748b]">
                  Colony Health Risk
                </div>
              </div>

              {/* Stage 3 */}
              <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-[#f59e0b] font-bold mb-1">STAGE 03</div>
                  <div className="font-bold text-[#f1f5f9] mb-2">HARVEST LOG</div>
                  <p className="text-[11px] text-[#94a3b8] leading-tight">
                    Farmer records harvest with comb tare weight, field refractometer moisture, and GPS-tagged flora source.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#283144] text-[10px] text-[#64748b]">
                  Consolidated Batch
                </div>
              </div>

              {/* Stage 4 */}
              <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-[#f59e0b] font-bold mb-1">STAGE 04</div>
                  <div className="font-bold text-[#f1f5f9] mb-2">KVIC LAB QA</div>
                  <p className="text-[11px] text-[#94a3b8] leading-tight">
                    FSSAI/KVIC laboratory test: Moisture ≤20%, HMF ≤40 mg/kg, diastase activity, and C4/C3 sugar purity test.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#283144] text-[10px] text-[#64748b]">
                  Quality Certificate
                </div>
              </div>

              {/* Stage 5 */}
              <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-[#f59e0b] font-bold mb-1">STAGE 05</div>
                  <div className="font-bold text-[#f1f5f9] mb-2">BLOCKCHAIN</div>
                  <p className="text-[11px] text-[#94a3b8] leading-tight">
                    Immutable SHA-256 event chaining. Each stage links cryptographically to previous block hash.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#283144] text-[10px] text-[#64748b]">
                  Zero Tampering
                </div>
              </div>

              {/* Stage 6 */}
              <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-[#f59e0b] font-bold mb-1">STAGE 06</div>
                  <div className="font-bold text-[#f1f5f9] mb-2">CONSUMER QR</div>
                  <p className="text-[11px] text-[#94a3b8] leading-tight">
                    Unique retail package tokens (`HC-PKG-...`) with real-time scan frequency, velocity, and reuse anomaly detection.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#283144] text-[10px] text-[#64748b]">
                  Proof of Authenticity
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKSPACE PORTALS GRID */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0b0e14] border-b border-[#283144] font-mono">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-[#f59e0b] uppercase tracking-wider">Operational Portals</span>
              <h2 className="text-2xl font-bold text-[#f1f5f9] mt-1 uppercase">
                Explore Honey Chain Subsystems
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Consumer QR Verification */}
              <Link href="/verify" className="p-5 bg-[#11141d] border border-[#283144] hover:border-[#f59e0b] transition-all rounded-sm group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded bg-[#181d28] text-[#f59e0b] group-hover:scale-110 transition-transform">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#64748b] uppercase">Public Portal</span>
                </div>
                <h3 className="text-base font-bold text-[#f1f5f9] group-hover:text-[#f59e0b] transition-colors mb-1">
                  Consumer Verification
                </h3>
                <p className="text-xs text-[#94a3b8] leading-normal mb-3">
                  Verify retail honey jars, trace flower to jar provenance, inspect lab quality certificates, and verify cryptographic hashes.
                </p>
                <div className="text-xs text-[#f59e0b] flex items-center gap-1 font-semibold">
                  <span>Verify Bottle</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Card 2: KVIC Admin Command */}
              <Link href="/kvic" className="p-5 bg-[#11141d] border border-[#283144] hover:border-[#f59e0b] transition-all rounded-sm group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded bg-[#181d28] text-[#10b981] group-hover:scale-110 transition-transform">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#64748b] uppercase">Government</span>
                </div>
                <h3 className="text-base font-bold text-[#f1f5f9] group-hover:text-[#f59e0b] transition-colors mb-1">
                  KVIC Admin Console
                </h3>
                <p className="text-xs text-[#94a3b8] leading-normal mb-3">
                  Macro cluster management, beekeeper census, regional honey yields, at-risk colony interventions, and counterfeit alarms.
                </p>
                <div className="text-xs text-[#10b981] flex items-center gap-1 font-semibold">
                  <span>Open KVIC Console</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Card 3: Beekeeper Workspace */}
              <Link href="/beekeeper" className="p-5 bg-[#11141d] border border-[#283144] hover:border-[#f59e0b] transition-all rounded-sm group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded bg-[#181d28] text-[#3b82f6] group-hover:scale-110 transition-transform">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#64748b] uppercase">Rural Farmer</span>
                </div>
                <h3 className="text-base font-bold text-[#f1f5f9] group-hover:text-[#f59e0b] transition-colors mb-1">
                  Beekeeper Portal
                </h3>
                <p className="text-xs text-[#94a3b8] leading-normal mb-3">
                  Apiary management, smart hive health cards, record harvests, view AI productivity predictions, and track batch curing.
                </p>
                <div className="text-xs text-[#3b82f6] flex items-center gap-1 font-semibold">
                  <span>Farmer Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Card 4: Smart Hive Fleet Telemetry */}
              <Link href="/hives" className="p-5 bg-[#11141d] border border-[#283144] hover:border-[#f59e0b] transition-all rounded-sm group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded bg-[#181d28] text-[#f59e0b] group-hover:scale-110 transition-transform">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#64748b] uppercase">IoT Network</span>
                </div>
                <h3 className="text-base font-bold text-[#f1f5f9] group-hover:text-[#f59e0b] transition-colors mb-1">
                  Smart Hive Fleet
                </h3>
                <p className="text-xs text-[#94a3b8] leading-normal mb-3">
                  Live multi-sensor telemetry streams: 5-point frame gradient, acoustic FFT spectrograms, Varroa load, and tamper knockdown.
                </p>
                <div className="text-xs text-[#f59e0b] flex items-center gap-1 font-semibold">
                  <span>Monitor Hives</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Card 5: Traceability Batches */}
              <Link href="/batches" className="p-5 bg-[#11141d] border border-[#283144] hover:border-[#f59e0b] transition-all rounded-sm group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded bg-[#181d28] text-[#8b5cf6] group-hover:scale-110 transition-transform">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#64748b] uppercase">Traceability</span>
                </div>
                <h3 className="text-base font-bold text-[#f1f5f9] group-hover:text-[#f59e0b] transition-colors mb-1">
                  Honey Batches & Ledger
                </h3>
                <p className="text-xs text-[#94a3b8] leading-normal mb-3">
                  Inspect batch consolidation, curing timelines, lab test attachments, packaging lots, and SHA-256 event chains.
                </p>
                <div className="text-xs text-[#8b5cf6] flex items-center gap-1 font-semibold">
                  <span>Batch Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Card 6: Smart Hive Foundation */}
              <Link href="/system" className="p-5 bg-[#11141d] border border-[#283144] hover:border-[#f59e0b] transition-all rounded-sm group">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded bg-[#181d28] text-[#10b981] group-hover:scale-110 transition-transform">
                    <Database className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#64748b] uppercase">Deep Tech</span>
                </div>
                <h3 className="text-base font-bold text-[#f1f5f9] group-hover:text-[#f59e0b] transition-colors mb-1">
                  IoT Engineering Console
                </h3>
                <p className="text-xs text-[#94a3b8] leading-normal mb-3">
                  Explore Beevil Knievel Smart Hive hardware: 16-sensor PCB schematics, ANSYS FEA/CFD multi-physics, and CMSIS-DSP FFT.
                </p>
                <div className="text-xs text-[#10b981] flex items-center gap-1 font-semibold">
                  <span>Technical Hardware</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* SIH 26021 REQUIREMENT ALIGNMENT MATRIX */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 font-mono text-xs">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-[#f59e0b] uppercase tracking-wider">Compliance Matrix</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#f1f5f9] uppercase mt-1">
                SIH Problem Statement 26021 Fulfillment
              </h2>
            </div>

            <div className="border border-[#283144] rounded-sm overflow-x-auto bg-[#11141d]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#283144] bg-[#181d28] text-[#ffc833]">
                    <th className="py-3 px-4 uppercase">Mandated Requirement</th>
                    <th className="py-3 px-4 uppercase">Honey Chain Implementation</th>
                    <th className="py-3 px-4 uppercase">Verification Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#283144] text-[#94a3b8]">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#f1f5f9]">Blockchain Traceability</td>
                    <td className="py-3 px-4">Permissioned SHA-256 chained event ledger from harvest to retail</td>
                    <td className="py-3 px-4 text-[#10b981]">`honeychain_ledger.py` / 100% Chain Verification</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#f1f5f9]">QR-Code Consumer Authentication</td>
                    <td className="py-3 px-4">Unique tokenized retail package codes (`HC-PKG-XXXXXXXX`)</td>
                    <td className="py-3 px-4 text-[#10b981]">Interactive `/verify` & `/v/[id]` portal</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#f1f5f9]">Counterfeit & Reuse Detection</td>
                    <td className="py-3 px-4">Velocity & IP geolocation anomaly detection on scan frequency</td>
                    <td className="py-3 px-4 text-[#10b981]">`HoneyChainQREngine.detect_scan_anomaly()`</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#f1f5f9]">IoT-Enabled Hive Monitoring</td>
                    <td className="py-3 px-4">16-sensor smart hive node (TMP117 array, load-cell, CO2, acoustics)</td>
                    <td className="py-3 px-4 text-[#10b981]">Sub-GHz LoRa star topology & 33-byte packet format</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#f1f5f9]">AI Disease & Health Analytics</td>
                    <td className="py-3 px-4">CMSIS-DSP FFT acoustic classification & Page-CUSUM thermal drift</td>
                    <td className="py-3 px-4 text-[#10b981]">Tested on CMSIS-DSP & gateway Random Forest</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#f1f5f9]">Productivity Prediction</td>
                    <td className="py-3 px-4">Continuous comb weight velocity & 7-day harvest yield forecasting</td>
                    <td className="py-3 px-4 text-[#10b981]">{"/api/v1/productivity/forecast/{id} API"}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#f1f5f9]">KVIC Rural Cluster Scalability</td>
                    <td className="py-3 px-4">Hierarchical cluster deployment: Org → Cluster → Beekeeper → Apiary → Hive</td>
                    <td className="py-3 px-4 text-[#10b981]">KVIC Command Center with 3 National Clusters</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#f1f5f9]">Market Linkages</td>
                    <td className="py-3 px-4">Verified direct marketplace connecting rural beekeepers to institutional buyers</td>
                    <td className="py-3 px-4 text-[#10b981]">`/market` Direct Order Portal</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
