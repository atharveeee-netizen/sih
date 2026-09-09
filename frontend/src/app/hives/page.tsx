"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  Cpu, 
  Thermometer, 
  Activity, 
  Scale, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  Battery, 
  TrendingUp,
  RefreshCw,
  ArrowLeft
} from "lucide-react";

export default function HivesPage() {
  const [hives, setHives] = useState<any[]>([]);
  const [selectedHive, setSelectedHive] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/hives")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.hives) {
          setHives(d.hives);
          setSelectedHive(d.hives[0]);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback demo fleet
        const demoHives = [
          { hive_id: 1, name: "Hive-001 (Alpha Core)", status: "HEALTHY", last_health_score: 98.5, tare_weight_kg: 22.5, apiary_name: "Shola Ridge Alpha", beekeeper_name: "Ramanathan Pillai" },
          { hive_id: 2, name: "Hive-002 (Shola West)", status: "HEALTHY", last_health_score: 97.2, tare_weight_kg: 22.0, apiary_name: "Shola Ridge Alpha", beekeeper_name: "Ramanathan Pillai" },
          { hive_id: 3, name: "Hive-003 (Thermal Monitor)", status: "AT_RISK", last_health_score: 42.0, tare_weight_kg: 23.0, apiary_name: "Shola Ridge Alpha", beekeeper_name: "Ramanathan Pillai" },
          { hive_id: 4, name: "Hive-004 (Eucalyptus Ridge)", status: "HEALTHY", last_health_score: 96.8, tare_weight_kg: 21.8, apiary_name: "Blue Mountain High", beekeeper_name: "Kavitha Murugan" },
          { hive_id: 6, name: "Hive-006 (Talala Jamun 1)", status: "HEALTHY", last_health_score: 98.0, tare_weight_kg: 22.8, apiary_name: "Somnath Border", beekeeper_name: "Bhavesh Patel" },
          { hive_id: 11, name: "Hive-011 (White Honey Core)", status: "HEALTHY", last_health_score: 99.0, tare_weight_kg: 22.5, apiary_name: "Pampore Acacia", beekeeper_name: "Ghulam Nabi Lone" }
        ];
        setHives(demoHives);
        setSelectedHive(demoHives[0]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedHive?.hive_id) {
      fetch(`http://localhost:8000/api/v1/productivity/forecast/${selectedHive.hive_id}`)
        .then(r => r.ok ? r.json() : null)
        .then(d => {
          if (d) setForecast(d);
        })
        .catch(() => {
          setForecast({
            current_weight_kg: 34.2,
            "7_day_weight_delta_kg": 2.4,
            projected_harvestable_yield_kg: 18.5,
            colony_productivity_status: "ACTIVE_ACCUMULATING",
            recommended_harvest_window: "Next 6 to 9 days"
          });
        });
    }
  }, [selectedHive]);

  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-[#f1f5f9] font-sans selection:bg-[#f59e0b] selection:text-[#090b10]">
      <Navbar />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 font-mono">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#283144] pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#f59e0b] font-bold uppercase mb-1">
                <Cpu className="w-4 h-4" />
                <span>Honey Chain Smart Hive IoT Infrastructure</span>
              </div>
              <h1 className="text-2xl font-black uppercase text-[#f1f5f9] tracking-tight">
                Smart Hive Fleet Telemetry & AI Diagnostics
              </h1>
              <p className="text-xs text-[#94a3b8] mt-1">
                Real-time LoRa star network ingestion: 5-point frame temperature gradient, load-cell comb weight, and acoustic FFT.
              </p>
            </div>

            <Link
              href="/system"
              className="px-3 py-2 bg-[#181d28] hover:bg-[#1f2637] border border-[#283144] text-xs font-bold text-[#ffc833] rounded uppercase transition-colors"
            >
              Hardware & PCB Console
            </Link>
          </div>

          {/* MAIN FLEET & TELEMETRY SPLIT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Hive List */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-[#94a3b8] tracking-wider">
                Active Smart Nodes ({hives.length})
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {hives.map((h) => {
                  const isSelected = selectedHive?.hive_id === h.hive_id;
                  const isAtRisk = h.status === "AT_RISK" || h.status === "CRITICAL";

                  return (
                    <button
                      key={h.hive_id}
                      type="button"
                      onClick={() => setSelectedHive(h)}
                      className={`w-full p-3 text-left border rounded transition-all ${
                        isSelected 
                          ? "bg-[#181d28] border-[#f59e0b]" 
                          : "bg-[#11141d] border-[#283144] hover:bg-[#141822]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-[#f1f5f9]">
                          Hive #{String(h.hive_id).padStart(3, "0")}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          isAtRisk ? "bg-[#ef4444]/20 text-[#ef4444]" : "bg-[#10b981]/20 text-[#10b981]"
                        }`}>
                          {h.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#94a3b8] truncate">{h.name}</div>
                      <div className="text-[10px] text-[#64748b] mt-1">Health: {h.last_health_score}%</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Selected Hive Deep Telemetry */}
            {selectedHive && (
              <div className="lg:col-span-2 space-y-4">
                <div className="p-5 bg-[#11141d] border border-[#283144] rounded-lg space-y-4">
                  
                  {/* Hive Info Banner */}
                  <div className="flex items-center justify-between border-b border-[#283144] pb-3">
                    <div>
                      <div className="text-base font-bold text-[#f1f5f9]">{selectedHive.name}</div>
                      <div className="text-xs text-[#64748b]">
                        Node ID: #{selectedHive.hive_id} • Apiary: {selectedHive.apiary_name || "Shola Ridge"}
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded font-bold uppercase ${
                      selectedHive.status === "HEALTHY" 
                        ? "bg-[#10b981]/20 text-[#10b981]" 
                        : "bg-[#ef4444]/20 text-[#ef4444]"
                    }`}>
                      {selectedHive.status} ({selectedHive.last_health_score}%)
                    </span>
                  </div>

                  {/* 16-Sensor Telemetry Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-[#181d28] border border-[#283144] rounded">
                      <div className="flex items-center justify-between text-[#64748b] text-[10px]">
                        <span>BROOD CORE</span>
                        <Thermometer className="w-3.5 h-3.5 text-[#f59e0b]" />
                      </div>
                      <div className="text-base font-bold text-[#f1f5f9] mt-1">
                        {selectedHive.hive_id === 3 ? "37.6°C" : "34.8°C"}
                      </div>
                      <div className="text-[9px] text-[#10b981]">Optimum: 34.5 - 35.5°C</div>
                    </div>

                    <div className="p-3 bg-[#181d28] border border-[#283144] rounded">
                      <div className="flex items-center justify-between text-[#64748b] text-[10px]">
                        <span>COMB WEIGHT</span>
                        <Scale className="w-3.5 h-3.5 text-[#3b82f6]" />
                      </div>
                      <div className="text-base font-bold text-[#f1f5f9] mt-1">
                        {selectedHive.hive_id === 3 ? "26.1 kg" : "34.2 kg"}
                      </div>
                      <div className="text-[9px] text-[#64748b]">Tare: 22.5 kg</div>
                    </div>

                    <div className="p-3 bg-[#181d28] border border-[#283144] rounded">
                      <div className="flex items-center justify-between text-[#64748b] text-[10px]">
                        <span>CO2 LEVEL</span>
                        <Wind className="w-3.5 h-3.5 text-[#8b5cf6]" />
                      </div>
                      <div className="text-base font-bold text-[#f1f5f9] mt-1">
                        {selectedHive.hive_id === 3 ? "2,450 ppm" : "680 ppm"}
                      </div>
                      <div className="text-[9px] text-[#64748b]">Ventilation normal</div>
                    </div>

                    <div className="p-3 bg-[#181d28] border border-[#283144] rounded">
                      <div className="flex items-center justify-between text-[#64748b] text-[10px]">
                        <span>BATTERY SOC</span>
                        <Battery className="w-3.5 h-3.5 text-[#10b981]" />
                      </div>
                      <div className="text-base font-bold text-[#10b981] mt-1">94%</div>
                      <div className="text-[9px] text-[#64748b]">Solar float: 4.12V</div>
                    </div>
                  </div>

                  {/* 5-Point Frame Temperature Gradient */}
                  <div className="p-3.5 bg-[#181d28] border border-[#283144] rounded space-y-2">
                    <div className="text-[11px] font-bold text-[#94a3b8] uppercase">
                      5-Point Frame Cross-Section Gradient (TMP117 Array)
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
                      <div className="p-2 bg-[#090b10] rounded border border-[#283144]">
                        <div className="text-[9px] text-[#64748b]">FRAME 1</div>
                        <div className="font-bold text-[#f1f5f9]">33.2°C</div>
                      </div>
                      <div className="p-2 bg-[#090b10] rounded border border-[#283144]">
                        <div className="text-[9px] text-[#64748b]">FRAME 2</div>
                        <div className="font-bold text-[#f1f5f9]">33.8°C</div>
                      </div>
                      <div className="p-2 bg-[#090b10] rounded border border-[#f59e0b]/50">
                        <div className="text-[9px] text-[#f59e0b] font-bold">CORE T3</div>
                        <div className="font-bold text-[#ffc833]">34.8°C</div>
                      </div>
                      <div className="p-2 bg-[#090b10] rounded border border-[#283144]">
                        <div className="text-[9px] text-[#64748b]">FRAME 4</div>
                        <div className="font-bold text-[#f1f5f9]">33.9°C</div>
                      </div>
                      <div className="p-2 bg-[#090b10] rounded border border-[#283144]">
                        <div className="text-[9px] text-[#64748b]">FRAME 5</div>
                        <div className="font-bold text-[#f1f5f9]">33.1°C</div>
                      </div>
                    </div>
                  </div>

                  {/* PRODUCTIVITY PREDICTION ENGINE */}
                  {forecast && (
                    <div className="p-4 bg-[#181d28] border border-[#3d4964] rounded space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-[#ffc833] uppercase">
                          <TrendingUp className="w-4 h-4" />
                          <span>AI Productivity & Harvest Forecaster</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#3b82f6]/20 text-[#3b82f6] font-bold">
                          {forecast.colony_productivity_status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                        <div>
                          <div className="text-[10px] text-[#64748b]">7-DAY COMB WEIGHT CHANGE</div>
                          <div className="text-sm font-bold text-[#10b981]">+{forecast["7_day_weight_delta_kg"]} kg</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#64748b]">PROJECTED HARVEST YIELD</div>
                          <div className="text-sm font-bold text-[#f1f5f9]">{forecast.projected_harvestable_yield_kg} kg</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[#64748b]">RECOMMENDED WINDOW</div>
                          <div className="text-sm font-bold text-[#ffc833]">{forecast.recommended_harvest_window}</div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
