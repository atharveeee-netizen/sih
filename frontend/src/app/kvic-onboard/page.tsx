"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  MapPin, 
  PlusCircle, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Smartphone, 
  ArrowRight,
  Upload
} from "lucide-react";

export default function KvicOnboardPage() {
  const [beekeeperName, setBeekeeperName] = useState("");
  const [coopCluster, setCoopCluster] = useState("KVIC Coorg Honey Cooperative #12");
  const [hiveId, setHiveId] = useState("108");
  const [hiveLocation, setHiveLocation] = useState("Village Somwarpet, Coorg, Karnataka");
  const [manualTemp, setManualTemp] = useState("34.8");
  const [manualWeight, setManualWeight] = useState("36.2");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-black">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🍯</span>
              <span className="font-bold text-lg text-amber-400 tracking-tight">HONEYCHAIN RURAL PORTAL</span>
            </Link>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
              KVIC / MSME CLUSTER ONBOARDING
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
            <Smartphone className="w-3.5 h-3.5" />
            <span>SOFTWARE-ONLY RURAL ONBOARDING PATH (ZERO HARDWARE REQUIRED)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            KVIC Cooperative Cluster Hive Registration
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Enable rural beekeepers without IoT sensor nodes to onboard immediately through assisted field officer manual logs, photo verification, and community gateway anchoring.
          </p>
        </div>

        {submitted ? (
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Hive #{hiveId} Successfully Registered!</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Registered under <strong>{beekeeperName || "Ramesh Gowda"}</strong> in the <strong>{coopCluster}</strong>.
              Assigned to KVIC Shared Gateway #1 for daily Merkle anchoring.
            </p>
            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={() => setSubmitted(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs transition"
              >
                Register Another Hive
              </button>
              <Link
                href="/dashboard"
                className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-5 py-2 rounded-xl text-xs transition"
              >
                Go to Fleet Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Beekeeper Name / Farmer ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Gowda (KVIC-KA-4921)"
                  value={beekeeperName}
                  onChange={(e) => setBeekeeperName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  KVIC Beekeeping Cooperative Cluster
                </label>
                <select
                  value={coopCluster}
                  onChange={(e) => setCoopCluster(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                >
                  <option>KVIC Coorg Honey Cooperative #12</option>
                  <option>KVIC Sundarbans Wild Honey Federation</option>
                  <option>KVIC Nilgiris Tribal Beekeeping Society</option>
                  <option>KVIC Kashmir Acacia Honey Cluster</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Assigned Hive ID
                </label>
                <input
                  type="number"
                  value={hiveId}
                  onChange={(e) => setHiveId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-mono focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Apiary Geographic Location
                </label>
                <input
                  type="text"
                  value={hiveLocation}
                  onChange={(e) => setHiveLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Manual Field Inspection Log Section */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Initial Field Inspection &amp; Brood Health Log
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Manual Brood Nest Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={manualTemp}
                    onChange={(e) => setManualTemp(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Hive Super Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={manualWeight}
                    onChange={(e) => setManualWeight(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Upload Photo Verification */}
            <div className="p-4 rounded-xl bg-slate-950/50 border border-dashed border-slate-700 text-center space-y-2">
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <div className="text-xs text-slate-300">
                Upload Hive Frame or Inspection Photo (IPFS Pinata Backup)
              </div>
              <p className="text-[10px] text-slate-500">PNG, JPG up to 10MB</p>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 transition shadow-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Complete Hive Onboarding &amp; Anchor on Smart Contract</span>
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
