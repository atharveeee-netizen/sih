"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QrCode, ArrowRight, ChevronRight } from "lucide-react";
import { DEMO_BATCHES, POLYGON_AMOY_RPC } from "@/lib/constants";
import { useLanguage } from "@/lib/LanguageContext";
import LiveTelemetryStream from "@/components/LiveTelemetryStream";
import SupplyChainMapReplay from "@/components/SupplyChainMapReplay";

const isLocalChain =
  POLYGON_AMOY_RPC.includes("127.0.0.1") || POLYGON_AMOY_RPC.includes("localhost");

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-ground">
      <Navbar />

      <main className="flex-1">
        {/* ── 1. Service header ──────────────────────────────────────────────
            Was a full-bleed hero: an 8xl italic display headline beside a
            bracketed brand seal, lit by a blurred gold gradient. All three are
            signatures of the editorial template look. This states what the
            service is and who runs it, and gets out of the way. */}
        <section className="bg-paper border-b border-rule">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-14 grid lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-start">
            <div className="max-w-3xl">
              <p className="field-label mb-3">
                KVIC &middot; National Bee Board &middot; Public Verification Service
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5">
                {t("heroSubtitle1")}{" "}
                <span className="border-b-4 border-amber pb-0.5">{t("heroSubtitle2")}</span>{" "}
                {t("heroSubtitle3")}
              </h1>

              <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-8 max-w-2xl">
                {t("heroDescription")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/verify"
                  className="h-11 px-6 text-xs uppercase tracking-wider btn-gold-slide justify-center gap-2.5 w-full sm:w-auto"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{t("verifyJarBtn")}</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="h-11 px-6 text-xs uppercase tracking-wider btn-outline-luxury justify-center gap-2.5 w-full sm:w-auto"
                >
                  <span>{t("fieldLoginBtn")}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Replaces the decorative seal with the same information a public
                service notice would actually carry. */}
            <aside className="gov-panel w-full lg:w-80 shrink-0">
              <div className="gov-panel-head">Service Record</div>
              <dl className="divide-y divide-rule-faint">
                {[
                  ["Problem Statement", "SIH 26021"],
                  ["Nodal Ministry", "MSME"],
                  ["Implementing Body", "KVIC Honey Mission"],
                  ["Ledger", isLocalChain ? "Local chain (offline demo)" : "Polygon PoS"],
                ].map(([k, v]) => (
                  <div key={k} className="px-4 py-2.5">
                    <dt className="field-label">{k}</dt>
                    <dd className="text-sm font-medium mt-0.5">{v}</dd>
                  </div>
                ))}
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <dt className="field-label">Status</dt>
                  <dd>
                    <span className="chip chip-verified">Operational</span>
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        {/* ── 2. Programme targets ───────────────────────────────────────────
            These are projected targets, not achieved figures. The previous
            design set them in large gold display numerals, which read as
            accomplishments; the "Target" qualifier is kept and given equal
            weight rather than shrunk into a superscript. */}
        <section className="bg-navy text-white border-b border-navy-deep">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-10">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-white/70 mb-5">
              Projected programme targets &mdash; {t("statsHeader")}
              <span className="ml-2 border border-amber/60 text-amber px-1.5 py-0.5 text-[10px]">
                Not yet achieved
              </span>
            </p>

            <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/15 border border-white/15">
              {[
                [t("statsBeekeepers"), "14,240+", t("statsBeekeepersSub")],
                [t("statsBatches"), "1.8M+", t("statsBatchesSub")],
                [t("statsCompliance"), "99.4%", t("statsComplianceSub")],
                [t("statsScans"), "4.2M+", t("statsScansSub")],
              ].map(([label, value, sub]) => (
                <div key={label} className="bg-navy px-4 py-4">
                  <dt className="text-[10px] uppercase tracking-wider text-white/60 font-semibold mb-1.5">
                    {label}
                  </dt>
                  <dd className="text-2xl sm:text-3xl font-bold tabular tracking-tight">{value}</dd>
                  <p className="text-[10px] font-mono text-white/50 mt-1.5">{sub}</p>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── 3. Batch register ──────────────────────────────────────────── */}
        <section className="bg-paper border-b border-rule">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-14">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 section-title">
              <div>
                <p className="field-label mb-1">{t("explorerTag")}</p>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{t("explorerTitle")}</h2>
              </div>
              <Link
                href="/verify"
                className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1"
              >
                <span>{t("searchAllBatches")}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* A register reads better as rows than as marketing cards. */}
            <div className="overflow-x-auto border border-rule">
              <table className="data-table">
                <thead>
                  <tr>
                    <th scope="col">Batch</th>
                    <th scope="col">Beekeeper</th>
                    <th scope="col" className="hidden sm:table-cell">Origin</th>
                    <th scope="col">{t("batchPurity")}</th>
                    <th scope="col" className="hidden md:table-cell">QR Token</th>
                    <th scope="col"><span className="sr-only">Action</span></th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_BATCHES.map((batch) => (
                    <tr key={batch.batchId}>
                      <td className="font-mono whitespace-nowrap">
                        #{String(batch.batchId).padStart(4, "0")}
                      </td>
                      <td className="font-semibold">{batch.farmer.name}</td>
                      <td className="hidden sm:table-cell text-text-secondary">
                        {batch.farmer.location}
                      </td>
                      <td className="tabular font-semibold whitespace-nowrap">
                        {batch.batch.qualityScore}/100
                      </td>
                      <td className="hidden md:table-cell font-mono text-text-secondary">
                        {batch.qrToken}
                      </td>
                      <td className="text-right whitespace-nowrap">
                        <Link
                          href={`/verify/${batch.batchId}`}
                          className="text-xs uppercase tracking-wider font-semibold"
                        >
                          {t("verifyJarLink")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── 4. Live telemetry and custody ──────────────────────────────── */}
        <section className="bg-ground border-b border-rule">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-14 space-y-8">
            <div className="section-title">
              <p className="field-label mb-1">Autonomous Provenance Infrastructure</p>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Live IoT Telemetry &amp; Supply Chain Ledger
              </h2>
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
