"use client";

import { useState } from "react";
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Smartphone,
  BookOpen,
  ExternalLink,
  X,
  FileText,
  Layers,
  FlaskConical,
  Heart,
  Scale,
} from "lucide-react";
import { HONEYCHAIN_CONTRACT_ADDRESS, POLYGON_AMOY_RPC } from "@/lib/constants";

const isLocalChain = POLYGON_AMOY_RPC.includes("127.0.0.1") || POLYGON_AMOY_RPC.includes("localhost");

export default function JudgeEvaluationBrief() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "innovations" | "architecture" | "defense">("overview");

  return (
    <>
      {/* Floating Trigger Button for Judges */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 left-3 sm:bottom-6 sm:left-6 z-40 px-3.5 py-2.5 bg-[#121212] hover:bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 border-2 border-gold"
      >
        <Award className="w-4 h-4 text-gold shrink-0" />
        <span className="hidden sm:inline">SIH 2026 Jury Brief</span>
        <span className="sm:hidden">Jury Brief</span>
        <span className="bg-black text-gold border border-gold/40 font-mono text-[9px] px-1.5 py-0.5">
          SIH26021
        </span>
      </button>

      {/* Full-Screen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#141414] border-2 border-gold max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#F9F8F6]">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/15 bg-[#1A1A1A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold/10 border border-gold flex items-center justify-center text-gold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl serif font-bold text-alabaster">SIH 2026 Executive Evaluation Brief</h2>
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold text-gold border border-gold/40 bg-gold/10">
                      PS SIH26021
                    </span>
                  </div>
                  <p className="text-xs text-warm-grey mt-0.5">
                    HoneyChain by TrueTag · Ministry of MSME / KVIC / National Bee Board
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/50 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-white/15 bg-[#141414] px-6 overflow-x-auto scrollbar-none">
              {[
                { id: "overview", label: "Executive Summary" },
                { id: "innovations", label: "Built vs. Roadmap" },
                { id: "architecture", label: "System Architecture" },
                { id: "defense", label: "Judge Q&A Defense" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-gold text-gold bg-gold/10"
                      : "border-transparent text-warm-grey hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed">
              {/* TAB 1: EXECUTIVE SUMMARY */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="p-4 bg-gold/10 border border-gold/40">
                    <p className="text-xs uppercase font-bold text-gold tracking-wider mb-1">The Problem Statement</p>
                    <p className="text-sm text-alabaster leading-relaxed">
                      Commercial honey adulteration with synthetic C3/C4 corn and rice syrup is a well-documented, widespread problem in Indian retail, caught by NMR spectroscopy testing. Smallholder beekeepers lose fair prices to it, and consumers have no way to verify what they're buying.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg serif font-bold text-alabaster mb-2">What We Built</h3>
                    <p className="text-taupe/80 leading-relaxed mb-4">
                      <strong>HoneyChain by TrueTag</strong> anchors every honey batch's harvest-to-jar journey on-chain, binds a QR code to that record with a tamper-evident cryptographic commitment, and scores purity against FSSAI IS 4941 parameters -- with zero wallet setup or gas fees for the beekeeper.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 bg-[#1A1A1A] border border-white/10">
                      <p className="text-2xl serif font-bold text-gold">2</p>
                      <p className="text-xs text-warm-grey mt-1">Smart Contracts, Deployed &amp; Tested</p>
                    </div>
                    <div className="p-4 bg-[#1A1A1A] border border-white/10">
                      <p className="text-2xl serif font-bold text-emerald-400">0</p>
                      <p className="text-xs text-warm-grey mt-1">Wallet Installs Required (Farmer or Officer)</p>
                    </div>
                    <div className="p-4 bg-[#1A1A1A] border border-white/10">
                      <p className="text-2xl serif font-bold text-alabaster">₹0</p>
                      <p className="text-xs text-warm-grey mt-1">Gas Paid By The Farmer, Ever</p>
                    </div>
                    <div className="p-4 bg-[#1A1A1A] border border-white/10">
                      <p className="text-2xl serif font-bold text-gold-light">2</p>
                      <p className="text-xs text-warm-grey mt-1">Real On-Chain Transactions Per Batch Minted</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BUILT VS ROADMAP -- honest split, not a single "innovations" list */}
              {activeTab === "innovations" && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-3">Built &amp; verifiable in this demo</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#1A1A1A] border border-emerald-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider">
                          <FlaskConical className="w-4 h-4" />
                          <span>Physics-Bounded AI Purity Scoring</span>
                        </div>
                        <p className="text-xs text-taupe/80 leading-relaxed">
                          Models FSSAI IS 4941 laboratory parameters -- moisture, brix, HMF, diastase activity, electrical conductivity, isotope ratio (&delta;13C), C4 sugar %, SMR marker -- to classify a batch's grade.
                        </p>
                      </div>

                      <div className="p-4 bg-[#1A1A1A] border border-emerald-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider">
                          <Layers className="w-4 h-4" />
                          <span>Server-Signed On-Chain Provenance</span>
                        </div>
                        <p className="text-xs text-taupe/80 leading-relaxed">
                          Every harvest, approval, and mint is a real transaction on HoneyChain.sol, role-gated with OpenZeppelin AccessControl. No MetaMask, no browser wallet, anywhere -- every key is held and signed server-side.
                        </p>
                      </div>

                      <div className="p-4 bg-[#1A1A1A] border border-emerald-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider">
                          <ShieldCheck className="w-4 h-4" />
                          <span>Commit-Reveal QR Binding</span>
                        </div>
                        <p className="text-xs text-taupe/80 leading-relaxed">
                          HoneyChainQR.sol locks a cryptographic commitment to each QR token before it's revealed, so nobody -- including someone with database access -- can retroactively repoint a QR to a different batch.
                        </p>
                      </div>

                      <div className="p-4 bg-[#1A1A1A] border border-emerald-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-wider">
                          <Zap className="w-4 h-4" />
                          <span>Zero Gas Fees For The Farmer</span>
                        </div>
                        <p className="text-xs text-taupe/80 leading-relaxed">
                          Each farmer has a real, dedicated on-chain wallet, but never sees a key or pays gas -- the officer wallet automatically tops it up right before it needs to sign.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-3">Designed / prototyped, not wired to production infrastructure yet</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#1A1A1A] border border-amber-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-warm-grey font-bold text-xs uppercase tracking-wider">
                          <Globe className="w-4 h-4" />
                          <span>MadhuKranti / AgriStack Bridge</span>
                        </div>
                        <p className="text-xs text-taupe/80 leading-relaxed">
                          UI mockups for government-registry interoperability exist; no live webhook integration with an actual National Bee Board or AgriStack endpoint.
                        </p>
                      </div>
                      <div className="p-4 bg-[#1A1A1A] border border-amber-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-warm-grey font-bold text-xs uppercase tracking-wider">
                          <Smartphone className="w-4 h-4" />
                          <span>Offline SMS / USSD Verification</span>
                        </div>
                        <p className="text-xs text-taupe/80 leading-relaxed">
                          A working in-browser simulator demonstrates the intended UX (text VERIFY &lt;token&gt;, get a purity result back). No live carrier SMS/USSD gateway is connected.
                        </p>
                      </div>
                      <div className="p-4 bg-[#1A1A1A] border border-amber-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-warm-grey font-bold text-xs uppercase tracking-wider">
                          <ShieldCheck className="w-4 h-4" />
                          <span>NFC Tap Tags &amp; Tamper-Seal PIN</span>
                        </div>
                        <p className="text-xs text-taupe/80 leading-relaxed">
                          HoneyChainQR.sol has tested contract functions for an under-cap secret PIN that permanently "claims" a jar on first open (blocking refill-and-resell). Not yet called from the app -- contract-level only.
                        </p>
                      </div>
                      <div className="p-4 bg-[#1A1A1A] border border-amber-500/20 space-y-2">
                        <div className="flex items-center gap-2 text-warm-grey font-bold text-xs uppercase tracking-wider">
                          <Heart className="w-4 h-4" />
                          <span>Direct UPI Micro-Patronage</span>
                        </div>
                        <p className="text-xs text-taupe/80 leading-relaxed">
                          UI concept for consumers tipping beekeepers via UPI QR. No live payment integration.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SYSTEM ARCHITECTURE */}
              {activeTab === "architecture" && (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 bg-[#0D0D0D] border border-white/10 space-y-2">
                    <p className="text-gold font-bold uppercase">Smart Contract Deployment (this session)</p>
                    <p className="text-taupe/80">
                      Network: {isLocalChain ? "Local Hardhat node (offline demo -- architecture is network-agnostic, redeployed to Polygon Amoy testnet with one env var change)" : "Polygon Amoy Testnet (Chain ID: 80002)"}
                    </p>
                    <p className="text-taupe/80 break-all">HoneyChain.sol: {HONEYCHAIN_CONTRACT_ADDRESS}</p>
                    <p className="text-taupe/80">RPC: {POLYGON_AMOY_RPC}</p>
                    <p className="text-taupe/80">Standards: Custom role-gated registry (OpenZeppelin AccessControl) -- not an ERC-1155/721 token standard.</p>
                  </div>

                  <div className="p-4 bg-[#0D0D0D] border border-white/10 space-y-2">
                    <p className="text-gold font-bold uppercase">Transaction Signing</p>
                    <p className="text-taupe/80">No browser wallet, no MetaMask -- every transaction is signed server-side with a plain EOA (externally-owned account) private key.</p>
                    <p className="text-taupe/80">One officer wallet (admin + field-officer roles); one deterministic wallet per farmer, auto-funded by the officer wallet before it signs.</p>
                    <p className="text-taupe/80">Not a meta-transaction standard (no EIP-2771 relayer, no account abstraction) -- the officer wallet directly pays gas for its own and the farmer's transactions.</p>
                  </div>

                  <div className="p-4 bg-[#0D0D0D] border border-white/10 space-y-2">
                    <p className="text-gold font-bold uppercase">AI &amp; Data Pipeline</p>
                    <p className="text-taupe/80">FastAPI / Python microservice for purity scoring, when configured; graceful fallback otherwise.</p>
                    <p className="text-taupe/80">Batch metadata hashes are deterministic content-addressed placeholders (SHA-256), not pinned to a live IPFS network -- real IPFS pinning (Pinata) is supported but requires an API key not configured in this demo.</p>
                  </div>
                </div>
              )}

              {/* TAB 4: JUDGE DEFENSE */}
              {activeTab === "defense" && (
                <div className="space-y-3">
                  <div className="p-4 bg-[#1A1A1A] border border-white/10 space-y-1">
                    <p className="text-gold font-bold text-xs uppercase">Q: What if a fraudster photocopies a genuine jar's QR code?</p>
                    <p className="text-xs text-taupe/80 leading-relaxed">
                      <strong>A:</strong> The QR itself is bound to its batch via a commit-reveal scheme on HoneyChainQR.sol, so the binding can't be silently repointed. The contract also has tested scan-count and geo-velocity tracking functions designed to flag anomalous repeat/duplicate scans -- currently contract-level and not yet wired into the live scan flow, which we'll say plainly if asked to show it running.
                    </p>
                  </div>

                  <div className="p-4 bg-[#1A1A1A] border border-white/10 space-y-1">
                    <p className="text-gold font-bold text-xs uppercase">Q: How do poor rural beekeepers afford blockchain gas fees?</p>
                    <p className="text-xs text-taupe/80 leading-relaxed">
                      <strong>A:</strong> They pay <strong>zero</strong>, literally never touching a wallet. Each beekeeper has a real on-chain identity (a private key our server derives and holds), and our officer wallet automatically funds it with enough gas right before it needs to sign -- verified live in this demo, not simulated.
                    </p>
                  </div>

                  <div className="p-4 bg-[#1A1A1A] border border-white/10 space-y-1">
                    <p className="text-gold font-bold text-xs uppercase">Q: How would this work in areas with poor connectivity?</p>
                    <p className="text-xs text-taupe/80 leading-relaxed">
                      <strong>A:</strong> We've prototyped the UX for an SMS/USSD verification channel (try the simulator) so a consumer could text a token and get a purity result back without a smartphone app -- but we have not connected a live telecom gateway, and we'll say so directly if asked to demonstrate it working on a real phone number.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/15 bg-[#1A1A1A] flex justify-between items-center text-xs">
              <span className="text-warm-grey">Smart India Hackathon 2026 Grand Finale</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gold hover:bg-gold-light text-charcoal font-bold text-xs uppercase tracking-wider"
              >
                Close Brief
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
