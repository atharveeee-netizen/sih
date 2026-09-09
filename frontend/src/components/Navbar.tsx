"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Cpu, 
  QrCode, 
  Menu, 
  X, 
  Layers,
  Database,
  Building2,
  Boxes,
  ShoppingBag,
  Factory,
  CheckCircle2
} from "lucide-react";
import { DemoModeBanner } from "@/components/ui/DemoModeBanner";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // The 9 Canonical SIH 26021 HoneyChain Roles & Surfaces
  const NAV_LINKS = [
    { href: "/", label: "Home", icon: Layers },
    { href: "/verify", label: "Verify", icon: QrCode, badge: "Consumer" },
    { href: "/beekeeper", label: "Beekeeper", icon: LayoutDashboard },
    { href: "/hives", label: "Hives", icon: Cpu, badge: "IoT" },
    { href: "/batches", label: "Batches", icon: Boxes },
    { href: "/processor", label: "Processor", icon: Factory },
    { href: "/kvic", label: "KVIC", icon: Building2, badge: "Gov" },
    { href: "/market", label: "Market", icon: ShoppingBag },
    { href: "/system", label: "System", icon: Database, badge: "Edge" },
  ];

  return (
    <>
      <DemoModeBanner />
      <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-700 font-mono text-xs text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          
          {/* Brand & System Identity */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 text-white hover:text-amber-400 transition-colors">
              <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-sm">
                HC
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wider uppercase leading-none">HONEY CHAIN</span>
                <span className="text-[9px] text-slate-400 tracking-tight">SIH 2026 • PS 26021 • KVIC Honey Mission</span>
              </div>
            </Link>
            <div className="hidden xl:flex items-center gap-1.5 border-l border-slate-700 pl-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">LEDGER VERIFIED</span>
            </div>
          </div>

          {/* Desktop Navigation Tabs (9 Primary Routes) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1 border border-slate-700 rounded-sm overflow-x-auto max-w-2xl">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 px-2 py-1 rounded-xs transition-all font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap ${
                    isActive
                      ? "bg-slate-700 text-amber-300 shadow-sm border border-slate-600"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <Icon className="w-3 h-3 flex-shrink-0" />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[8px] px-1 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/verify"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider transition-colors shadow-sm text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify QR</span>
            </Link>
            <a
              href="https://github.com/atharveeee-netizen/sih"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xs text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
              title="GitHub Repository"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/verify"
              className="px-2.5 py-1 rounded-xs bg-amber-500 text-slate-950 font-bold text-[11px] uppercase tracking-wider"
            >
              Verify
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xs bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700 bg-slate-900/98 p-4 font-mono space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-2 rounded text-xs uppercase tracking-wider ${
                    isActive ? "bg-slate-800 text-amber-300 font-bold" : "text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
}
