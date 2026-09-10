"use client";

import { useState } from "react";
import Link from "next/link";
import BeevilKnievelLogo from "@/components/BeevilKnievelLogo";
import { useLanguage } from "@/lib/LanguageContext";
import { POLYGON_AMOY_RPC } from "@/lib/constants";
import { QrCode, LayoutDashboard, Menu, X, PlusCircle, Globe } from "lucide-react";

const isLocalChain = POLYGON_AMOY_RPC.includes("127.0.0.1") || POLYGON_AMOY_RPC.includes("localhost");

/**
 * Primary navigation.
 *
 * Civic redesign: a solid navy bar rather than a translucent, blurred cream
 * header. The old version floated over the page and used a rounded status
 * pill; both read as consumer-product chrome. This one is opaque, square and
 * anchored, and the service links sit in a fixed row like a portal toolbar.
 */
export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हिंदी" },
    { code: "bn", label: "বাংলা" },
    { code: "ta", label: "தமிழ்" },
    { code: "kn", label: "ಕನ್ನಡ" },
  ] as const;

  return (
    <header className="bg-navy text-white sticky top-0 z-50 border-b border-navy-deep">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-12 flex justify-between items-center h-14 sm:h-16 gap-2 sm:gap-4">
        {/* Brand */}
        <Link href="/" className="group flex items-center shrink-0">
          <BeevilKnievelLogo size="sm" variant="full" theme="dark" className="sm:hidden" />
          <BeevilKnievelLogo size="md" variant="full" theme="dark" className="hidden sm:flex" />
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Chain status: a labelled readout, not a floating pill */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 h-8 border border-white/25 text-[10px] uppercase tracking-wider font-semibold">
            <span className="w-1.5 h-1.5 bg-amber rounded-full shrink-0" aria-hidden="true" />
            <span>{isLocalChain ? "Local Chain · Live" : t("liveStatus")}</span>
          </div>

          {/* Desktop language switcher */}
          <div className="hidden md:flex items-center h-8 border border-white/25 text-[10px] font-semibold">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-2 h-full transition-colors ${
                  lang === l.code
                    ? "bg-amber text-navy-deep"
                    : "text-white/85 hover:bg-white/10"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Compact language selector */}
          <div className="md:hidden flex items-center h-8 border border-white/25 px-1.5 shrink-0">
            <Globe className="w-3 h-3 text-amber mr-1 shrink-0" />
            <label htmlFor="navbar-mobile-lang" className="sr-only">
              Language Selector
            </label>
            <select
              id="navbar-mobile-lang"
              name="language"
              aria-label="Language Selector"
              value={lang}
              onChange={(e) => setLang(e.target.value as typeof lang)}
              className="bg-transparent text-[10px] font-semibold text-white focus:outline-none cursor-pointer [&>option]:text-navy-ink"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/verify"
            title={t("verifyNav")}
            className="flex items-center gap-1.5 px-2 sm:px-3 h-8 border border-white/25 hover:bg-white/10 text-[10px] uppercase tracking-wider font-semibold shrink-0 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-amber shrink-0" />
            <span className="hidden sm:inline">{t("verifyNav")}</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-2.5 sm:px-4 h-8 bg-amber text-navy-deep hover:bg-amber-light text-[10px] uppercase tracking-wider font-bold shrink-0 transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">KVIC Portal</span>
            <span className="sm:hidden">Portal</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center w-8 h-8 border border-white/25 hover:bg-white/10 transition-colors md:hidden shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-paper text-text-primary border-t-2 border-amber px-4 py-4 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-rule">
            <span className="field-label">Navigation</span>
            <span className="chip chip-verified font-mono">
              {isLocalChain ? "Local Chain" : "Polygon PoS"}
            </span>
          </div>

          {[
            { href: "/verify", icon: QrCode, label: "Verify Honey Batch QR" },
            { href: "/dashboard", icon: LayoutDashboard, label: "KVIC Operations Dashboard" },
            { href: "/dashboard/register", icon: PlusCircle, label: "Register Beekeeper (GPS)" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 border border-rule bg-paper hover:bg-paper-alt flex items-center justify-between text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              <span className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-gov-blue" />
                {label}
              </span>
              <span aria-hidden="true" className="text-gov-blue">
                &rarr;
              </span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
