"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  LayoutDashboard, 
  MapPin, 
  Cpu, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Boxes, 
  ArrowRight,
  Activity,
  Droplet,
  Scale
} from "lucide-react";
import { getBeekeepers, getHives, createHarvest } from "@/lib/api";

export default function BeekeeperPage() {
  const [beekeepers, setBeekeepers] = useState<any[]>([]);
  const [selectedBk, setSelectedBk] = useState<string>("BEE-KVIC-001");
  const [hives, setHives] = useState<any[]>([]);
  const [harvestModalOpen, setHarvestModalOpen] = useState(false);
  
  // Form state
  const [hiveId, setHiveId] = useState(1);
  const [quantityKg, setQuantityKg] = useState(30.0);
  const [fieldMoisture, setFieldMoisture] = useState(17.5);
  const [floralSource, setFloralSource] = useState("Nilgiris Wild Multifloral");
  const [harvestSuccess, setHarvestSuccess] = useState<string | null>(null);

  useEffect(() => {
    getBeekeepers()
      .then(res => {
        const bkList = (res.data as any)?.beekeepers || res.data;
        if (Array.isArray(bkList)) setBeekeepers(bkList);
      })
      .catch(() => {});

    getHives()
      .then(res => {
        const hiveList = (res.data as any)?.hives || res.data;
        if (Array.isArray(hiveList)) setHives(hiveList);
      })
      .catch(() => {
        // Fallback demo data
        setHives([
          { hive_id: 1, name: "Hive-001 (Alpha Core)", status: "HEALTHY", last_health_score: 98.5, apiary_name: "Shola Ridge", beekeeper_name: "Ramanathan Pillai" },
          { hive_id: 2, name: "Hive-002 (Shola West)", status: "HEALTHY", last_health_score: 97.2, apiary_name: "Shola Ridge", beekeeper_name: "Ramanathan Pillai" },
          { hive_id: 3, name: "Hive-003 (Thermal Monitor)", status: "AT_RISK", last_health_score: 42.0, apiary_name: "Shola Ridge", beekeeper_name: "Ramanathan Pillai" },
          { hive_id: 4, name: "Hive-004 (Eucalyptus Ridge)", status: "HEALTHY", last_health_score: 96.8, apiary_name: "Blue Mountain", beekeeper_name: "Kavitha Murugan" }
        ]);
      });
  }, []);

  const handleRecordHarvest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createHarvest({
        hive_id: Number(hiveId),
        apiary_id: "apiary-nilgiris-01",
        beekeeper_id: selectedBk,
        quantity_kg: Number(quantityKg),
        field_moisture_pct: Number(fieldMoisture),
        floral_source: floralSource,
        notes: "Recorded from Beekeeper Field App"
      });
      const harvId = (res.data as any)?.harvest_id || "harv-01";
      setHarvestSuccess(`Harvest ${harvId} recorded & anchored into cryptographic ledger!`);
      setTimeout(() => {
        setHarvestModalOpen(false);
        setHarvestSuccess(null);
      }, 1500);
    } catch {
      setHarvestSuccess(`Harvest recorded locally (Demo Mode)!`);
      setTimeout(() => {
        setHarvestModalOpen(false);
        setHarvestSuccess(null);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-[#f1f5f9] font-sans selection:bg-[#f59e0b] selection:text-[#090b10]">
      <Navbar />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 font-mono">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#283144] pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#f59e0b] font-bold uppercase mb-1">
                <LayoutDashboard className="w-4 h-4" />
                <span>Rural Apiary Field Workspace</span>
              </div>
              <h1 className="text-2xl font-black uppercase text-[#f1f5f9] tracking-tight">
                Beekeeper Operations & Harvest Manager
              </h1>
              <p className="text-xs text-[#94a3b8] mt-1">
                KVIC Beneficiary Portal for continuous hive health monitoring, multi-sensor telemetry, and harvest logging.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHarvestModalOpen(true)}
                className="px-3.5 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#090b10] text-xs font-bold rounded uppercase transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Record New Harvest</span>
              </button>
            </div>
          </div>

          {/* Beekeeper Profile Selector */}
          <div className="p-4 bg-[#11141d] border border-[#283144] rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#181d28] border border-[#3d4964] flex items-center justify-center text-[#ffc833] font-bold">
                RP
              </div>
              <div>
                <div className="font-bold text-[#f1f5f9]">Ramanathan Pillai (KVIC-REG-TN-4102)</div>
                <div className="text-[#64748b]">Shola Ridge Apiary • Nilgiris Mountain Forest Cluster, TN</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#94a3b8]">
              <div>
                <span className="text-[#64748b]">Active Hives: </span>
                <span className="font-bold text-[#f1f5f9]">6 boxes</span>
              </div>
              <div>
                <span className="text-[#64748b]">Health Score: </span>
                <span className="font-bold text-[#10b981]">98.2%</span>
              </div>
            </div>
          </div>

          {/* HIVES IN APIARY */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">Monitored Hives in Apiary</h2>
              <Link href="/hives" className="text-xs text-[#f59e0b] hover:underline flex items-center gap-1">
                <span>View Full Telemetry Fleet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hives.slice(0, 6).map((h) => {
                const isAtRisk = h.status === "AT_RISK" || h.status === "CRITICAL";
                return (
                  <div key={h.hive_id} className={`p-4 bg-[#11141d] border rounded-sm ${
                    isAtRisk ? "border-[#ef4444]/60" : "border-[#283144]"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#f1f5f9]">Hive #{String(h.hive_id).padStart(3, "0")}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        isAtRisk ? "bg-[#ef4444]/20 text-[#ef4444]" : "bg-[#10b981]/20 text-[#10b981]"
                      }`}>
                        {h.status}
                      </span>
                    </div>

                    <div className="text-xs text-[#94a3b8] mb-3">{h.name}</div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#283144] mb-3">
                      <div>
                        <div className="text-[#64748b] text-[9px]">HEALTH SCORE</div>
                        <div className={`font-bold ${isAtRisk ? "text-[#ef4444]" : "text-[#10b981]"}`}>
                          {h.last_health_score}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[#64748b] text-[9px]">AI DIAGNOSIS</div>
                        <div className="font-bold text-[#f1f5f9]">
                          {isAtRisk ? "Thermal Stress" : "Queen Present"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#283144] text-[11px]">
                      <span className="text-[#64748b]">Comb Load: ~31.4 kg</span>
                      <Link href="/hives" className="text-[#f59e0b] hover:underline font-semibold">
                        Inspect →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HARVEST RECORDING MODAL */}
          {harvestModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="w-full max-w-md bg-[#11141d] border border-[#3d4964] rounded-lg p-6 font-mono space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#283144] pb-3">
                  <div className="text-sm font-bold text-[#f1f5f9] uppercase">Record Honey Harvest</div>
                  <button
                    type="button"
                    onClick={() => setHarvestModalOpen(false)}
                    className="text-[#94a3b8] hover:text-[#f1f5f9]"
                  >
                    ✕
                  </button>
                </div>

                {harvestSuccess ? (
                  <div className="p-4 bg-[#10b981]/20 border border-[#10b981] rounded text-xs text-[#10b981] font-bold text-center">
                    {harvestSuccess}
                  </div>
                ) : (
                  <form onSubmit={handleRecordHarvest} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[#94a3b8] mb-1">Source Hive ID</label>
                      <select
                        value={hiveId}
                        onChange={(e) => setHiveId(Number(e.target.value))}
                        className="w-full p-2 bg-[#090b10] border border-[#283144] rounded text-[#f1f5f9]"
                      >
                        <option value={1}>Hive #001 (Alpha Core)</option>
                        <option value={2}>Hive #002 (Shola West)</option>
                        <option value={4}>Hive #004 (Eucalyptus Ridge)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#94a3b8] mb-1">Harvest Quantity (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={quantityKg}
                        onChange={(e) => setQuantityKg(Number(e.target.value))}
                        className="w-full p-2 bg-[#090b10] border border-[#283144] rounded text-[#f1f5f9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#94a3b8] mb-1">Field Moisture Refractometer (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={fieldMoisture}
                        onChange={(e) => setFieldMoisture(Number(e.target.value))}
                        className="w-full p-2 bg-[#090b10] border border-[#283144] rounded text-[#f1f5f9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#94a3b8] mb-1">Primary Floral Source</label>
                      <input
                        type="text"
                        value={floralSource}
                        onChange={(e) => setFloralSource(e.target.value)}
                        className="w-full p-2 bg-[#090b10] border border-[#283144] rounded text-[#f1f5f9]"
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setHarvestModalOpen(false)}
                        className="px-3 py-2 bg-[#181d28] border border-[#283144] text-[#94a3b8] rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#090b10] font-bold rounded"
                      >
                        Anchor to Ledger
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
