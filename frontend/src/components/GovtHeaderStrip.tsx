"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Eye, Sparkles } from "lucide-react";

export default function GovtHeaderStrip() {
  const [fontSize, setFontSize] = useState<"normal" | "large" | "larger">("normal");

  const adjustFontSize = (size: "normal" | "large" | "larger") => {
    setFontSize(size);
    if (typeof document !== "undefined") {
      if (size === "normal") {
        document.documentElement.style.fontSize = "100%";
      } else if (size === "large") {
        document.documentElement.style.fontSize = "108%";
      } else if (size === "larger") {
        document.documentElement.style.fontSize = "115%";
      }
    }
  };

  return (
    <div className="w-full bg-[#111622] text-[#E2E8F0] border-b border-[#2D3748] font-sans">
      {/* 🇮🇳 Official Government of India Tricolor Ribbon */}
      <div className="w-full h-[3.5px] grid grid-cols-3">
        <div className="bg-[#FF9933]" title="Saffron - Strength and Courage" />
        <div className="bg-[#FFFFFF]" title="White - Peace and Truth" />
        <div className="bg-[#138808]" title="Green - Fertility, Growth and Auspiciousness" />
      </div>

      {/* Official Government of India Apex Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] gap-2">
        {/* Left: Official Government of India & Ministry Seals */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ashoka Stambh / State Emblem Silhouette representation */}
          <div className="flex items-center gap-1.5 shrink-0">
            <svg
              className="w-4 h-5 text-[#D4AF37] shrink-0"
              viewBox="0 0 24 30"
              fill="currentColor"
              aria-label="Emblem of India"
            >
              <path d="M12 1L9 4h6l-3-3zm0 4.5c-3.3 0-6 2.7-6 6v3.5h12V11.5c0-3.3-2.7-6-6-6zm-4 11h8v1H8v-1zm-2 2h12v1.5H6v-1.5zm-2 2.5h16v1.5H4V21zm3 2.5h10v1H7v-1z" />
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-white tracking-wide">
                भारत सरकार <span className="text-[#94A3B8] font-normal">| Government of India</span>
              </span>
              <span className="text-[9px] text-[#CBD5E1] hidden xs:inline">
                सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय • खादी और ग्रामोद्योग आयोग (KVIC)
              </span>
            </div>
          </div>

          <span className="text-[#475569] hidden md:inline">|</span>

          {/* National Honey Mission / MadhuKranti federation badge */}
          <div className="hidden lg:flex items-center gap-1.5 text-[9.5px] text-[#CBD5E1]">
            <span className="px-1.5 py-0.2 bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-mono font-bold rounded-xs">
              KVIC HONEY MISSION
            </span>
            <span>National Bee Board (NBB) • MadhuKranti Portal Federation</span>
          </div>
        </div>

        {/* Right: Team Beevil Knievel Authorship & Accessibility Tools */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-auto sm:ml-0">
          {/* Prominent Team Beevil Knievel Identification */}
          <div className="flex items-center gap-1.5 bg-[#1E293B] px-2 py-0.5 rounded border border-[#334155]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9.5px] font-medium text-[#F8FAFC]">
              Architected by <strong className="text-[#D4AF37] font-bold">Team Beevil Knievel</strong>
            </span>
            <span className="hidden md:inline text-[9px] text-[#94A3B8] font-mono">
              (Lead: Atharve Dahima)
            </span>
          </div>

          {/* Accessibility Controls standard on India.gov.in portals */}
          <div className="hidden sm:flex items-center gap-1 text-[10px] text-[#94A3B8] border-l border-[#334155] pl-2">
            <span className="sr-only">Font Size Controls</span>
            <button
              type="button"
              onClick={() => adjustFontSize("normal")}
              className={`px-1 rounded hover:text-white ${fontSize === "normal" ? "font-bold text-[#D4AF37]" : ""}`}
              title="Default Font Size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => adjustFontSize("large")}
              className={`px-1 rounded hover:text-white ${fontSize === "large" ? "font-bold text-[#D4AF37]" : ""}`}
              title="Medium Font Size"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => adjustFontSize("larger")}
              className={`px-1 rounded hover:text-white ${fontSize === "larger" ? "font-bold text-[#D4AF37]" : ""}`}
              title="Large Font Size"
            >
              A+
            </button>
          </div>

          {/* SIH 2026 Problem Statement ID */}
          <span className="hidden md:inline text-[9px] font-mono font-bold bg-[#D4AF37] text-[#090D16] px-1.5 py-0.5 rounded-xs">
            SIH26021
          </span>
        </div>
      </div>
    </div>
  );
}
