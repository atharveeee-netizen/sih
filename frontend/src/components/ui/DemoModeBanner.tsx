"use client";

import React from "react";
import { Info } from "lucide-react";

interface DemoModeBannerProps {
  isDemo?: boolean;
}

export function DemoModeBanner({ isDemo = true }: DemoModeBannerProps) {
  if (!isDemo) return null;

  return (
    <aside aria-label="Demonstration mode notice" className="w-full bg-amber-500/10 border-b border-amber-500/30 text-amber-900 px-4 py-2 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="font-bold uppercase tracking-wider text-amber-800">
            DEMONSTRATION MODE (OFFLINE FIXTURE)
          </span>
          <span className="hidden md:inline text-amber-700">
            • Displaying deterministic seed data (SIH 2026 Problem Statement 26021). Live backend connection is optional.
          </span>
        </div>
        <div className="text-[11px] text-amber-800 font-medium">
          Source: KVIC Honey Mission Demo Seeder
        </div>
      </div>
    </aside>
  );
}
