"use client";

import React, { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WalletConnect } from "@/components/WalletConnect";
import { useWallet } from "@/hooks/useWallet";
import { useHoneyContract, type HoneyBatch } from "@/hooks/useHoneyContract";
import {
  Search,
  QrCode,
  PlusCircle,
  ArrowRightLeft,
  CheckCircle,
  AlertTriangle,
  Shield,
  Database,
  Cpu,
  FileText,
  User,
  Lock,
  Info,
  Layers,
  Check,
  RefreshCw,
  Loader2,
  ExternalLink,
  Hash,
  Activity,
} from "lucide-react";

// ─── Status Message ───────────────────────────────────────────────────────────

interface StatusMsg {
  text: string;
  type: "success" | "error" | "info" | "pending";
  txHash?: `0x${string}`;
}

function StatusBanner({
  msg,
  onDismiss,
}: {
  msg: StatusMsg;
  onDismiss: () => void;
}) {
  const styles = {
    success: "bg-emerald-950/50 border-emerald-500/30 text-emerald-300",
    error: "bg-red-950/50 border-red-500/30 text-red-300",
    info: "bg-blue-950/50 border-blue-500/30 text-blue-300",
    pending: "bg-amber-950/50 border-amber-500/30 text-amber-300",
  };
  const Icon =
    msg.type === "success"
      ? CheckCircle
      : msg.type === "pending"
      ? Loader2
      : Info;

  return (
    <div
      className={`p-4 rounded-2xl border text-sm flex items-start justify-between mb-8 transition-all ${styles[msg.type]}`}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${msg.type === "pending" ? "animate-spin" : ""}`}
        />
        <div>
          <span className="font-medium">{msg.text}</span>
          {msg.txHash && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <Hash className="w-3 h-3 opacity-60" />
              <span className="text-[11px] font-mono opacity-80 break-all">
                {msg.txHash}
              </span>
              <a
                href={`https://hardhat-explorer.local/?tx=${msg.txHash}`}
                className="opacity-50 hover:opacity-80 transition-opacity"
                title="View transaction"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>
      {msg.type !== "pending" && (
        <button
          onClick={onDismiss}
          className="text-xs hover:underline uppercase ml-4 opacity-60 hover:opacity-100 flex-shrink-0"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────

function FieldRow({
  icon: Icon,
  label,
  value,
  mono = false,
  accent = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon
        className={`w-4 h-4 mt-1 flex-shrink-0 ${accent ? "text-[#ffc833]" : "text-white/50"}`}
      />
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-white/40">
          {label}
        </div>
        <div
          className={`mt-0.5 break-all ${mono ? "text-[11px] font-mono" : "text-sm font-bold"} ${accent ? "text-[#ffc833]/80" : "text-white/90"}`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────

function FormInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label className="block text-[10px] uppercase font-bold text-white/50 mb-1.5">
        {label}
      </label>
      <input
        {...props}
        className="w-full bg-black/35 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ffc833] focus:ring-1 focus:ring-[#ffc833]/30 transition-colors placeholder-white/30"
      />
    </div>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function TraceabilityContent() {
  const searchParams = useSearchParams();
  const wallet = useWallet();
  const contract = useHoneyContract({
    publicClient: wallet.publicClient,
    walletClient: wallet.walletClient,
    account: wallet.account,
  });

  // ── UI State ────────────────────────────────────────────────────────────────
  const [searchId, setSearchId] = useState(
    searchParams.get("batchId") ?? ""
  );
  const [selectedBatch, setSelectedBatch] = useState<HoneyBatch | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMsg | null>(null);

  // Create Batch form
  const [newBatchId, setNewBatchId] = useState("");
  const [newProducerId, setNewProducerId] = useState("");
  const [newHiveLocation, setNewHiveLocation] = useState("");
  const [newHarvestDate, setNewHarvestDate] = useState("");
  const [moisture, setMoisture] = useState("17.5");
  const [hmf, setHmf] = useState("12.2");
  const [pollenCount, setPollenCount] = useState("9200");
  const [aiDiagnosis, setAiDiagnosis] = useState("HEALTHY_NORMAL");
  const [aiConfidence, setAiConfidence] = useState("98.5");
  const [isCreating, setIsCreating] = useState(false);

  // Transfer form
  const [transferOwnerAddress, setTransferOwnerAddress] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  // Lab verify
  const [isVerifying, setIsVerifying] = useState(false);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const showStatus = (msg: StatusMsg) => setStatusMessage(msg);

  const refreshBatch = useCallback(
    async (batchId: string) => {
      try {
        const fresh = await contract.getBatch(batchId);
        setSelectedBatch(fresh);
      } catch {
        // Silently ignore refresh errors
      }
    },
    [contract]
  );

  // ── Search ──────────────────────────────────────────────────────────────────

  const handleSearch = useCallback(
    async (id: string) => {
      const cleanedId = id.trim().toUpperCase();
      if (!cleanedId) return;
      setIsSearching(true);
      setStatusMessage(null);
      try {
        const batch = await contract.getBatch(cleanedId);
        setSelectedBatch(batch);
        showStatus({
          text: `On-chain record loaded for Batch ${cleanedId}.`,
          type: "success",
        });
      } catch (err) {
        setSelectedBatch(null);
        const msg = err instanceof Error ? err.message : String(err);
        showStatus({ text: msg, type: "error" });
      } finally {
        setIsSearching(false);
      }
    },
    [contract]
  );

  // Run initial search from query param
  React.useEffect(() => {
    const queryId = searchParams.get("batchId");
    if (queryId) handleSearch(queryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Create Batch ────────────────────────────────────────────────────────────

  const handleRegisterBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected) {
      showStatus({ text: "Please connect your MetaMask wallet first.", type: "error" });
      return;
    }
    if (wallet.role !== "BEEKEEPER" && wallet.role !== "GATEWAY" && wallet.role !== "ADMIN") {
      showStatus({
        text: `Access denied: Your address (${wallet.account}) does not have BEEKEEPER_ROLE or GATEWAY_ROLE on this contract.`,
        type: "error",
      });
      return;
    }

    const cleanId = newBatchId.trim().toUpperCase();
    if (!cleanId) {
      showStatus({ text: "Batch ID cannot be empty.", type: "error" });
      return;
    }

    const harvestDateUnix = newHarvestDate
      ? BigInt(Math.floor(new Date(newHarvestDate).getTime() / 1000))
      : BigInt(Math.floor(Date.now() / 1000));

    setIsCreating(true);
    showStatus({ text: "Awaiting MetaMask confirmation…", type: "pending" });

    try {
      const { txHash, receipt } = await contract.createBatch(
        cleanId,
        newProducerId,
        newHiveLocation,
        harvestDateUnix,
        { moisture, hmf, pollenCount },
        { diagnosis: aiDiagnosis, confidence: aiConfidence }
      );

      showStatus({
        text: `Batch ${cleanId} successfully registered on-chain! Block #${receipt.blockNumber}.`,
        type: "success",
        txHash,
      });

      // Reset form
      setNewBatchId("");
      setNewProducerId("");
      setNewHiveLocation("");
      setNewHarvestDate("");

      // Load the newly created batch
      await refreshBatch(cleanId);
      setSearchId(cleanId);
    } catch (err) {
      showStatus({
        text: err instanceof Error ? err.message : String(err),
        type: "error",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // ── Transfer Ownership ──────────────────────────────────────────────────────

  const handleTransferOwnership = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected || !selectedBatch) return;

    setIsTransferring(true);
    showStatus({ text: "Awaiting MetaMask confirmation…", type: "pending" });

    try {
      const { txHash, receipt } = await contract.transferOwnership(
        selectedBatch.batchId,
        transferOwnerAddress
      );

      showStatus({
        text: `Ownership transferred to ${transferOwnerAddress}. Block #${receipt.blockNumber}.`,
        type: "success",
        txHash,
      });

      setTransferOwnerAddress("");
      await refreshBatch(selectedBatch.batchId);
    } catch (err) {
      showStatus({
        text: err instanceof Error ? err.message : String(err),
        type: "error",
      });
    } finally {
      setIsTransferring(false);
    }
  };

  // ── Verify Batch ────────────────────────────────────────────────────────────

  const handleVerifyBatch = async (isAuthentic: boolean) => {
    if (!wallet.isConnected || !selectedBatch) return;
    if (wallet.role !== "LAB" && wallet.role !== "ADMIN") {
      showStatus({
        text: `Access denied: Your address does not have LAB_ROLE on this contract.`,
        type: "error",
      });
      return;
    }

    setIsVerifying(true);
    showStatus({ text: "Awaiting MetaMask confirmation…", type: "pending" });

    try {
      const { txHash, receipt } = await contract.verifyBatch(
        selectedBatch.batchId,
        isAuthentic
      );

      showStatus({
        text: `Authenticity set to "${isAuthentic ? "Authentic" : "Revoked"}" on-chain. Block #${receipt.blockNumber}.`,
        type: "success",
        txHash,
      });

      await refreshBatch(selectedBatch.batchId);
    } catch (err) {
      showStatus({
        text: err instanceof Error ? err.message : String(err),
        type: "error",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // ── QR Code URL ─────────────────────────────────────────────────────────────

  const qrCodeUrl = selectedBatch
    ? `https://quickchart.io/qr?text=${encodeURIComponent(
        `http://beevil.local/traceability?batchId=${selectedBatch.batchId}`
      )}&size=200&margin=1&dark=312f28&light=ffffff`
    : "";

  const isBusy = isCreating || isTransferring || isVerifying || isSearching;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-[#212223] text-white">
      <Navbar />

      <main className="flex-grow pt-28 pb-16 px-4 max-w-[1400px] mx-auto w-full">

        {/* Banner Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ffc833]/15 border border-[#ffc833]/30 text-[#ffc833] text-xs font-mono font-bold uppercase tracking-wider mb-4 animate-pulse">
            <Shield className="w-3.5 h-3.5" />
            <span>Problem Statement ID 26021: Honey Chain</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-[#ffc833] bg-clip-text text-transparent">
            Honey Batch Traceability Ledger
          </h1>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto text-sm sm:text-base">
            Immutable, blockchain-backed ledger auditing precision honey batches.
            Cross-references RAK WisBlock IoT hive telemetry with TorchScript AI
            diagnostics and laboratory quality metrics.
          </p>
        </div>

        {/* Wallet Connect Banner */}
        <div className="mb-8">
          <WalletConnect wallet={wallet} />
        </div>

        {/* Status Message */}
        {statusMessage && (
          <StatusBanner
            msg={statusMessage}
            onDismiss={() => setStatusMessage(null)}
          />
        )}

        {/* Wrong network guard */}
        {wallet.isWrongNetwork && (
          <div className="mb-8 p-5 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm text-center font-semibold">
            ⚠ You are on the wrong network. Switch to Hardhat Localhost (Chain ID 31337) to use this dApp.
          </div>
        )}

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Search + Batch Details ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Search Card */}
            <div className="bg-[#292b2d]/80 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-[#ffc833]" />
                <span>On-Chain Batch Lookup</span>
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/50" />
                  <input
                    type="text"
                    id="batch-search-input"
                    placeholder="Enter Batch ID (e.g. BATCH-2026-H001)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(searchId)}
                    className="w-full bg-black/30 border border-white/15 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#ffc833] focus:ring-1 focus:ring-[#ffc833]/30 uppercase transition-colors"
                  />
                </div>
                <button
                  id="query-ledger-btn"
                  onClick={() => handleSearch(searchId)}
                  disabled={isSearching}
                  className="bg-white/10 hover:bg-[#ffc833] hover:text-[#312f28] text-white font-extrabold px-6 py-3.5 rounded-2xl transition-all text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Activity className="w-4 h-4" />
                  )}
                  {isSearching ? "Querying…" : "Query Chain"}
                </button>
              </div>

              <p className="mt-3 text-[11px] text-white/35 font-mono">
                Reads directly from <span className="text-[#ffc833]/60">HoneyBatchTraceability.getBatch()</span> on Hardhat Localhost.
              </p>
            </div>

            {/* Batch Detail Card */}
            {selectedBatch ? (
              <div className="bg-[#292b2d]/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
                {/* Glassmorphic accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffc833]/5 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/15 pb-6 mb-6">
                  <div>
                    <span className="text-xs font-mono text-[#ffc833] uppercase font-bold tracking-wider">
                      ON-CHAIN HONEY RECORD
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-mono text-white mt-1 uppercase">
                      {selectedBatch.batchId}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedBatch.isAuthentic ? (
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
                        <CheckCircle className="w-4 h-4" />
                        <span>Certified Authentic</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-extrabold text-xs uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Suspect (Revoked)</span>
                      </div>
                    )}
                    <button
                      onClick={() => refreshBatch(selectedBatch.batchId)}
                      title="Refresh from chain"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <FieldRow
                      icon={User}
                      label="Producer Identity"
                      value={selectedBatch.producerId}
                    />
                    <FieldRow
                      icon={Database}
                      label="Hive Harvest Location"
                      value={selectedBatch.hiveLocation}
                    />
                    <FieldRow
                      icon={FileText}
                      label="Harvest Date"
                      value={new Date(
                        Number(selectedBatch.harvestDate) * 1000
                      ).toLocaleString(undefined, {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    />
                  </div>

                  <div className="space-y-4">
                    <FieldRow
                      icon={Lock}
                      label="Current Owner Address"
                      value={selectedBatch.currentOwner}
                      mono
                      accent
                    />
                    <FieldRow
                      icon={Cpu}
                      label="Quality Hash (keccak256)"
                      value={selectedBatch.qualityMetricsHash}
                      mono
                    />
                    <FieldRow
                      icon={Cpu}
                      label="AI Diagnostics Hash"
                      value={selectedBatch.aiDiagnosticsHash}
                      mono
                      accent
                    />
                  </div>
                </div>

                {/* QR Code */}
                <div className="p-4 bg-black/25 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center gap-6">
                  {qrCodeUrl && (
                    <div className="bg-white p-2 rounded-xl flex-shrink-0 shadow-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrCodeUrl}
                        alt={`QR Code for Batch ${selectedBatch.batchId}`}
                        className="w-32 h-32"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#ffc833] uppercase tracking-wider">
                      <QrCode className="w-4 h-4" />
                      <span>Consumer QR Verification</span>
                    </div>
                    <h4 className="font-extrabold text-sm mt-1">
                      Immutable Traceability Link
                    </h4>
                    <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                      Scan this QR code with any smartphone camera to check this
                      batch&apos;s authentic origin, AI pathology reports, and complete
                      owner handoff audit on our decentralised network.
                    </p>
                    <div className="mt-3">
                      <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-white/60">
                        GET /api/v1/batch/{selectedBatch.batchId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Lab Controls */}
                {(wallet.role === "LAB" || wallet.role === "ADMIN") && (
                  <div className="mt-6 pt-6 border-t border-white/15">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-4.5 h-4.5 text-[#ffc833]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                        Laboratory Quality Auditing Controls
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mb-4 leading-relaxed">
                      As an authorised testing laboratory (<code className="font-mono text-[#ffc833]/70">LAB_ROLE</code>
                      ), you can flag batches which fail chemical sensory tests,
                      contain excess moisture, HMF violations, or fail verification.
                      This calls <code className="font-mono text-[#ffc833]/70">verifyBatch()</code> on-chain.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        id="confirm-authentic-btn"
                        onClick={() => handleVerifyBatch(true)}
                        disabled={selectedBatch.isAuthentic || isVerifying}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all uppercase tracking-wider ${
                          selectedBatch.isAuthentic || isVerifying
                            ? "bg-white/5 text-white/40 border border-white/10 cursor-not-allowed"
                            : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg active:scale-95"
                        }`}
                      >
                        {isVerifying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        <span>Confirm Authenticity</span>
                      </button>
                      <button
                        id="revoke-authentic-btn"
                        onClick={() => handleVerifyBatch(false)}
                        disabled={!selectedBatch.isAuthentic || isVerifying}
                        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all uppercase tracking-wider ${
                          !selectedBatch.isAuthentic || isVerifying
                            ? "bg-white/5 text-white/40 border border-white/10 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-400 text-black shadow-lg active:scale-95"
                        }`}
                      >
                        {isVerifying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                        <span>Revoke (Flag Suspect)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#292b2d]/80 backdrop-blur-md rounded-3xl p-12 border border-white/10 shadow-xl text-center">
                <Database className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-bold">No Batch Selected</h3>
                <p className="text-xs text-white/50 mt-2 max-w-sm mx-auto">
                  Search for a honey batch above or register a new batch using the
                  form. All data is read directly from the blockchain.
                </p>
              </div>
            )}
          </div>

          {/* ── Right: Create Batch + Transfer Ownership ──────────────────── */}
          <div className="space-y-8">

            {/* Create Batch Card */}
            <div className="bg-[#292b2d]/80 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-xl">
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#ffc833]" />
                <span>Register Honey Batch</span>
              </h2>

              <p className="text-xs text-white/50 mb-5 leading-relaxed">
                Calls <code className="font-mono text-[#ffc833]/70">createBatch()</code> on-chain.
                Requires <code className="font-mono text-white/50">BEEKEEPER_ROLE</code> or{" "}
                <code className="font-mono text-white/50">GATEWAY_ROLE</code>.
              </p>

              <form onSubmit={handleRegisterBatch} className="space-y-4">
                <FormInput
                  id="new-batch-id"
                  label="Batch ID (String)"
                  type="text"
                  required
                  placeholder="e.g. BATCH-2026-N100"
                  value={newBatchId}
                  onChange={(e) => setNewBatchId(e.target.value)}
                  style={{ textTransform: "uppercase" }}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    id="new-producer-id"
                    label="Producer ID"
                    type="text"
                    placeholder="e.g. PROD-APIARY-02"
                    value={newProducerId}
                    onChange={(e) => setNewProducerId(e.target.value)}
                  />
                  <FormInput
                    id="new-harvest-date"
                    label="Harvest Date"
                    type="date"
                    value={newHarvestDate}
                    onChange={(e) => setNewHarvestDate(e.target.value)}
                  />
                </div>

                <FormInput
                  id="new-hive-location"
                  label="Hive Location"
                  type="text"
                  placeholder="e.g. Sector B-Row 1"
                  value={newHiveLocation}
                  onChange={(e) => setNewHiveLocation(e.target.value)}
                />

                {/* Quality Params */}
                <div className="p-3 bg-black/20 rounded-2xl border border-white/5">
                  <div className="text-[10px] uppercase font-bold text-[#ffc833] mb-2">
                    Quality Params → keccak256 Hash
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "moisture", label: "Moisture %", value: moisture, set: setMoisture },
                      { id: "hmf", label: "HMF (mg/kg)", value: hmf, set: setHmf },
                      { id: "pollen-count", label: "Pollen Count", value: pollenCount, set: setPollenCount },
                    ].map(({ id, label, value, set }) => (
                      <div key={id}>
                        <label className="block text-[8px] uppercase text-white/40 mb-1">
                          {label}
                        </label>
                        <input
                          id={id}
                          type="number"
                          step="0.1"
                          value={value}
                          onChange={(e) => set(e.target.value)}
                          className="w-full bg-black/35 border border-white/10 rounded-lg p-1.5 text-[10px] text-white focus:outline-none focus:border-[#ffc833]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Params */}
                <div className="p-3 bg-black/20 rounded-2xl border border-white/5">
                  <div className="text-[10px] uppercase font-bold text-[#ffc833] mb-2 font-mono">
                    Edge AI Telemetry → keccak256 Hash
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[8px] uppercase text-white/40 mb-1">
                        Diagnosis
                      </label>
                      <select
                        id="ai-diagnosis"
                        value={aiDiagnosis}
                        onChange={(e) => setAiDiagnosis(e.target.value)}
                        className="w-full bg-black/35 border border-white/10 rounded-lg p-1.5 text-[10px] text-white focus:outline-none focus:border-[#ffc833]"
                      >
                        <option value="HEALTHY_NORMAL">HEALTHY_NORMAL</option>
                        <option value="QUEEN_PRESENT">QUEEN_PRESENT</option>
                        <option value="VARROA_HIGH">VARROA_HIGH</option>
                        <option value="THERMAL_STRESS">THERMAL_STRESS</option>
                        <option value="TAMPER_THEFT">TAMPER_THEFT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase text-white/40 mb-1">
                        Confidence %
                      </label>
                      <input
                        id="ai-confidence"
                        type="number"
                        step="0.1"
                        max="100"
                        value={aiConfidence}
                        onChange={(e) => setAiConfidence(e.target.value)}
                        className="w-full bg-black/35 border border-white/10 rounded-lg p-1.5 text-[10px] text-white focus:outline-none focus:border-[#ffc833]"
                      />
                    </div>
                  </div>
                </div>

                {/* Hash preview */}
                <div className="p-2.5 bg-black/25 rounded-xl border border-white/5 text-[9px] font-mono text-white/30 leading-relaxed break-all">
                  <span className="text-white/50">qualityHash: </span>
                  {/* Show computed hash live */}
                  {moisture && hmf && pollenCount
                    ? `keccak256({"moisture":"${moisture}","hmf":"${hmf}","pollenCount":"${pollenCount}"})`
                    : "—"}
                </div>

                <button
                  id="create-batch-btn"
                  type="submit"
                  disabled={
                    !wallet.isConnected ||
                    (wallet.role !== "BEEKEEPER" &&
                      wallet.role !== "GATEWAY" &&
                      wallet.role !== "ADMIN") ||
                    isCreating ||
                    isBusy
                  }
                  className={`w-full font-extrabold py-3 rounded-2xl transition-all text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 ${
                    wallet.isConnected &&
                    (wallet.role === "BEEKEEPER" ||
                      wallet.role === "GATEWAY" ||
                      wallet.role === "ADMIN") &&
                    !isCreating
                      ? "bg-[#ffc833] hover:bg-[#ffd659] text-[#312f28] active:scale-95"
                      : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
                  }`}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Broadcasting…</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Create Honey Batch</span>
                    </>
                  )}
                </button>

                {!wallet.isConnected && (
                  <p className="text-[10px] text-amber-400 text-center font-semibold mt-1">
                    * Connect MetaMask to register batches on-chain.
                  </p>
                )}
                {wallet.isConnected &&
                  wallet.role !== "BEEKEEPER" &&
                  wallet.role !== "GATEWAY" &&
                  wallet.role !== "ADMIN" && (
                    <p className="text-[10px] text-red-400 text-center font-semibold mt-1">
                      * Locked: Connected address lacks BEEKEEPER_ROLE or GATEWAY_ROLE.
                    </p>
                  )}
              </form>
            </div>

            {/* Transfer Ownership Card */}
            {selectedBatch && (
              <div className="bg-[#292b2d]/80 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-xl">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-[#ffc833]" />
                  <span>Transfer Ownership</span>
                </h2>

                <p className="text-xs text-white/50 mb-4 leading-relaxed">
                  Calls <code className="font-mono text-[#ffc833]/70">transferOwnership()</code> on-chain.
                  Only the current owner address can sign this transaction.
                </p>

                <div className="p-3 bg-black/25 rounded-xl border border-white/5 mb-4">
                  <div className="text-[9px] uppercase text-white/30 font-bold mb-1">
                    Current Owner
                  </div>
                  <div className="text-[10px] font-mono text-[#ffc833]/70 break-all">
                    {selectedBatch.currentOwner}
                  </div>
                </div>

                <form onSubmit={handleTransferOwnership} className="space-y-4">
                  <FormInput
                    id="transfer-owner-address"
                    label="New Owner Address"
                    type="text"
                    required
                    placeholder="0x…"
                    value={transferOwnerAddress}
                    onChange={(e) => setTransferOwnerAddress(e.target.value)}
                    style={{ fontFamily: "monospace" }}
                  />

                  <button
                    id="execute-transfer-btn"
                    type="submit"
                    disabled={!wallet.isConnected || isTransferring || isBusy}
                    className="w-full bg-white/10 hover:bg-[#ffc833] hover:text-[#312f28] text-white font-extrabold py-3 rounded-2xl transition-all text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    {isTransferring ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Broadcasting…</span>
                      </>
                    ) : (
                      <>
                        <ArrowRightLeft className="w-4 h-4" />
                        <span>Execute Handoff</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Contract Info Panel */}
            <div className="bg-[#292b2d]/50 backdrop-blur-md rounded-2xl p-4 border border-white/5">
              <div className="text-[10px] uppercase font-bold text-white/30 mb-3 tracking-wider">
                Live Contract
              </div>
              <div className="space-y-2 text-[10px] font-mono">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/40">Address</span>
                  <span className="text-[#ffc833]/60 break-all text-right">
                    {CONTRACT_ADDRESS.slice(0, 10)}…{CONTRACT_ADDRESS.slice(-8)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/40">Network</span>
                  <span className="text-white/60">Hardhat :31337</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white/40">RPC</span>
                  <span className="text-white/60">127.0.0.1:8545</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Chain Architecture Section */}
        <div className="bg-[#292b2d]/80 backdrop-blur-md rounded-3xl p-6 border border-white/10 mt-12">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-6 h-6 text-[#ffc833]" />
            <h2 className="text-xl font-extrabold text-white">
              Hybrid Multi-Chain Scalability Architecture
            </h2>
          </div>
          <p className="text-xs text-white/60 leading-relaxed mb-4">
            To scale to thousands of hives and national distribution hubs, Beevil
            Knievel employs a dual-tier ledger system:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
              <h3 className="font-bold text-[#ffc833] mb-1 flex items-center gap-1">
                <span>1. Private Consortium Layer</span>
                <span className="px-1.5 py-0.5 rounded bg-[#ffc833]/15 text-[#ffc833] text-[9px] font-mono font-bold uppercase">
                  KVIC + APIARIES
                </span>
              </h3>
              <p className="text-white/50 leading-relaxed">
                Hyperledger Fabric consortium network logs high-frequency raw IoT
                node packets, weight shifts, and intermediate TinyML diagnostic
                metrics. Operated by agricultural organisations (e.g., KVIC) to
                verify yields and automate logistics.
              </p>
            </div>
            <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
              <h3 className="font-bold text-[#ffc833] mb-1 flex items-center gap-1">
                <span>2. Public Layer-2 EVM Layer</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold uppercase">
                  Ethereum L2
                </span>
              </h3>
              <p className="text-white/50 leading-relaxed">
                Deploys this Solidity contract to EVM public testnets/mainnets
                (e.g., Arbitrum/Polygon). Stores only condensed quality hashes and
                AI summaries, enabling consumers to easily verify authenticity with
                zero-setup web extensions.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Need CONTRACT_ADDRESS in the page component — import it
import { CONTRACT_ADDRESS } from "@/lib/contract";

export default function TraceabilityPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#212223] text-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 text-[#ffc833] animate-spin" />
            <span className="text-sm font-semibold tracking-wider uppercase text-white/60">
              Loading Traceability Platform…
            </span>
          </div>
        </div>
      }
    >
      <TraceabilityContent />
    </Suspense>
  );
}
