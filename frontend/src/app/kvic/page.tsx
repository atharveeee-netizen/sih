"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Building2, 
  MapPin, 
  Users, 
  Cpu, 
  Boxes, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Activity,
  ArrowRight,
  RefreshCw,
  Award,
  ChevronRight
} from "lucide-react";
import { getKvicStats, getClusters } from "@/lib/api";

export default function KvicAdminDashboard() {
  const [stats, setStats] = useState<any>({
    clusters_active: 3,
    registered_beekeepers: 5,
    total_monitored_hives: 12,
    healthy_colonies: 11,
    at_risk_colonies: 1,
    total_harvested_honey_kg: 107.5,
    total_honey_batches: 2,
    verified_market_batches: 2,
    traceability_compliance_pct: 100.0,
    suspicious_counterfeit_alerts: 1
  });

  const [clusters, setClusters] = useState<any[]>([
    {
      id: "cluster-nilgiris",
      name: "Nilgiris Mountain Forest Cluster",
      state: "Tamil Nadu",
      district: "Nilgiris",
      pincode: "643001",
      contact_officer: "Dr. S. Sundaram",
      officer_phone: "+91 94432 00101",
      beekeepers_count: 45,
      honey_harvested_kg: 45.0,
      at_risk_hives: 1
    },
    {
      id: "cluster-gir",
      name: "Gir Forest Flora Apiculture Cluster",
      state: "Gujarat",
      district: "Junagadh",
      pincode: "362150",
      contact_officer: "Er. K. Vala",
      officer_phone: "+91 99245 00202",
      beekeepers_count: 60,
      honey_harvested_kg: 62.5,
      at_risk_hives: 0
    },
    {
      id: "cluster-kashmir",
      name: "Kashmir Valley Acacia Cluster",
      state: "Jammu & Kashmir",
      district: "Pulwama",
      pincode: "192301",
      contact_officer: "Dr. M. Lone",
      officer_phone: "+91 94190 00303",
      beekeepers_count: 38,
      honey_harvested_kg: 0.0,
      at_risk_hives: 0
    }
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getKvicStats(),
      getClusters()
    ])
      .then(([statsRes, clusterRes]) => {
        if (statsRes?.data) setStats(statsRes.data);
        const clusterList = (clusterRes?.data as any)?.clusters || clusterRes?.data;
        if (Array.isArray(clusterList)) setClusters(clusterList);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-[#f1f5f9] font-sans selection:bg-[#f59e0b] selection:text-[#090b10]">
      <Navbar />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 font-mono">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#283144] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#f59e0b] font-bold uppercase mb-1">
                <Building2 className="w-4 h-4" />
                <span>Khadi & Village Industries Commission (Ministry of MSME)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-[#f1f5f9] tracking-tight">
                KVIC National Honey Mission Command Center
              </h1>
              <p className="text-xs text-[#94a3b8] mt-1">
                Macro oversight for rural beekeeping clusters, honey production quotas, digital traceability compliance, and counterfeit prevention.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/beekeeper"
                className="px-3 py-2 bg-[#181d28] hover:bg-[#1f2637] border border-[#283144] text-xs font-bold text-[#f1f5f9] rounded uppercase transition-colors"
              >
                Beekeeper Registry
              </Link>
              <Link
                href="/market"
                className="px-3 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#090b10] text-xs font-bold rounded uppercase transition-colors"
              >
                Verified Market
              </Link>
            </div>
          </div>

          {/* MACRO METRICS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
              <div className="text-[10px] text-[#94a3b8] uppercase mb-1">Active Clusters</div>
              <div className="text-2xl font-bold text-[#f1f5f9]">{stats.clusters_active}</div>
              <div className="text-[10px] text-[#64748b] mt-1">Tamil Nadu • Gujarat • J&K</div>
            </div>

            <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
              <div className="text-[10px] text-[#94a3b8] uppercase mb-1">Registered Beekeepers</div>
              <div className="text-2xl font-bold text-[#f1f5f9]">{stats.registered_beekeepers}</div>
              <div className="text-[10px] text-[#10b981] mt-1">100% Aadhaar & Bank Linked</div>
            </div>

            <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
              <div className="text-[10px] text-[#94a3b8] uppercase mb-1">Smart Hives Monitored</div>
              <div className="text-2xl font-bold text-[#f1f5f9]">{stats.total_monitored_hives}</div>
              <div className="text-[10px] text-[#10b981] mt-1">{stats.healthy_colonies} Healthy • {stats.at_risk_colonies} At-Risk</div>
            </div>

            <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
              <div className="text-[10px] text-[#94a3b8] uppercase mb-1">Total Honey Harvested</div>
              <div className="text-2xl font-bold text-[#3b82f6]">{stats.total_harvested_honey_kg} kg</div>
              <div className="text-[10px] text-[#64748b] mt-1">Avg 17.4% Moisture Content</div>
            </div>

            <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
              <div className="text-[10px] text-[#94a3b8] uppercase mb-1">Verified Honey Batches</div>
              <div className="text-2xl font-bold text-[#10b981]">{stats.verified_market_batches}</div>
              <div className="text-[10px] text-[#64748b] mt-1">Quality Certified by KVIC Labs</div>
            </div>

            <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
              <div className="text-[10px] text-[#94a3b8] uppercase mb-1">Traceability Compliance</div>
              <div className="text-2xl font-bold text-[#10b981]">{stats.traceability_compliance_pct}%</div>
              <div className="text-[10px] text-[#64748b] mt-1">SHA-256 Ledger Certified</div>
            </div>

            <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
              <div className="text-[10px] text-[#94a3b8] uppercase mb-1">Counterfeit Alarms</div>
              <div className="text-2xl font-bold text-[#ef4444]">{stats.suspicious_counterfeit_alerts}</div>
              <div className="text-[10px] text-[#ef4444] mt-1">Rapid Velocity Scans Flagged</div>
            </div>

            <div className="p-4 bg-[#11141d] border border-[#283144] rounded-sm">
              <div className="text-[10px] text-[#94a3b8] uppercase mb-1">Quality Failures</div>
              <div className="text-2xl font-bold text-[#10b981]">0</div>
              <div className="text-[10px] text-[#64748b] mt-1">Zero C4 Exogenous Sugars</div>
            </div>
          </div>

          {/* REGIONAL CLUSTER DIRECTORY */}
          <div className="p-5 bg-[#11141d] border border-[#283144] rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#f59e0b] font-bold text-xs uppercase">
                <MapPin className="w-4 h-4" />
                <span>Regional Apiculture Clusters Under KVIC Honey Mission</span>
              </div>
              <span className="text-[10px] text-[#64748b]">{clusters.length} Operational Hubs</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {clusters.map((c) => (
                <div key={c.id} className="p-4 bg-[#181d28] border border-[#283144] rounded-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-[#f59e0b] font-bold uppercase">{c.state}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#090b10] text-[#10b981] font-bold">ACTIVE</span>
                    </div>
                    <div className="text-sm font-bold text-[#f1f5f9] mb-1">{c.name}</div>
                    <div className="text-xs text-[#94a3b8] mb-3">District: {c.district} ({c.pincode})</div>

                    <div className="space-y-1 text-xs border-t border-[#283144] pt-2 text-[#64748b]">
                      <div className="flex justify-between">
                        <span>Nodal Officer:</span>
                        <span className="text-[#f1f5f9]">{c.contact_officer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hotline:</span>
                        <span className="text-[#94a3b8]">{c.officer_phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#283144] flex items-center justify-between">
                    <Link
                      href={`/hives`}
                      className="text-xs text-[#f59e0b] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>View Monitored Hives</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVE COUNTERFEIT & REUSE AUDIT LOG */}
          <div className="p-5 bg-[#11141d] border border-[#283144] rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#ef4444] font-bold text-xs uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>Real-Time Counterfeit & QR Anomaly Security Log</span>
              </div>
              <span className="text-[10px] text-[#64748b]">Real-Time Gateway Detection</span>
            </div>

            <div className="border border-[#283144] rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#181d28] text-[#94a3b8] border-b border-[#283144]">
                    <th className="py-2.5 px-3">PACKAGE CODE</th>
                    <th className="py-2.5 px-3">INCIDENT TYPE</th>
                    <th className="py-2.5 px-3">DETECTED LOCATIONS</th>
                    <th className="py-2.5 px-3">TOTAL SCANS</th>
                    <th className="py-2.5 px-3">KVIC STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#283144] text-[#f1f5f9]">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#ffc833]">HC-PKG-B8C24D91</td>
                    <td className="py-2.5 px-3 text-[#ef4444] font-bold">REUSE_DETECTED</td>
                    <td className="py-2.5 px-3 text-[#94a3b8]">Mumbai → New Delhi (7 min diff)</td>
                    <td className="py-2.5 px-3">3 times</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#ef4444]/20 text-[#ef4444] text-[10px] font-bold">
                        FLAGGED IN MARKET
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#10b981]">HC-PKG-A7F93E12</td>
                    <td className="py-2.5 px-3 text-[#10b981]">NORMAL_VERIFIED</td>
                    <td className="py-2.5 px-3 text-[#94a3b8]">Chennai, India</td>
                    <td className="py-2.5 px-3">2 times</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] text-[10px] font-bold">
                        GENUINE RETAIL
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
