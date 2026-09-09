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
  MapPin,
  TrendingUp,
  Activity,
  Factory,
  FlaskConical,
  Lock,
  Eye,
  Info
} from "lucide-react";
import { getKvicStats } from "@/lib/api";

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
    getKvicStats()
      .then((res) => {
        if (res.data) setStats(res.data as any);
      })
      .catch(() => {});
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = packageCode.trim() || "HC-PKG-A7F93E12";
    router.push(`/v/${code}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-mono text-amber-900 font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Smart India Hackathon 2026 • Problem Statement ID 26021</span>
              <span className="text-amber-400">•</span>
              <span className="text-amber-800">Ministry of MSME — KVIC Honey Mission</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 uppercase font-mono leading-tight">
              HONEY <span className="text-amber-600">CHAIN</span>
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
              An integrated <strong className="text-slate-900 font-semibold">Permissioned Cryptographic Ledger</strong>, 
              <strong className="text-slate-900 font-semibold"> Smart Hive IoT Telemetry Node</strong>, and 
              <strong className="text-slate-900 font-semibold"> Anti-Counterfeit QR Engine</strong> for verified honey traceability and apiculture governance across national KVIC clusters.
            </p>

            {/* INSTANT CONSUMER QR TRACKER */}
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-slate-900 border border-slate-800 rounded-xl shadow-xl font-mono text-left text-slate-100">
              <label htmlFor="package-input" className="block text-xs uppercase tracking-wider text-amber-400 mb-2 font-bold">
                Consumer Verification: Instant Package Provenance Check
              </label>
              <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <input
                    id="package-input"
                    type="text"
                    value={packageCode}
                    onChange={(e) => setPackageCode(e.target.value)}
                    placeholder="Enter Package Code (e.g. HC-PKG-A7F93E12)"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-md text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify</span>
                </button>
              </form>

              {/* Demo Test Chips */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 text-[11px] font-medium">Demonstration Jars:</span>
                <button
                  type="button"
                  onClick={() => router.push("/v/HC-PKG-A7F93E12")}
                  className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 rounded text-[11px] flex items-center gap-1.5 transition-colors font-medium"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Authentic Jar (HC-PKG-A7F93E12)</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/v/HC-PKG-B8C24D91")}
                  className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 border border-red-600/60 text-red-300 rounded text-[11px] flex items-center gap-1.5 transition-colors font-medium"
                >
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  <span>Flagged Reuse Anomaly (HC-PKG-B8C24D91)</span>
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* KVIC MACRO IMPACT METRICS */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-slate-100 border-b border-slate-200 font-mono">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-700">National Beekeeping Aggregates</h2>
                <p className="text-[11px] text-slate-500 font-sans">Operational telemetry & batch audits across regional KVIC clusters</p>
              </div>
              <Link href="/kvic" className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1">
                <span>View Full KVIC Console</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                  <span>ACTIVE CLUSTERS</span>
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stats.clusters_active}</div>
                <div className="text-[10px] text-slate-500 mt-1">Nilgiris, Gir, Kashmir</div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                  <span>MONITORED HIVES</span>
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stats.total_monitored_hives}</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">{stats.healthy_colonies} Healthy • {stats.at_risk_colonies} Risk Flagged</div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                  <span>HONEY HARVESTED</span>
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{stats.total_harvested_honey_kg} kg</div>
                <div className="text-[10px] text-slate-500 mt-1">{stats.total_honey_batches} Verified Batches</div>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px] mb-1">
                  <span>LEDGER INTEGRITY</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-700">{stats.traceability_compliance_pct}%</div>
                <div className="text-[10px] text-slate-500 mt-1">SHA-256 Intact Chain</div>
              </div>
            </div>
          </div>
        </section>

        {/* CONSUMER / USER JOURNEY SECTION */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">Consumer Trust Framework</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono mt-1 uppercase">
                What Happens When You Scan A Jar?
              </h2>
              <p className="text-sm text-slate-600 mt-2 font-sans">
                Every retail jar carries a unique cryptographic QR token linked to five verifiable checkpoints in the HoneyChain ledger.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-mono text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-amber-700 font-bold mb-1">STEP 01</div>
                  <div className="font-bold text-slate-900 text-sm mb-1">WHAT IS IT?</div>
                  <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                    Floral source, jar size, batch code, and packaging date authenticated against official records.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                  Identity Token
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-amber-700 font-bold mb-1">STEP 02</div>
                  <div className="font-bold text-slate-900 text-sm mb-1">WHERE FROM?</div>
                  <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                    Regional KVIC cluster, registered tribal beekeeper, apiary name, and GPS coordinates.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                  Apiary Provenance
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-amber-700 font-bold mb-1">STEP 03</div>
                  <div className="font-bold text-slate-900 text-sm mb-1">WAS IT TESTED?</div>
                  <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                    Accredited QA laboratory certificate hash: Moisture, HMF, Diastase, and C4/C3 sugar adulteration screen.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                  FSSAI & KVIC QA
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-amber-700 font-bold mb-1">STEP 04</div>
                  <div className="font-bold text-slate-900 text-sm mb-1">PROCESSING?</div>
                  <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                    Co-operative processing event: gentle micro-filtration temperature (≤40°C) and settling duration.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                  Chain of Custody
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-amber-700 font-bold mb-1">STEP 05</div>
                  <div className="font-bold text-slate-900 text-sm mb-1">CAN I TRUST IT?</div>
                  <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                    SHA-256 hash-chain verification from genesis block, plus scan velocity anomaly detection against label cloning.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                  Cryptographic Ledger
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CANONICAL VISUAL ARCHITECTURE FIGURE */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-slate-50">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">System Specification</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono mt-1 uppercase">
                End-to-End Cyber-Physical Topology
              </h2>
              <p className="text-sm text-slate-600 mt-1 font-sans">
                Six-tier architecture linking physical smart hive nodes over rural Sub-GHz LoRa to edge gateways, cloud ledgers, and consumer verify endpoints.
              </p>
            </div>

            <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
              <img 
                src="/figures/fig02_end_to_end_architecture.svg" 
                alt="HoneyChain End-to-End Architecture" 
                className="w-full h-auto rounded border border-slate-100"
              />
              <div className="mt-3 text-[11px] font-mono text-slate-500 text-center">
                FIG 02: Canonical HoneyChain End-to-End Cyber-Physical Architecture (SIH 2026 Problem Statement 26021)
              </div>
            </div>
          </div>
        </section>

        {/* ROLE PORTALS MATRIX */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">System Access</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono mt-1 uppercase">
                Role-Oriented Operational Portals
              </h2>
              <p className="text-sm text-slate-600 mt-1 font-sans">
                Each actor in the honey value chain accesses dedicated interfaces tailored to their responsibilities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              {/* Consumer Portal */}
              <Link href="/verify" className="p-5 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-amber-100 text-amber-800 rounded-md w-fit mb-3">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-700 transition-colors">Consumer Portal</h3>
                  <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                    Instant retail package verification, lab certificate viewing, and tamper-evident seal audit.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                  <span>Verify Jar</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Beekeeper Dashboard */}
              <Link href="/beekeeper" className="p-5 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-blue-100 text-blue-800 rounded-md w-fit mb-3">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-700 transition-colors">Beekeeper App</h3>
                  <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                    Colony health telemetry, comb weight dynamics, harvest recording, and apiary box management.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                  <span>My Apiaries</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Hives IoT Fleet */}
              <Link href="/hives" className="p-5 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-md w-fit mb-3">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-700 transition-colors">Smart Hives Fleet</h3>
                  <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                    Multi-sensor telemetry matrix, 5-frame thermal gradient, load-cell kinetics, and anomaly flags.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                  <span>Hive Telemetry</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Co-op Processor & QA */}
              <Link href="/processor" className="p-5 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-indigo-100 text-indigo-800 rounded-md w-fit mb-3">
                    <Factory className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-700 transition-colors">Processor & Lab</h3>
                  <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                    Attach lab test certificates, log micro-filtration settling runs, and issue serialized QR tokens.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                  <span>Process Batches</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Traceability Batches */}
              <Link href="/batches" className="p-5 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-purple-100 text-purple-800 rounded-md w-fit mb-3">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-700 transition-colors">Batches & Ledger</h3>
                  <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                    Explore SHA-256 block chains, verify hash continuity, and test real-time tamper injection.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                  <span>Inspect Ledger</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* KVIC Command Center */}
              <Link href="/kvic" className="p-5 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-amber-100 text-amber-800 rounded-md w-fit mb-3">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-700 transition-colors">KVIC Command</h3>
                  <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                    National Honey Mission oversight, cluster performance, counterfeit alarms, and compliance.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                  <span>Command Center</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Verified Marketplace */}
              <Link href="/market" className="p-5 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-rose-100 text-rose-800 rounded-md w-fit mb-3">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-700 transition-colors">Fair Trade Market</h3>
                  <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                    B2B market linkages connecting verified tribal beekeeper batches with Khadi India emporiums.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                  <span>Trade Orders</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* IoT System Diagnostics */}
              <Link href="/system" className="p-5 bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-lg transition-all group flex flex-col justify-between">
                <div>
                  <div className="p-2.5 bg-slate-200 text-slate-800 rounded-md w-fit mb-3">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-amber-700 transition-colors">IoT Diagnostics</h3>
                  <p className="text-slate-600 font-sans text-[11px] leading-relaxed">
                    Technical console: 40-byte binary telemetry decoding, LoRa packet CRC-16 checks, and gateway stats.
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-amber-700 font-bold text-[11px]">
                  <span>System Diagnostics</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* TRUST BOUNDARY & CLAIM-EVIDENCE FIREWALL */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-100 border-b border-slate-200 font-mono">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">SIH 2026 Defence Runbook</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 uppercase">
                Claim-Evidence Firewall & Trust Boundary
              </h2>
              <p className="text-sm text-slate-600 mt-1 font-sans">
                Honey Chain provides cryptographic guarantees on recorded events without making scientifically ungrounded claims.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-5 bg-white border border-emerald-300 rounded-xl shadow-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-mono font-bold uppercase mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>What Honey Chain Mathematically Proves</span>
                </div>
                <ul className="space-y-2 text-slate-700 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600 mt-0.5">•</span>
                    <span><strong>Cryptographic Provenance:</strong> Unbroken SHA-256 event hash-chain from hive harvest to retail QR.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600 mt-0.5">•</span>
                    <span><strong>Registered Package Identity:</strong> Every retail jar has an authorized token generated during batch packaging.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600 mt-0.5">•</span>
                    <span><strong>Laboratory Hash Linkage:</strong> Lab certificates are digitally hashed and immutably bound to the batch record.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600 mt-0.5">•</span>
                    <span><strong>Label Clone & Reuse Anomaly:</strong> Real-time scan velocity tracking flags copied labels across multiple queries.</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 bg-white border border-amber-300 rounded-xl shadow-xs">
                <div className="flex items-center gap-2 text-amber-900 font-mono font-bold uppercase mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Physical Boundaries & Defensive Scope</span>
                </div>
                <ul className="space-y-2 text-slate-700 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span><strong>Physical Seal Dependency:</strong> The QR proves recorded origin; liquid authenticity requires an intact physical tamper seal.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span><strong>Laboratory Testing Input:</strong> The system verifies that a signed certificate was filed, not that the testing lab was incorruptible.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span><strong>AI Anomaly Diagnostics:</strong> Edge DSP provides colony health risk classification, not clinical pathology diagnosis.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-amber-600 mt-0.5">•</span>
                    <span><strong>Sub-GHz LoRa Range:</strong> Rural telemetry is designed for 865-867 MHz LoRa; actual range depends on terrain and line-of-sight.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <img 
                src="/figures/fig12_trust_boundary.svg" 
                alt="Honey Chain Trust Boundary Architecture" 
                className="w-full h-auto rounded border border-slate-100"
              />
              <div className="mt-2 text-[11px] font-mono text-slate-500 text-center">
                FIG 12: Honey Chain Cryptographic Trust Boundary & Claim-Evidence Firewall
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
