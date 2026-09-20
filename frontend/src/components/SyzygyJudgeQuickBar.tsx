"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FlaskConical,
  Radio,
  Sparkles,
  QrCode,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Cpu,
  Lock,
} from "lucide-react";

export default function SyzygyJudgeQuickBar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside aria-label="Syzygy SIH Evaluator Quick-Bar" className="sticky top-0 z-50 w-full bg-[#090D16] text-[#F8FAFC] border-b border-[#D4AF37]/30 shadow-xl backdrop-blur-md">
      {/* Top micro-bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-mono font-bold tracking-wider">
            <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: "6s" }} />
            SYZYGY SIH 26021 HARNESS
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[#94A3B8] text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <strong className="text-white">Team Beevil Knievel</strong> (Lead: Atharve Dahima) &bull; Govt. of India / KVIC HoneyChain
          </span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/verify/1"
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-[#D4AF37] hover:text-[#090D16] transition-all text-[11px] font-bold font-mono tracking-wide flex items-center gap-1 border border-white/10"
          >
            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
            <span>Batch #1 (Litchi)</span>
          </Link>
          <Link
            href="/dashboard/quality"
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-emerald-500 hover:text-white transition-all text-[11px] font-bold font-mono tracking-wide flex items-center gap-1 border border-white/10 hidden sm:inline-flex"
          >
            <FlaskConical className="w-3 h-3 text-emerald-400" />
            <span>FSSAI Lab</span>
          </Link>
          <Link
            href="/dashboard/login"
            className="px-2.5 py-1 rounded bg-[#D4AF37] text-[#090D16] hover:bg-[#F3E5AB] transition-all text-[11px] font-bold font-mono tracking-wide flex items-center gap-1"
          >
            <Lock className="w-3 h-3" />
            <span>1-Click Jury Login</span>
          </Link>
          <button
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse full jury guide" : "Expand full jury guide"}
            className="p-1 rounded bg-white/10 hover:bg-white/20 text-[#94A3B8] hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Evaluator Deck */}
      {expanded && (
        <div className="border-t border-white/10 bg-[#0F172A]/95 px-4 sm:px-8 py-5 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {/* Pillar 1: Verified Batch Provenance */}
            <div className="p-3.5 rounded-lg bg-[#090D16]/60 border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold uppercase tracking-wider text-[10px]">
                <QrCode className="w-3.5 h-3.5" />
                <span>On-Chain Provenance</span>
              </div>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                Inspect live cryptographic batches with 400 MHz NMR curves and Polygon PoS mint hashes:
              </p>
              <div className="flex flex-col gap-1.5 pt-1">
                <Link
                  href="/verify/1"
                  className="text-white hover:text-[#D4AF37] transition-colors flex items-center justify-between font-mono text-[11px] p-1.5 rounded bg-white/5"
                >
                  <span>Muzaffarpur Litchi (Score 94)</span>
                  <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                </Link>
                <Link
                  href="/verify/2"
                  className="text-white hover:text-[#D4AF37] transition-colors flex items-center justify-between font-mono text-[11px] p-1.5 rounded bg-white/5"
                >
                  <span>Sundarbans Mangrove (Score 91)</span>
                  <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                </Link>
              </div>
            </div>

            {/* Pillar 2: FSSAI Physics & AI Engine */}
            <div className="p-3.5 rounded-lg bg-[#090D16]/60 border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Adulteration Defense</span>
              </div>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                Test adulteration against FSSAI IS 4941 parameters (Moisture, HMF, Diastase, C13 Isotope, SMR):
              </p>
              <div className="pt-1">
                <Link
                  href="/dashboard/quality"
                  className="text-white hover:text-emerald-400 transition-colors flex items-center justify-between font-mono text-[11px] p-2 rounded bg-white/5 border border-white/5"
                >
                  <span>Launch FSSAI IS 4941 Lab</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </Link>
              </div>
            </div>

            {/* Pillar 3: IoT & TinyML Telemetry */}
            <div className="p-3.5 rounded-lg bg-[#090D16]/60 border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold uppercase tracking-wider text-[10px]">
                <Cpu className="w-3.5 h-3.5" />
                <span>KVIC Gateway Fleet</span>
              </div>
              <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                Field hardware gateways running RS-485 Modbus telemetry with SHA-256 micro-block chains:
              </p>
              <div className="pt-1">
                <Link
                  href="/dashboard#fleet"
                  className="text-white hover:text-sky-400 transition-colors flex items-center justify-between font-mono text-[11px] p-2 rounded bg-white/5 border border-white/5"
                >
                  <span>KVIC Edge Gateway Fleet (3 Online)</span>
                  <ExternalLink className="w-3 h-3 text-sky-400" />
                </Link>
              </div>
            </div>

            {/* Pillar 4: Ecosystem Tools */}
            <div className="p-3.5 rounded-lg bg-[#090D16]/60 border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold uppercase tracking-wider text-[10px]">
                <Layers className="w-3.5 h-3.5" />
                <span>Advanced Ecosystem</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Link
                  href="/dashboard/migration"
                  className="text-[#F8FAFC] hover:text-[#D4AF37] p-1.5 rounded bg-white/5 font-mono text-[10px] block truncate"
                >
                  🗺️ Bloom Map
                </Link>
                <Link
                  href="/dashboard/credits"
                  className="text-[#F8FAFC] hover:text-[#D4AF37] p-1.5 rounded bg-white/5 font-mono text-[10px] block truncate"
                >
                  🌿 Carbon Credits
                </Link>
                <Link
                  href="/dashboard/pollen"
                  className="text-[#F8FAFC] hover:text-[#D4AF37] p-1.5 rounded bg-white/5 font-mono text-[10px] block truncate"
                >
                  🔬 Pollen AI
                </Link>
                <Link
                  href="/dashboard/qr"
                  className="text-[#F8FAFC] hover:text-[#D4AF37] p-1.5 rounded bg-white/5 font-mono text-[10px] block truncate"
                >
                  🏷️ 35mm Seals
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
