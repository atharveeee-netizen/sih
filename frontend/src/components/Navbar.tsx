"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Cpu, 
  QrCode, 
  Sparkles, 
  Menu, 
  X, 
  Layers,
  Database,
  Building2,
  Boxes,
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import { StatusDot } from "@/components/ui/StatusDot";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NAV_LINKS = [
    { href: "/", label: "Overview", icon: Layers },
    { href: "/verify", label: "Verify QR", icon: QrCode, badge: "Consumer" },
    { href: "/kvic", label: "KVIC Admin", icon: Building2, badge: "Gov" },
    { href: "/beekeeper", label: "Beekeeper", icon: LayoutDashboard },
    { href: "/hives", label: "Hives IoT", icon: Cpu },
    { href: "/batches", label: "Batches", icon: Boxes },
    { href: "/market", label: "Market", icon: ShoppingBag },
    { href: "/system", label: "IoT Diagnostics", icon: Database, badge: "Edge" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090b10]/95 backdrop-blur-md border-b border-[#283144] font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        
        {/* Brand & System Node Status */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 text-[#f1f5f9] hover:text-[#ffc833] transition-colors">
            <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center text-[#090b10] font-black text-sm shadow-sm">
              HC
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wider uppercase leading-none">HONEY CHAIN</span>
              <span className="text-[9px] text-[#94a3b8] tracking-tight">SIH 26021 • KVIC Honey Mission</span>
            </div>
          </Link>
          <div className="hidden xl:flex items-center gap-2 border-l border-[#283144] pl-3">
            <StatusDot status="normal" size="sm" showLabel={false} pulse />
            <span className="text-[10px] text-[#10b981] font-semibold uppercase tracking-wider">LEDGER INTACT</span>
          </div>
        </div>

        {/* Desktop Surface Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#11141d] p-1 border border-[#283144] rounded-sm">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs transition-all font-semibold uppercase tracking-wider ${
                  isActive
                    ? "bg-[#1f2637] text-[#ffc833] shadow-sm border border-[#3d4964]"
                    : "text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#181d28]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[8px] px-1 py-0.2 rounded bg-[#090b10] text-[#64748b] border border-[#283144]">
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#f59e0b] hover:bg-[#d97706] text-[#090b10] font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Honey</span>
          </Link>
          <a
            href="https://github.com/atharveeee-netizen/sih"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-xs text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#181d28] border border-transparent hover:border-[#283144] transition-colors"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/verify"
            className="px-2.5 py-1 rounded-xs bg-[#f59e0b] text-[#090b10] font-bold text-[11px] uppercase tracking-wider"
          >
            Verify
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xs bg-[#181d28] border border-[#283144] text-[#94a3b8] hover:text-[#f1f5f9]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#283144] bg-[#090b10] px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-xs font-semibold uppercase tracking-wider ${
                  isActive
                    ? "bg-[#1f2637] text-[#ffc833] border border-[#3d4964]"
                    : "text-[#94a3b8] hover:bg-[#181d28] hover:text-[#f1f5f9]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#11141d] text-[#64748b] border border-[#283144]">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
