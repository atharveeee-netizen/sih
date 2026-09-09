"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Search,
  Sparkles,
  ArrowRight,
  HelpCircle
} from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/v/${code.trim()}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-[#f1f5f9] font-sans selection:bg-[#f59e0b] selection:text-[#090b10]">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#181d28] border border-[#283144] text-xs font-mono text-[#f59e0b]">
              <Lock className="w-3.5 h-3.5" />
              <span>Government-Certified Honey Authenticity Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase font-mono tracking-tight text-[#f1f5f9]">
              CONSUMER VERIFICATION PORTAL
            </h1>
            <p className="text-sm text-[#94a3b8] max-w-xl mx-auto">
              Scan or enter the unique package identification code printed on your KVIC Honey Jar to verify complete origin provenance and cryptographic lab certification.
            </p>
          </div>

          {/* Verification Card */}
          <div className="p-6 bg-[#11141d] border border-[#3d4964] rounded-lg shadow-2xl font-mono">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="token-code" className="block text-xs uppercase font-bold text-[#94a3b8] mb-2 tracking-wider">
                  Enter Package Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748b]">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <input
                    id="token-code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="HC-PKG-A7F93E12"
                    className="w-full pl-11 pr-4 py-3 bg-[#090b10] border border-[#283144] rounded text-base text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#f59e0b] font-mono tracking-wider uppercase"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!code.trim()}
                className="w-full py-3 bg-[#f59e0b] hover:bg-[#d97706] disabled:opacity-50 disabled:cursor-not-allowed text-[#090b10] font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Package Authenticity</span>
              </button>
            </form>

            {/* Quick Demo Previews */}
            <div className="mt-6 pt-6 border-t border-[#283144] space-y-3">
              <div className="text-xs text-[#94a3b8] font-bold uppercase tracking-wider">
                Demonstration Verification Tokens:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/v/HC-PKG-A7F93E12")}
                  className="p-3 bg-[#181d28] hover:bg-[#1f2637] border border-[#10b981]/40 rounded text-left transition-all group"
                >
                  <div className="flex items-center gap-2 text-[#10b981] font-bold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Authentic Jar</span>
                  </div>
                  <div className="text-[11px] text-[#f1f5f9] font-mono">HC-PKG-A7F93E12</div>
                  <div className="text-[10px] text-[#94a3b8] mt-1">
                    Nilgiris Multiflora • Pure authentic • 1st scan
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/v/HC-PKG-B8C24D91")}
                  className="p-3 bg-[#181d28] hover:bg-[#1f2637] border border-[#ef4444]/40 rounded text-left transition-all group"
                >
                  <div className="flex items-center gap-2 text-[#ef4444] font-bold text-xs mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Suspicious Copied Label</span>
                  </div>
                  <div className="text-[11px] text-[#f1f5f9] font-mono">HC-PKG-B8C24D91</div>
                  <div className="text-[10px] text-[#94a3b8] mt-1">
                    Multi-city velocity anomaly flagged
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Educational Trust Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs text-[#94a3b8]">
            <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
              <div className="text-[#f59e0b] font-bold uppercase mb-1">1. Anti-Reuse Detection</div>
              <p className="text-[11px] leading-relaxed">
                Tokens scanned from physically impossible velocity (e.g. Mumbai then Delhi in 5 mins) automatically trigger reuse alerts.
              </p>
            </div>

            <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
              <div className="text-[#f59e0b] font-bold uppercase mb-1">2. Direct Lab Sync</div>
              <p className="text-[11px] leading-relaxed">
                Moisture, HMF, and adulteration test results are signed directly by accredited KVIC testing laboratories.
              </p>
            </div>

            <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
              <div className="text-[#f59e0b] font-bold uppercase mb-1">3. Privacy Preserving</div>
              <p className="text-[11px] leading-relaxed">
                Consumer sees genuine origin, cooperative cluster, and floral source while protecting rural farmer personal identity.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
