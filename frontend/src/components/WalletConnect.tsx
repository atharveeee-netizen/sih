"use client";

import React from "react";
import {
  Wallet,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ExternalLink,
  LogOut,
  RefreshCw,
} from "lucide-react";
import type { WalletState, WalletRole } from "@/hooks/useWallet";

const ROLE_COLORS: Record<WalletRole, string> = {
  ADMIN:     "bg-purple-500/20 border-purple-500/40 text-purple-300",
  BEEKEEPER: "bg-amber-500/20  border-amber-500/40  text-amber-300",
  GATEWAY:   "bg-blue-500/20   border-blue-500/40   text-blue-300",
  LAB:       "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
  CONSUMER:  "bg-white/10      border-white/20       text-white/60",
};

const ROLE_LABELS: Record<WalletRole, string> = {
  ADMIN:     "Admin",
  BEEKEEPER: "Beekeeper",
  GATEWAY:   "IoT Gateway",
  LAB:       "Certified Lab",
  CONSUMER:  "Consumer",
};

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

interface WalletConnectProps {
  wallet: WalletState;
}

export function WalletConnect({ wallet }: WalletConnectProps) {
  const {
    account,
    role,
    isConnecting,
    isWrongNetwork,
    connect,
    disconnect,
    switchToHardhat,
    error,
  } = wallet;

  const hasMetaMask =
    typeof window !== "undefined" && Boolean(window.ethereum);

  if (!hasMetaMask) {
    return (
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-orange-950/50 border border-orange-500/30 text-orange-300 text-sm font-semibold">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>MetaMask not detected.</span>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-orange-200 transition-colors text-xs font-bold uppercase tracking-wider"
        >
          Install MetaMask
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  if (account && isWrongNetwork) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-3 rounded-2xl bg-red-950/50 border border-red-500/30 text-red-300 text-sm">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Wrong network detected. Switch to Hardhat Localhost (Chain ID 31337).</span>
        </div>
        <button
          onClick={switchToHardhat}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-extrabold uppercase tracking-wider transition-all active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Switch Network
        </button>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 rounded-2xl bg-[#1a1b1d] border border-[#ffc833]/25 shadow-lg">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-9 h-9 rounded-xl bg-[#ffc833]/15 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-4.5 h-4.5 text-[#ffc833]" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              Connect your MetaMask wallet
            </div>
            <div className="text-xs text-white/50 mt-0.5">
              Required to interact with the HoneyChain smart contract on Hardhat Localhost.
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch sm:items-end gap-1 flex-shrink-0 w-full sm:w-auto">
          <button
            onClick={connect}
            disabled={isConnecting}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#ffc833] hover:bg-[#ffd659] text-[#312f28] font-extrabold text-sm uppercase tracking-wider transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#ffc833]/20"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
          {error && (
            <span className="text-[10px] text-red-400 max-w-xs text-right">{error}</span>
          )}
        </div>
      </div>
    );
  }

  const roleStyle = ROLE_COLORS[role];
  const roleLabel = ROLE_LABELS[role];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-5 py-3.5 rounded-2xl bg-[#1a1b1d] border border-emerald-500/25 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
            <Wallet className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1a1b1d] animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Wallet Connected
            </span>
          </div>
          <div className="text-sm font-mono font-bold text-white mt-0.5">
            {truncateAddress(account)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold uppercase tracking-wider ${roleStyle}`}
        >
          <span>{roleLabel}</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs font-mono text-white/50">
          Hardhat :31337
        </div>

        <button
          onClick={disconnect}
          title="Disconnect wallet"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-white/40 text-xs font-bold uppercase tracking-wider transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Disconnect
        </button>
      </div>
    </div>
  );
}
