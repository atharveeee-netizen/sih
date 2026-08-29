"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, Download, Laptop, Radio, Zap, ShieldCheck, Sparkles, Layers, Lock, Cpu, CheckCircle2, Building, Smartphone } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const SEARCH_DATABASE = [
    { title: "Consumer QR Verification (Gasless Merkle Proof)", category: "Provenance", href: "/verify" },
    { title: "Beekeeper Fleet Command Center (100 Hives)", category: "Dashboard", href: "/dashboard" },
    { title: "KVIC Rural Cluster Onboarding (Software-Only)", category: "Rural MSME", href: "/kvic-onboard" },
    { title: "FSSAI & QA Inspector Bulk Audit Portal", category: "Audit", href: "/inspector" },
    { title: "HiveOS App (Interactive 100-Hive Console)", category: "Software", href: "/app" },
    { title: "System Design (16-Sensor Fusion & Zero-Disturbance Enclosure)", category: "Hardware", href: "/#the_system" },
    { title: "100-Hive Mesh Topology & Multi-Hop LoRa", category: "Network", href: "/#mesh" },
    { title: "Edge AI (TinyML Triage & Acoustic 1D-CNN Disease Classifier)", category: "Edge AI", href: "/#edge_ai" },
    { title: "Honey Chain (DePIN Keccak-256 Multi-Oracle Provenance)", category: "Provenance", href: "/#honey_chain" },
    { title: "Antmicro CM4 Baseboard 6 TOPS Gateway Hub", category: "Hardware", href: "/#gateway-package" },
    { title: "Hardware Specifications & Benchmarks", category: "Specs", href: "/#the_specs" },
  ];

  const filteredResults = SEARCH_DATABASE.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#18191a]/95 backdrop-blur-md text-white shadow-xl border-b border-white/10"
          : "bg-[#18191a]/70 backdrop-blur-sm text-white border-b border-white/5"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Left: Brand */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-xl sm:text-2xl tracking-tight text-white hover:text-[#ffc833] transition-colors"
          >
            <span>🍯 HoneyChain</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffc833] inline-block animate-pulse" />
          </Link>
          <span className="hidden sm:inline-block text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
            SIH PS 26021
          </span>
        </div>

        {/* Center: Search & Primary Navigation */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-5 text-sm font-medium">
          {/* Universal Search Box */}
          <div className="relative">
            <div
              className={`flex items-center bg-black/40 hover:bg-black/60 rounded-full px-3.5 py-1.5 transition-all duration-200 border border-white/15 ${
                searchExpanded ? "w-56 ring-2 ring-[#ffc833]" : "w-36 xl:w-40"
              }`}
            >
              <Search className="w-3.5 h-3.5 text-white/70 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onFocus={() => setSearchExpanded(true)}
                onBlur={() => setTimeout(() => setSearchExpanded(false), 250)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white placeholder-white/60 text-xs focus:outline-none w-full"
              />
            </div>

            {/* Search Dropdown */}
            {searchExpanded && searchQuery.length > 0 && (
              <div className="absolute top-full mt-2 left-0 w-80 bg-[#1d1c18] rounded-2xl shadow-2xl border border-white/15 overflow-hidden z-50">
                <div className="p-2.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#ffc833] border-b border-white/10 flex justify-between">
                  <span>Search Results</span>
                  <span>{filteredResults.length} found</span>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-white/5">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => setSearchExpanded(false)}
                        className="block px-3.5 py-2.5 text-xs text-white/90 hover:bg-[#ffc833] hover:text-[#312f28] transition-colors"
                      >
                        <div className="font-bold">{item.title}</div>
                        <div className="text-[10px] text-white/50">{item.category}</div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-white/50">
                      No results for &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <Link 
            href="/verify" 
            className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full hover:bg-emerald-500 hover:text-black transition-all whitespace-nowrap shadow-sm text-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify QR</span>
          </Link>

          <Link 
            href="/dashboard" 
            className="flex items-center gap-1.5 text-[#ffc833] font-bold bg-[#ffc833]/15 border border-[#ffc833]/40 px-3 py-1 rounded-full hover:bg-[#ffc833] hover:text-[#312f28] transition-all whitespace-nowrap shadow-sm text-xs"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Fleet Dashboard</span>
          </Link>

          <Link 
            href="/kvic-onboard" 
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap text-xs"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>KVIC Rural</span>
          </Link>

          <Link 
            href="/inspector" 
            className="flex items-center gap-1.5 text-purple-400 hover:text-purple-300 transition-colors whitespace-nowrap text-xs"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Audit Portal</span>
          </Link>

          <Link 
            href="/traceability" 
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full hover:bg-cyan-500 hover:text-black transition-all whitespace-nowrap shadow-sm text-xs"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Web3 Traceability</span>
          </Link>

          <Link href="/#the_system" className="hover:text-[#ffc833] transition-colors whitespace-nowrap text-xs">
            System Design
          </Link>

          <Link href="/#edge_ai" className="hover:text-[#ffc833] transition-colors whitespace-nowrap text-xs">
            Edge AI
          </Link>
        </div>

        {/* Right Side: CTA Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/verify"
            className="flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold px-5 py-2 sm:px-6 sm:py-2.5 rounded-full shadow-xl bg-[#ffc833] text-[#312f28] hover:bg-[#ffd659] active:scale-95 transition-all uppercase tracking-wide"
            title="Scan & Verify Honey"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>SCAN JAR QR</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-[#ffc833] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1d1c18] border-t border-white/15 px-6 py-6 space-y-3 text-sm font-semibold shadow-2xl">
          <Link
            href="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-emerald-400 font-bold border-b border-white/10"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Honey QR (/verify)</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
              GASLESS
            </span>
          </Link>

          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-[#ffc833] font-bold border-b border-white/10"
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4" />
              <span>Fleet Dashboard (/dashboard)</span>
            </div>
          </Link>

          <Link
            href="/kvic-onboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-blue-400 font-bold border-b border-white/10"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>KVIC Rural Onboarding (/kvic-onboard)</span>
            </div>
          </Link>

          <Link
            href="/inspector"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-purple-400 font-bold border-b border-white/10"
          >
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              <span>QA &amp; Export Audit (/inspector)</span>
            </div>
          </Link>

          <Link
            href="/traceability"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-cyan-400 font-bold border-b border-white/10"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Web3 Traceability (/traceability)</span>
            </div>
            <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">
              METAMASK
            </span>
          </Link>

          <Link
            href="/#the_system"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white hover:text-[#ffc833]"
          >
            System Design
          </Link>

          <Link
            href="/#edge_ai"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white hover:text-[#ffc833]"
          >
            Edge AI Diagnostics
          </Link>
        </div>
      )}
    </nav>
  );
}
