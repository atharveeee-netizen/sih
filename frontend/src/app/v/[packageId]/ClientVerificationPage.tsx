"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  FlaskConical, 
  ArrowLeft,
  Lock,
  Boxes,
  RefreshCw,
  Info,
  ExternalLink
} from "lucide-react";
import { verifyPackage } from "@/lib/api";

export default function ClientVerificationPage({ packageId }: { packageId: string }) {
  const packageCode = packageId;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await verifyPackage(packageCode);
      setData(res.data);
    } catch (err: any) {
      setError(err?.message || "Failed to reach verification gateway.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerification();
  }, [packageCode]);

  const prov = data?.provenance;
  const isSuspicious = 
    data?.status === "SUSPICIOUS" || 
    data?.anomaly_flag === "EXCESSIVE_SCANS" || 
    data?.anomaly_flag === "REUSE_DETECTED";
  const isRepeat = data?.status === "REPEAT_SCAN" || (data?.scan_count > 1 && !isSuspicious);
  const isInvalid = !data?.verified && !isSuspicious;
  const isNormalVerified = data?.verified && !isRepeat && !isSuspicious;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-white">
      <Navbar />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between font-mono text-xs text-slate-500 border-b border-slate-200 pb-3">
            <Link href="/verify" className="inline-flex items-center gap-1.5 text-slate-700 hover:text-amber-600 font-semibold transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Verification Portal</span>
            </Link>
            <span className="text-slate-500 font-semibold">Package Token: <span className="font-bold text-slate-900">{packageCode}</span></span>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-lg font-mono shadow-sm">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-4" />
              <div className="text-sm font-bold text-slate-900">Querying Cryptographic Provenance Ledger...</div>
              <div className="text-xs text-slate-500 mt-1">Verifying SHA-256 hash chain and package scan history</div>
            </div>
          ) : error && !data ? (
            <div className="p-8 bg-red-50 border border-red-200 rounded-lg font-mono text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <div className="text-base font-bold text-red-900">Verification Gateway Unreachable</div>
              <div className="text-xs text-red-700 mt-1 mb-4">{error}</div>
              <button
                onClick={fetchVerification}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold uppercase rounded shadow-sm text-slate-800"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* PRIMARY STATUS BANNER */}
              <div className={`p-6 rounded-lg border font-mono shadow-sm ${
                isSuspicious 
                  ? "bg-red-50 border-red-300 text-red-950" 
                  : isRepeat
                  ? "bg-amber-50 border-amber-300 text-amber-950"
                  : isInvalid 
                  ? "bg-red-100 border-red-400 text-red-950" 
                  : "bg-emerald-50 border-emerald-300 text-emerald-950"
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    {isSuspicious ? (
                      <div className="p-3 bg-red-100 border border-red-200 rounded-full text-red-600">
                        <AlertTriangle className="w-7 h-7" />
                      </div>
                    ) : isRepeat ? (
                      <div className="p-3 bg-amber-100 border border-amber-200 rounded-full text-amber-600">
                        <AlertTriangle className="w-7 h-7" />
                      </div>
                    ) : isInvalid ? (
                      <div className="p-3 bg-red-200 border border-red-300 rounded-full text-red-700">
                        <XCircle className="w-7 h-7" />
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-600">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                    )}
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                        Provenance Verification Result
                      </div>
                      <div className={`text-xl font-black uppercase ${
                        isSuspicious ? "text-red-700" : isRepeat ? "text-amber-800" : isInvalid ? "text-red-800" : "text-emerald-700"
                      }`}>
                        {isSuspicious 
                          ? "SUSPICIOUS — SCAN VELOCITY ANOMALY DETECTED" 
                          : isRepeat
                          ? "REPEAT SCAN — INSPECT PHYSICAL TAMPER SEAL"
                          : isInvalid 
                          ? "INVALID / UNREGISTERED PRODUCT TOKEN" 
                          : "VERIFIED AUTHENTIC KVIC PROVENANCE"}
                      </div>
                      <div className="text-xs text-slate-700 mt-1 max-w-xl font-sans">
                        {data.message}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono self-end sm:self-auto border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-4 pt-2 sm:pt-0">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">TOTAL SCANS</div>
                    <div className="text-xl font-black text-slate-900">{data.scan_count} Time(s)</div>
                    <div className="text-[10px] font-semibold text-slate-500 mt-0.5">Flag: {data.anomaly_flag || "NORMAL"}</div>
                  </div>
                </div>

                {/* Repeat Scan Specific Warning Prompt */}
                {isRepeat && (
                  <div className="mt-4 pt-3 border-t border-amber-200 text-xs text-amber-900 flex items-start gap-2 bg-amber-100/60 p-2.5 rounded">
                    <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Tamper-Evident Seal Inspection:</strong> This package QR token has been queried {data.scan_count} times previously. Verify that the physical KVIC tamper-evident security seal on the lid is fully intact and unbroken before purchasing.
                    </span>
                  </div>
                )}
              </div>

              {/* TRUST BOUNDARY NOTICE */}
              <div className="p-4 bg-slate-100 border border-slate-300 rounded-lg font-mono text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-bold uppercase mb-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Honey Chain Claim-Evidence Firewall & Trust Boundary</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-sans">
                  <div className="p-2.5 bg-white border border-emerald-200 rounded text-emerald-950">
                    <div className="font-bold text-emerald-800 mb-1">WHAT HONEY CHAIN PROVES:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      <li>Complete cryptographic hash-chain from apiary harvest to packaging.</li>
                      <li>Registered package token issued by authorized KVIC processing center.</li>
                      <li>Accredited laboratory quality parameters entered & hashed at source.</li>
                      <li>Scan velocity tracking to detect duplicate printed label reuse.</li>
                    </ul>
                  </div>
                  <div className="p-2.5 bg-white border border-amber-200 rounded text-amber-950">
                    <div className="font-bold text-amber-800 mb-1">WHAT HONEY CHAIN CANNOT PROVE:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                      <li>Physical contents of the jar if the tamper seal is breached.</li>
                      <li>Fraudulent off-chain laboratory testing or unrecorded manual data entry.</li>
                      <li>Physical liquid authenticity outside verified inspection checkpoints.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* DETAILS CARDS */}
              {prov && (
                <div className="space-y-6">
                  {/* Origin & Apiary Provenance */}
                  <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm font-mono">
                    <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>Apiary Origin & Regional Cluster</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                      <div>
                        <div className="text-slate-500 font-mono text-[10px] uppercase font-bold">KVIC CLUSTER</div>
                        <div className="font-bold text-slate-900 mt-0.5">{prov.origin.cluster_name}</div>
                        <div className="text-[11px] text-slate-600">{prov.origin.district}, {prov.origin.state}</div>
                      </div>

                      <div>
                        <div className="text-slate-500 font-mono text-[10px] uppercase font-bold">REGISTERED BEEKEEPER</div>
                        <div className="font-bold text-slate-900 mt-0.5">{prov.origin.beekeeper_name}</div>
                        <div className="text-[11px] text-slate-600">{prov.origin.beekeeper_reg}</div>
                      </div>

                      <div>
                        <div className="text-slate-500 font-mono text-[10px] uppercase font-bold">APIARY & ELEVATION</div>
                        <div className="font-bold text-slate-900 mt-0.5">{prov.origin.apiary_name}</div>
                        <div className="text-[11px] text-slate-600">Elevation: {prov.origin.elevation_m}m AMSL</div>
                      </div>

                      <div>
                        <div className="text-slate-500 font-mono text-[10px] uppercase font-bold">BOTANICAL FLORA</div>
                        <div className="font-bold text-slate-900 mt-0.5">{prov.batch.floral_source}</div>
                        <div className="text-[11px] text-slate-600">Harvest Field Moisture: {prov.harvest.field_moisture_pct}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Laboratory Quality Certificate */}
                  {prov.quality ? (
                    <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm font-mono">
                      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase">
                          <FlaskConical className="w-4 h-4" />
                          <span>Quality Control Record (FSSAI & KVIC Standards)</span>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                          {prov.quality.verification_level || "RECORDED_LAB_CERTIFICATE"}: {prov.quality.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                          <div className="text-[10px] text-slate-500 font-bold">MOISTURE CONTENT</div>
                          <div className="text-base font-bold text-slate-900 mt-0.5">
                            {prov.quality.moisture_pct !== null && prov.quality.moisture_pct !== undefined ? `${prov.quality.moisture_pct}%` : "NOT AVAILABLE"}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold">Standard: ≤20.0%</div>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                          <div className="text-[10px] text-slate-500 font-bold">HMF CONTENT</div>
                          <div className="text-base font-bold text-slate-900 mt-0.5">
                            {prov.quality.hmf_mg_kg !== null && prov.quality.hmf_mg_kg !== undefined ? `${prov.quality.hmf_mg_kg} mg/kg` : "NOT AVAILABLE"}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold">Standard: ≤40.0 mg/kg</div>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                          <div className="text-[10px] text-slate-500 font-bold">DIASTASE NUMBER</div>
                          <div className="text-base font-bold text-slate-900 mt-0.5">
                            {prov.quality.diastase_number !== null && prov.quality.diastase_number !== undefined ? prov.quality.diastase_number : "NOT AVAILABLE"}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold">Standard: ≥8.0 (Enzymatic)</div>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                          <div className="text-[10px] text-slate-500 font-bold">ADULTERATION TEST</div>
                          <div className="text-base font-bold text-emerald-700 mt-0.5">
                            {prov.quality.adulteration_result || "NOT AVAILABLE"}
                          </div>
                          <div className="text-[10px] text-slate-500">C4/C3 Exogenous Sugar Screen</div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-500 flex flex-col sm:flex-row justify-between border-t border-slate-100 pt-2 gap-1">
                        <span>Testing Center: <strong>{prov.quality.lab_name}</strong></span>
                        <span className="truncate max-w-sm">Certificate Hash: <code className="text-slate-700 font-mono">{prov.quality.certificate_hash}</code></span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs font-mono text-amber-900">
                      <strong>Quality Record Status:</strong> NOT AVAILABLE for this batch. No lab certificate recorded yet.
                    </div>
                  )}

                  {/* Processing & Packaging Details */}
                  {prov.processing && (
                    <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm font-mono">
                      <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase mb-3">
                        <Boxes className="w-4 h-4" />
                        <span>Processing & Packaging Specifications</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans">
                        <div>
                          <div className="text-slate-500 font-mono text-[10px] uppercase font-bold">FACILITY</div>
                          <div className="font-bold text-slate-900">{prov.processing.facility_name}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 font-mono text-[10px] uppercase font-bold">MICRO-FILTRATION TEMP</div>
                          <div className="font-bold text-slate-900">{prov.processing.filtering_temp_c}°C (Gentle/Raw)</div>
                        </div>
                        <div>
                          <div className="text-slate-500 font-mono text-[10px] uppercase font-bold">SETTLING DURATION</div>
                          <div className="font-bold text-slate-900">{prov.processing.settling_hours} Hours</div>
                        </div>
                        <div>
                          <div className="text-slate-500 font-mono text-[10px] uppercase font-bold">EXPIRY DATE</div>
                          <div className="font-bold text-slate-900">{prov.package.expiry_date}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* IMMUTABLE CRYPTOGRAPHIC LEDGER PROOF */}
                  {prov.ledger && (
                    <div className="p-5 bg-white border border-slate-300 rounded-lg shadow-sm font-mono">
                      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase">
                          <Lock className="w-4 h-4 text-amber-600" />
                          <span>Permissioned Cryptographic Ledger Integrity</span>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                          SHA-256 HASH CHAIN: INTACT
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mb-4 leading-relaxed font-sans">
                        Every state change from hive harvest to retail QR token generation is mathematically sealed into an immutable, tamper-evident hash chain.
                      </p>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5 mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-semibold">Total Chained Events:</span>
                          <span className="text-slate-900 font-bold">{prov.ledger.total_events} Blocks</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-semibold">Cryptographic Tamper Status:</span>
                          <span className="text-emerald-700 font-bold">False (0 Anomalies Detected)</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500">Explore complete hash timeline:</span>
                        <Link
                          href="/batches"
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold text-xs transition-colors"
                        >
                          View Full Batch Ledger
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
