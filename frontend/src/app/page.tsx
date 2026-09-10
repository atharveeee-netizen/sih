"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BeevilKnievelLogo from "@/components/BeevilKnievelLogo";
import { ShieldCheck, Sparkles, QrCode, ArrowRight, Layers, Award, Activity, CheckCircle2, ChevronRight } from "lucide-react";
import { DEMO_BATCHES } from "@/lib/constants";
import { useLanguage } from "@/lib/LanguageContext";
import LiveTelemetryStream from "@/components/LiveTelemetryStream";
import SupplyChainMapReplay from "@/components/SupplyChainMapReplay";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F9F8F6]">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="py-20 sm:py-28 px-6 md:px-12 lg:px-24 border-b-2 border-charcoal/10 relative overflow-hidden bg-[#F9F8F6]">
          {/* Subtle gold decorative gradient corner */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 blur-3xl pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-1.5 border border-charcoal/20 bg-white mb-6 shadow-xs max-w-full">
                <span className="h-2 w-2 bg-gold shrink-0" />
                <span className="text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-ultra text-charcoal font-bold leading-none truncate">
                  KVIC • National Bee Board • Beevil Knievel Platform
                </span>
              </div>
              <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl serif text-charcoal font-normal leading-[1.02] tracking-tight mb-8 break-words">
                {t("heroSubtitle1")} <br />
                <span className="italic text-gold">{t("heroSubtitle2")}</span> {t("heroSubtitle3")}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-warm-grey font-normal leading-relaxed mb-10 max-w-2xl">
                {t("heroDescription")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/verify"
                  className="h-14 px-8 text-sm sm:text-xs uppercase tracking-widest font-bold btn-gold-slide flex items-center justify-center gap-3 shadow-md w-full sm:w-auto"
                >
                  <QrCode className="w-5 sm:w-4 h-5 sm:h-4 text-gold" />
                  <span>{t("verifyJarBtn")}</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="h-14 px-8 text-sm sm:text-xs uppercase tracking-widest font-bold btn-outline-luxury flex items-center justify-center gap-3 shadow-xs w-full sm:w-auto"
                >
                  <span>{t("fieldLoginBtn")}</span>
                  <ArrowRight className="w-5 sm:w-4 h-5 sm:h-4" />
                </Link>
              </div>
            </div>

            {/* Brand Seal Emblem - Visible on all devices */}
            <div className="flex flex-col items-center justify-center shrink-0 mt-8 lg:mt-0 w-full lg:w-auto">
              <BeevilKnievelLogo size="md" variant="seal" className="sm:hidden" />
              <BeevilKnievelLogo size="lg" variant="seal" className="hidden sm:inline-flex lg:hidden" />
              <BeevilKnievelLogo size="xl" variant="seal" className="hidden lg:inline-flex" />
            </div>
          </div>
        </section>

        {/* 2. STATS BAR (Dark Obsidian) */}
        <section className="py-16 px-6 md:px-12 lg:px-24 bg-[#141414] text-alabaster border-b-2 border-charcoal">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6 px-3 py-2 border border-gold/40 bg-gold/10 w-fit">
              <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
              <span className="text-[11px] sm:text-xs uppercase tracking-ultra text-charcoal font-bold">
                Projected Target — {t("statsHeader")}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="border-t border-white/15 pt-6">
                <p className="text-[10px] uppercase tracking-widest text-warm-grey mb-1 font-semibold">{t("statsBeekeepers")}</p>
                <p className="text-4xl serif text-gold font-bold">14,240+ <span className="text-[9px] align-top uppercase tracking-wider text-amber-400 font-sans font-bold border border-amber-400/50 px-1 py-0.5 ml-1">Target</span></p>
                <p className="text-[10px] text-taupe/70 mt-1 font-mono">{t("statsBeekeepersSub")}</p>
              </div>
              <div className="border-t border-white/15 pt-6">
                <p className="text-[10px] uppercase tracking-widest text-warm-grey mb-1 font-semibold">{t("statsBatches")}</p>
                <p className="text-4xl serif text-alabaster font-bold">1.8M+ <span className="text-[9px] align-top uppercase tracking-wider text-amber-400 font-sans font-bold border border-amber-400/50 px-1 py-0.5 ml-1">Target</span></p>
                <p className="text-[10px] text-taupe/70 mt-1 font-mono">{t("statsBatchesSub")}</p>
              </div>
              <div className="border-t border-white/15 pt-6">
                <p className="text-[10px] uppercase tracking-widest text-warm-grey mb-1 font-semibold">{t("statsCompliance")}</p>
                <p className="text-4xl serif text-emerald-400 font-bold">99.4% <span className="text-[9px] align-top uppercase tracking-wider text-amber-400 font-sans font-bold border border-amber-400/50 px-1 py-0.5 ml-1">Target</span></p>
                <p className="text-[10px] text-taupe/70 mt-1 font-mono">{t("statsComplianceSub")}</p>
              </div>
              <div className="border-t border-white/15 pt-6">
                <p className="text-[10px] uppercase tracking-widest text-warm-grey mb-1 font-semibold">{t("statsScans")}</p>
                <p className="text-4xl serif text-gold font-bold">4.2M+ <span className="text-[9px] align-top uppercase tracking-wider text-amber-400 font-sans font-bold border border-amber-400/50 px-1 py-0.5 ml-1">Target</span></p>
                <p className="text-[10px] text-taupe/70 mt-1 font-mono">{t("statsScansSub")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. THREE CORE PILLARS -- removed from the homepage per explicit request.
            Translation strings (archTag/archTitle/pillar1-3 Title/Desc) left in
            src/lib/i18n.ts, untouched, in case this section is wanted back later. */}

        {/* 4. LIVE VERIFIED BATCHES PREVIEW */}
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-white border-b-2 border-charcoal/10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 pb-6 border-b border-charcoal/10">
              <div>
                <p className="text-[10px] uppercase tracking-ultra text-warm-grey mb-1 font-bold">{t("explorerTag")}</p>
                <h2 className="text-3xl md:text-4xl serif text-charcoal font-normal">{t("explorerTitle")}</h2>
              </div>
              <Link
                href="/verify"
                className="text-xs uppercase tracking-widest font-bold text-charcoal hover:text-gold transition-colors flex items-center gap-1.5"
              >
                <span>{t("searchAllBatches")}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {DEMO_BATCHES.map((batch) => (
                <div
                  key={batch.batchId}
                  className="p-8 border-2 border-charcoal/15 bg-[#F9F8F6] hover:border-gold transition-all duration-400 flex flex-col justify-between shadow-xs hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-warm-grey font-bold block mb-1">
                        Batch #00{batch.batchId}
                      </span>
                      <h4 className="text-2xl serif text-charcoal font-bold">{batch.farmer.name}</h4>
                      <p className="text-xs text-warm-grey">{batch.farmer.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-widest text-warm-grey block">{t("batchPurity")}</span>
                      <span className="text-2xl font-serif font-bold text-gold">{batch.batch.qualityScore}/100</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-charcoal/10 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-charcoal font-bold">{batch.qrToken}</span>
                    <Link
                      href={`/verify/${batch.batchId}`}
                      className="text-xs uppercase tracking-widest font-bold text-charcoal hover:text-gold transition-colors flex items-center gap-1"
                    >
                      <span>{t("verifyJarLink")}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. LIVE SUPPLY CHAIN & IOT TELEMETRY SUITE */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24 bg-[#F9F8F6] border-b-2 border-charcoal/10">
          <div className="max-w-6xl mx-auto space-y-12">
            <div>
              <p className="text-[10px] uppercase tracking-ultra text-warm-grey mb-1 font-bold">Autonomous Provenance Infrastructure</p>
              <h2 className="text-3xl md:text-4xl serif text-charcoal font-normal">Live IoT Telemetry & Supply Chain Ledger</h2>
            </div>
            <LiveTelemetryStream />
            <SupplyChainMapReplay />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
