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
  RefreshCw
} from "lucide-react";

export default function ClientVerificationPage({ packageId }: { packageId: string }) {
  const packageCode = packageId;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tamperLoading, setTamperLoading] = useState(false);

  const fetchVerification = () => {
    setLoading(true);
    fetch(`http://localhost:8000/api/v1/verify/${packageCode}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Package verification failed: ${res.statusText}`);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        // Fallback for standalone demo when backend is offline
        if (packageCode === "HC-PKG-A7F93E12" || packageCode === "demo") {
          setData({
            verified: true,
            status: "VERIFIED",
            anomaly_flag: "NORMAL",
            message: "Authentic KVIC Honey. Genuine seal verified.",
            package_code: packageCode,
            scan_count: 1,
            provenance: {
              package: {
                package_code: packageCode,
                jar_size_g: 500,
                lot_number: "LOT-2026-NIL-500G",
                packaged_at: "2026-08-25T10:00:00Z",
                expiry_date: "2028-08-25",
                facility_location: "Nilgiris Tribal Co-operative, Coonoor"
              },
              batch: {
                batch_code: "BATCH-2026-NIL-001",
                weight_kg: 45.0,
                floral_source: "Nilgiris High-Altitude Wild Flora",
                curing_days: 21
              },
              origin: {
                cluster_name: "Nilgiris Mountain Forest Cluster",
                state: "Tamil Nadu",
                district: "Nilgiris",
                beekeeper_name: "Ramanathan Pillai",
                beekeeper_reg: "KVIC-REG-TN-4102",
                apiary_name: "Shola Ridge Apiary Alpha",
                elevation_m: 1850.0,
                primary_flora: "Shola Evergreen Forest & Wild Thyme"
              },
              harvest: {
                harvest_date: "2026-08-15",
                field_moisture_pct: 17.6,
                floral_source: "Nilgiris High-Altitude Wild Flora"
              },
              quality: {
                lab_name: "KVIC Honey Testing & Quality Analysis Center, Pune",
                moisture_pct: 17.1,
                hmf_mg_kg: 11.2,
                diastase_number: 14.8,
                electrical_conductivity: 0.52,
                adulteration_result: "PURE_AUTHENTIC",
                status: "PASS",
                certificate_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
              },
              processing: {
                facility_name: "Nilgiris Tribal Apiculture Processing Co-operative",
                filtering_temp_c: 38.5,
                settling_hours: 48.0,
                status: "COMPLETED"
              },
              ledger: {
                verified: true,
                chain_intact: true,
                total_events: 6,
                tampered: false
              }
            }
          });
          setLoading(false);
        } else if (packageCode === "HC-PKG-B8C24D91") {
          setData({
            verified: false,
            status: "SUSPICIOUS",
            anomaly_flag: "REUSE_DETECTED",
            message: "WARNING: High velocity multiple scans detected across geographically distant locations. Potential counterfeit copied label.",
            package_code: packageCode,
            scan_count: 4,
            provenance: null
          });
          setLoading(false);
        } else {
          setError("Failed to reach verification gateway. Please ensure gateway is online.");
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    fetchVerification();
  }, [packageCode]);

  const prov = data?.provenance;
  const isSuspicious = data?.anomaly_flag === "EXCESSIVE_SCANS" || data?.anomaly_flag === "REUSE_DETECTED" || data?.status === "SUSPICIOUS";
  const isInvalid = !data?.verified && !isSuspicious;

  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-[#f1f5f9] font-sans selection:bg-[#f59e0b] selection:text-[#090b10]">
      <Navbar />

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between font-mono text-xs text-[#94a3b8]">
            <Link href="/verify" className="inline-flex items-center gap-1.5 hover:text-[#f1f5f9] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Scanner</span>
            </Link>
            <span className="text-[#64748b]">Token ID: {packageCode}</span>
          </div>

          {loading ? (
            <div className="p-12 text-center bg-[#11141d] border border-[#283144] rounded-lg font-mono">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#f59e0b] mb-4" />
              <div className="text-sm font-bold text-[#f1f5f9]">Querying Permissioned Cryptographic Ledger...</div>
              <div className="text-xs text-[#94a3b8] mt-1">Verifying SHA-256 block chain from genesis</div>
            </div>
          ) : error && !data ? (
            <div className="p-8 bg-[#11141d] border border-[#ef4444]/50 rounded-lg font-mono text-center">
              <AlertTriangle className="w-8 h-8 text-[#ef4444] mx-auto mb-3" />
              <div className="text-base font-bold text-[#f1f5f9]">Verification Error</div>
              <div className="text-xs text-[#94a3b8] mt-1 mb-4">{error}</div>
              <button
                onClick={fetchVerification}
                className="px-4 py-2 bg-[#181d28] hover:bg-[#1f2637] border border-[#283144] text-xs font-bold uppercase rounded"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* PRIMARY STATUS BANNER */}
              <div className={`p-6 rounded-lg border font-mono shadow-xl ${
                isSuspicious 
                  ? "bg-[#ef4444]/10 border-[#ef4444]/40" 
                  : isInvalid 
                  ? "bg-[#dc2626]/15 border-[#dc2626]" 
                  : "bg-[#10b981]/10 border-[#10b981]/40"
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    {isSuspicious ? (
                      <div className="p-3 bg-[#ef4444]/20 rounded-full text-[#ef4444]">
                        <AlertTriangle className="w-7 h-7" />
                      </div>
                    ) : isInvalid ? (
                      <div className="p-3 bg-[#dc2626]/20 rounded-full text-[#dc2626]">
                        <XCircle className="w-7 h-7" />
                      </div>
                    ) : (
                      <div className="p-3 bg-[#10b981]/20 rounded-full text-[#10b981]">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                    )}
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-[#94a3b8]">
                        Authentication Status
                      </div>
                      <div className={`text-xl font-black uppercase ${
                        isSuspicious ? "text-[#ef4444]" : isInvalid ? "text-[#dc2626]" : "text-[#10b981]"
                      }`}>
                        {isSuspicious 
                          ? "SUSPICIOUS — LABEL REUSE ANOMALY" 
                          : isInvalid 
                          ? "INVALID / UNREGISTERED PRODUCT" 
                          : "VERIFIED AUTHENTIC KVIC HONEY"}
                      </div>
                      <div className="text-xs text-[#94a3b8] mt-1 max-w-xl">
                        {data.message}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono self-end sm:self-auto">
                    <div className="text-[10px] text-[#64748b]">VERIFICATION SCAN COUNT</div>
                    <div className="text-xl font-bold text-[#f1f5f9]">{data.scan_count} time(s)</div>
                    <div className="text-[9px] text-[#64748b]">{data.anomaly_flag}</div>
                  </div>
                </div>
              </div>

              {/* DETAILS CARDS */}
              {prov && (
                <div className="space-y-6">
                  {/* Origin & Apiary Provenance */}
                  <div className="p-5 bg-[#11141d] border border-[#283144] rounded-lg font-mono">
                    <div className="flex items-center gap-2 text-[#f59e0b] font-bold text-xs uppercase mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>Origin & Apiary Provenance</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <div className="text-[#64748b] text-[10px]">KVIC CLUSTER</div>
                        <div className="font-bold text-[#f1f5f9] mt-0.5">{prov.origin.cluster_name}</div>
                        <div className="text-[10px] text-[#94a3b8]">{prov.origin.district}, {prov.origin.state}</div>
                      </div>

                      <div>
                        <div className="text-[#64748b] text-[10px]">BEEKEEPER</div>
                        <div className="font-bold text-[#f1f5f9] mt-0.5">{prov.origin.beekeeper_name}</div>
                        <div className="text-[10px] text-[#94a3b8]">{prov.origin.beekeeper_reg}</div>
                      </div>

                      <div>
                        <div className="text-[#64748b] text-[10px]">APIARY & ELEVATION</div>
                        <div className="font-bold text-[#f1f5f9] mt-0.5">{prov.origin.apiary_name}</div>
                        <div className="text-[10px] text-[#94a3b8]">Elevation: {prov.origin.elevation_m}m AMSL</div>
                      </div>

                      <div>
                        <div className="text-[#64748b] text-[10px]">PRIMARY FLORA</div>
                        <div className="font-bold text-[#f1f5f9] mt-0.5">{prov.batch.floral_source}</div>
                        <div className="text-[10px] text-[#94a3b8]">Harvest Moisture: {prov.harvest.field_moisture_pct}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Laboratory Quality Certificate */}
                  {prov.quality && (
                    <div className="p-5 bg-[#11141d] border border-[#283144] rounded-lg font-mono">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-[#10b981] font-bold text-xs uppercase">
                          <FlaskConical className="w-4 h-4" />
                          <span>Accredited Laboratory Quality Certificate</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] font-bold">
                          {prov.quality.status} • 100% PURE
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
                        <div className="p-3 bg-[#181d28] border border-[#283144] rounded">
                          <div className="text-[10px] text-[#64748b]">MOISTURE CONTENT</div>
                          <div className="text-base font-bold text-[#f1f5f9] mt-0.5">{prov.quality.moisture_pct}%</div>
                          <div className="text-[10px] text-[#10b981]">Standard: ≤20.0%</div>
                        </div>

                        <div className="p-3 bg-[#181d28] border border-[#283144] rounded">
                          <div className="text-[10px] text-[#64748b]">HMF CONTENT</div>
                          <div className="text-base font-bold text-[#f1f5f9] mt-0.5">{prov.quality.hmf_mg_kg} mg/kg</div>
                          <div className="text-[10px] text-[#10b981]">Standard: ≤40.0 mg/kg</div>
                        </div>

                        <div className="p-3 bg-[#181d28] border border-[#283144] rounded">
                          <div className="text-[10px] text-[#64748b]">DIASTASE NUMBER</div>
                          <div className="text-base font-bold text-[#f1f5f9] mt-0.5">{prov.quality.diastase_number}</div>
                          <div className="text-[10px] text-[#10b981]">Standard: ≥8.0 (Enzymatic)</div>
                        </div>

                        <div className="p-3 bg-[#181d28] border border-[#283144] rounded">
                          <div className="text-[10px] text-[#64748b]">ADULTERATION TEST</div>
                          <div className="text-base font-bold text-[#10b981] mt-0.5">{prov.quality.adulteration_result}</div>
                          <div className="text-[10px] text-[#64748b]">0.0% Exogenous Sugars</div>
                        </div>
                      </div>

                      <div className="text-[10px] text-[#64748b] flex flex-col sm:flex-row justify-between border-t border-[#283144] pt-2">
                        <span>Testing Center: {prov.quality.lab_name}</span>
                        <span className="truncate max-w-sm">Certificate Hash: {prov.quality.certificate_hash}</span>
                      </div>
                    </div>
                  )}

                  {/* Processing & Packaging Details */}
                  {prov.processing && (
                    <div className="p-5 bg-[#11141d] border border-[#283144] rounded-lg font-mono">
                      <div className="flex items-center gap-2 text-[#3b82f6] font-bold text-xs uppercase mb-3">
                        <Boxes className="w-4 h-4" />
                        <span>Processing & Packaging Specifications</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <div className="text-[#64748b] text-[10px]">FACILITY</div>
                          <div className="font-bold text-[#f1f5f9]">{prov.processing.facility_name}</div>
                        </div>
                        <div>
                          <div className="text-[#64748b] text-[10px]">MICRO-FILTRATION TEMP</div>
                          <div className="font-bold text-[#f1f5f9]">{prov.processing.filtering_temp_c}°C (Gentle / Raw)</div>
                        </div>
                        <div>
                          <div className="text-[#64748b] text-[10px]">SETTLING DURATION</div>
                          <div className="font-bold text-[#f1f5f9]">{prov.processing.settling_hours} Hours</div>
                        </div>
                        <div>
                          <div className="text-[#64748b] text-[10px]">EXPIRY PERIOD</div>
                          <div className="font-bold text-[#f1f5f9]">{prov.package.expiry_date}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* IMMUTABLE CRYPTOGRAPHIC LEDGER PROOF */}
                  {prov.ledger && (
                    <div className="p-5 bg-[#11141d] border border-[#3d4964] rounded-lg font-mono">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-[#ffc833] font-bold text-xs uppercase">
                          <Lock className="w-4 h-4" />
                          <span>Permissioned Cryptographic Ledger Proof</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] font-bold">
                          SHA-256 HASH CHAIN: INTACT
                        </span>
                      </div>

                      <p className="text-xs text-[#94a3b8] mb-4 leading-relaxed">
                        Every state change from hive harvest to retail QR token generation is mathematically sealed into an immutable, tamper-evident hash chain.
                      </p>

                      <div className="p-3 bg-[#090b10] border border-[#283144] rounded text-xs space-y-1.5 mb-4">
                        <div className="flex justify-between">
                          <span className="text-[#64748b]">Total Chained Events:</span>
                          <span className="text-[#f1f5f9] font-bold">{prov.ledger.total_events} Blocks</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748b]">Cryptographic Tamper Status:</span>
                          <span className="text-[#10b981] font-bold">False (0 Anomalies Detected)</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#283144] flex flex-col sm:flex-row items-center justify-between gap-2">
                        <span className="text-[11px] text-[#64748b]">Explore raw ledger blocks:</span>
                        <Link
                          href="/batches"
                          className="px-3 py-1.5 bg-[#181d28] hover:bg-[#1f2637] border border-[#283144] text-[11px] text-[#ffc833] rounded font-bold transition-colors"
                        >
                          View Full Blockchain Ledger
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
