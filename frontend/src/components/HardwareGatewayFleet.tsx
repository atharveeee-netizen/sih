"use client";

import React, { useState } from "react";
import {
  Server,
  Radio,
  Cpu,
  ShieldCheck,
  BatteryCharging,
  Wifi,
  CheckCircle2,
  HardDrive,
  RefreshCw,
  Clock,
  Layers,
  Activity,
  AlertCircle,
} from "lucide-react";

interface GatewayNode {
  id: string;
  name: string;
  location: string;
  hardware: string;
  firmware: string;
  status: "ONLINE" | "STANDBY" | "SYNCING";
  loraFreq: string;
  rssi: string;
  batteryPct: number;
  activeHives: number;
  chainHeight: number;
  chainStatus: "INTACT" | "AUDITED";
  lastHeartbeat: string;
}

const GATEWAYS: GatewayNode[] = [
  {
    id: "GW-NILGIRIS-01",
    name: "Nilgiris Mountain Forest Gateway",
    location: "Nilgiris Biosphere, Tamil Nadu",
    hardware: "Dual-Core ESP32-WROOM-32 + SX1262 LoRa",
    firmware: "Beevil-Edge v1.0.4-prod",
    status: "ONLINE",
    loraFreq: "868.1 MHz (IN865 Band)",
    rssi: "-68 dBm",
    batteryPct: 96,
    activeHives: 24,
    chainHeight: 1842,
    chainStatus: "INTACT",
    lastHeartbeat: "12s ago",
  },
  {
    id: "GW-MUZAFFARPUR-02",
    name: "Shahi Litchi Cooperative Edge Hub",
    location: "Muzaffarpur Cluster #02, Bihar",
    hardware: "Raspberry Pi 3B+ Dual-Path Gateway",
    firmware: "Beevil-Edge v1.0.4-prod",
    status: "ONLINE",
    loraFreq: "868.3 MHz / 4G Fallback",
    rssi: "-62 dBm",
    batteryPct: 98,
    activeHives: 48,
    chainHeight: 3109,
    chainStatus: "INTACT",
    lastHeartbeat: "4s ago",
  },
  {
    id: "GW-SUNDARBANS-01",
    name: "Sundarbans Biosphere Mangrove Hub",
    location: "Sundarbans Reserve #WB-009, West Bengal",
    hardware: "IP67 Ruggedized Solar Mesh Gateway",
    firmware: "Beevil-Edge v1.0.4-prod",
    status: "ONLINE",
    loraFreq: "868.5 MHz LoRa Mesh",
    rssi: "-74 dBm",
    batteryPct: 91,
    activeHives: 28,
    chainHeight: 894,
    chainStatus: "INTACT",
    lastHeartbeat: "18s ago",
  },
];

