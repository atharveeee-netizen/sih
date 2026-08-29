"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileCheck2, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Download, 
  Filter,
  ShieldCheck,
  Building
} from "lucide-react";
import { SAMPLE_BATCHES } from "@/lib/mockData";

export default function InspectorPage() {
  const [filterCluster, setFilterCluster] = useState("ALL");
  const batches = Object.values(SAMPLE_BATCHES);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🍯</span>
              <span className="font-bold text-lg text-amber-400 tracking-tight">HONEYCHAIN AUDIT PORTAL</span>
            </Link>
            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-mono">
              FSSAI / EXPORT QA INSPECTOR
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link 
              href="/dashboard"
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 transition"
            >
              Fleet Dashboard
            </Link>
            <Link 
              href="/verify"
              className="text-xs bg-amber-500 hover:bg-amber-400 text-black font-semibold px-3 py-1.5 rounded-lg transition"
            >
              Consumer Verify
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Bulk Honey Batch Verification &amp; Export Audit</h1>
            <p className="text-xs text-slate-400">
              Cryptographic verification of honey batches for commercial retailers, food testing labs, and export certification agencies.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              <select
                value={filterCluster}
                onChange={(e) => setFilterCluster(e.target.value)}
                className="bg-transparent focus:outline-none"
              >
                <option value="ALL">All KVIC Clusters</option>
                <option value="COORG">Coorg Karnataka Cluster</option>
                <option value="SUNDARBANS">Sundarbans Wild Honey</option>
              </select>
            </div>

            <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Batch List Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Batch ID</th>
                  <th className="p-4">Hive &amp; Cluster</th>
                  <th className="p-4">Curing Days</th>
                  <th className="p-4">Avg Brood Temp</th>
                  <th className="p-4">Moisture</th>
                  <th className="p-4">AI Health Status</th>
                  <th className="p-4">Multi-Oracle Consensus</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {batches.map((batch) => (
                  <tr key={batch.batchId} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-bold text-amber-400">
                      #{batch.batchId}
                    </td>
                    <td className="p-4 text-slate-200">
                      <div>Hive #{batch.hiveId}</div>
                      <div className="text-[10px] text-slate-500">{batch.clusterName}</div>
                    </td>
                    <td className="p-4 text-slate-300">
                      {batch.curingPeriodDays} Days
                    </td>
                    <td className="p-4 text-emerald-400">
                      {batch.telemetrySummary.avgBroodTempC} °C
                    </td>
                    <td className="p-4">
                      <div className="text-white font-semibold">{batch.moisturePct}%</div>
                      <div className="text-[9px] text-amber-300/80">Self-Declared</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                        {batch.aiHealthSummary.colonyStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>2 / 3 Quorum</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/verify/${batch.batchId}`}
                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs transition inline-flex items-center gap-1"
                      >
                        <span>Audit Certificate</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