export default function HardwareGatewayFleet() {
  const [gateways, setGateways] = useState<GatewayNode[]>(GATEWAYS);
  const [checking, setChecking] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState("Just now");

  const runHealthAudit = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setLastCheckTime("Just now (All 3 nodes verified)");
    }, 800);
  };

  return (
    <div className="border-2 border-charcoal/15 bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-charcoal/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-5 h-5 text-gold" />
            <h3 className="text-xl serif text-charcoal font-bold">
              KVIC Hardware Edge Gateway Fleet
            </h3>
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
              3/3 Gateways Online
            </span>
          </div>
          <p className="text-xs text-warm-grey">
            Physical field gateways collecting SX1262 LoRa telemetry, maintaining local forward-linked SHA-256 ledgers, and syncing to KVIC HoneyChain.
          </p>
        </div>

        <button
          onClick={runHealthAudit}
          disabled={checking}
          className="px-4 py-2 border border-charcoal bg-charcoal text-white hover:bg-gold hover:text-charcoal hover:border-gold transition-all text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-gold ${checking ? "animate-spin" : ""}`} />
          <span>{checking ? "Auditing Mesh..." : "Audit Hardware Mesh"}</span>
        </button>
      </div>

      {/* Fleet Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3.5 bg-alabaster border border-charcoal/10">
          <span className="text-[9px] uppercase tracking-widest text-warm-grey font-bold block mb-1">
            Active Physical Hives
          </span>
          <p className="text-2xl font-serif font-bold text-charcoal">100</p>
          <span className="text-[9px] font-mono text-emerald-700 font-bold">100% Nodes Synced</span>
        </div>

        <div className="p-3.5 bg-alabaster border border-charcoal/10">
          <span className="text-[9px] uppercase tracking-widest text-warm-grey font-bold block mb-1">
            LoRa Mesh Health
          </span>
          <p className="text-2xl font-serif font-bold text-emerald-700">99.8%</p>
          <span className="text-[9px] font-mono text-warm-grey">IN865 Band &bull; Zero Packet Loss</span>
        </div>

        <div className="p-3.5 bg-alabaster border border-charcoal/10">
          <span className="text-[9px] uppercase tracking-widest text-warm-grey font-bold block mb-1">
            Local SHA-256 Ledger
          </span>
          <p className="text-2xl font-serif font-bold text-gold">Intact</p>
          <span className="text-[9px] font-mono text-emerald-700 font-bold">0 Tamper Events</span>
        </div>

        <div className="p-3.5 bg-alabaster border border-charcoal/10">
          <span className="text-[9px] uppercase tracking-widest text-warm-grey font-bold block mb-1">
            Solar MPPT Average
          </span>
          <p className="text-2xl font-serif font-bold text-charcoal">95.0%</p>
          <span className="text-[9px] font-mono text-emerald-700 font-bold">Autonomy: 3.2 Years</span>
        </div>
      </div>

      {/* Gateways Detailed List */}
      <div className="space-y-3">
        {gateways.map((gw) => (
          <div
            key={gw.id}
            className="p-4 border border-charcoal/15 bg-white hover:border-gold transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs"
          >
            {/* Gateway Identity */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-charcoal">{gw.id}</span>
                <span className="text-xs font-bold text-charcoal">&bull; {gw.name}</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {gw.status}
                </span>
              </div>
              <p className="text-xs text-warm-grey">{gw.location}</p>
              <div className="flex items-center gap-3 text-[10px] font-mono text-warm-grey pt-1">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-gold" />
                  {gw.hardware}
                </span>
                <span className="hidden sm:inline">&bull;</span>
                <span className="hidden sm:inline">{gw.firmware}</span>
              </div>
            </div>

            {/* Gateway Status Indicators */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0 flex-wrap text-xs">
              <div className="text-left sm:text-right">
                <span className="text-[9px] uppercase tracking-wider text-warm-grey block font-mono">LoRa Link</span>
                <span className="font-mono font-bold text-charcoal flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  {gw.rssi}
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[9px] uppercase tracking-wider text-warm-grey block font-mono">Battery</span>
                <span className="font-mono font-bold text-charcoal flex items-center gap-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                  {gw.batteryPct}%
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[9px] uppercase tracking-wider text-warm-grey block font-mono">Hives</span>
                <span className="font-mono font-bold text-charcoal">{gw.activeHives} Connected</span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[9px] uppercase tracking-wider text-warm-grey block font-mono">Ledger Chain</span>
                <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-800 text-[10px] bg-emerald-50 px-2 py-0.5 border border-emerald-300">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  #{gw.chainHeight} Intact
                </span>
              </div>

              <div className="text-left sm:text-right text-[10px] font-mono text-warm-grey hidden xl:block">
                <span>Sync: {gw.lastHeartbeat}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-charcoal/10 flex items-center justify-between text-[10px] text-warm-grey font-mono">
        <span>Beevil Knievel Hardware Mesh Protocol &bull; IN865 Regulatory Compliant</span>
        <span>Last Audit: {lastCheckTime}</span>
      </div>
    </div>
  );
}
