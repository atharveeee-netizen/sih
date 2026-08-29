"use client";

import React, { useState, useRef, useMemo } from "react";
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  Info,
  Layers,
  FileCheck,
  Eye
} from "lucide-react";
import { encodeQrToMatrix, matrixToSvgPath } from "@/lib/qrSvg";

export interface JarLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchId?: number;
  hiveId?: number;
  clusterName?: string;
  moisturePct?: number;
  isSelfDeclared?: boolean;
  merkleRoot?: string;
  contractAddress?: string;
}

export default function JarLabelModal({
  isOpen,
  onClose,
  batchId = 1,
  hiveId = 42,
  clusterName = "KVIC Coorg Cluster · Yard Alpha",
  moisturePct = 17.4,
  isSelfDeclared = true,
  merkleRoot = "0x7f4e92a18b56012c49d84e3650221379e49c7199fa68e2195f128e4692751f0b",
  contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
}: JarLabelModalProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [labelTheme, setLabelTheme] = useState<"heritage-gold" | "modern-depin" | "emerald-pure">("heritage-gold");
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Generate dynamic QR matrix pointing to verification URL
  const verifyUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/verify/${batchId}` 
    : `https://honeychain.org/verify/${batchId}`;

  const qrPath = useMemo(() => {
    const matrix = encodeQrToMatrix(verifyUrl);
    return matrixToSvgPath(matrix, 160, 2);
  }, [verifyUrl]);

  if (!isOpen) return null;

  const handleCopyMerkle = () => {
    navigator.clipboard.writeText(merkleRoot);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `honeychain-jar-label-batch-${batchId}-hive-${hiveId}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const handlePrint = () => {
    if (!svgRef.current) return;
    const svgHtml = svgRef.current.outerHTML;
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Honey Jar Sticker - Batch #${batchId}</title>
          <style>
            @page {
              size: auto;
              margin: 10mm;
            }
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background-color: #ffffff;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .label-wrapper {
              width: 100%;
              max-width: 680px;
              text-align: center;
            }
            svg {
              width: 100%;
              height: auto;
              filter: drop-shadow(0 2px 8px rgba(0,0,0,0.15));
            }
            .print-guide {
              margin-top: 15px;
              font-size: 11px;
              color: #64748b;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="label-wrapper">
            ${svgHtml}
            <div class="print-guide">
              HoneyChain SIH-26021 Authenticated Food Safety Sticker · High-Resolution 300 DPI Vector Output
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Color schemes for SVG sticker
  const themeStyles = {
    "heritage-gold": {
      bgGradStart: "#1a1306",
      bgGradMid: "#0d0a04",
      bgGradEnd: "#171005",
      borderGradStart: "#f59e0b",
      borderGradMid: "#fbbf24",
      borderGradEnd: "#b45309",
      accentGold: "#fbbf24",
      tagBg: "#342407",
      tagText: "#fef08a",
      qrBg: "#ffffff",
      qrColor: "#171005"
    },
    "modern-depin": {
      bgGradStart: "#030712",
      bgGradMid: "#0b1329",
      bgGradEnd: "#020617",
      borderGradStart: "#38bdf8",
      borderGradMid: "#818cf8",
      borderGradEnd: "#0284c7",
      accentGold: "#38bdf8",
      tagBg: "#0f172a",
      tagText: "#7dd3fc",
      qrBg: "#ffffff",
      qrColor: "#020617"
    },
    "emerald-pure": {
      bgGradStart: "#022c22",
      bgGradMid: "#061f18",
      bgGradEnd: "#022c22",
      borderGradStart: "#34d399",
      borderGradMid: "#10b981",
      borderGradEnd: "#059669",
      accentGold: "#34d399",
      tagBg: "#064e3b",
      tagText: "#a7f3d0",
      qrBg: "#ffffff",
      qrColor: "#022c22"
    }
  }[labelTheme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  High-Resolution Honey Jar Sticker Generator
                </h3>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  PRINT-READY VECTOR SVG
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official SIH-26021 On-Chain Food Safety &amp; Hive Provenance Label
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Controls Bar: Theme Selector & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Sticker Theme:</span>
              <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
                <button
                  onClick={() => setLabelTheme("heritage-gold")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    labelTheme === "heritage-gold"
                      ? "bg-amber-500 text-black font-semibold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🍯 Heritage Gold Foil
                </button>
                <button
                  onClick={() => setLabelTheme("modern-depin")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    labelTheme === "modern-depin"
                      ? "bg-sky-500 text-black font-semibold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ⚡ DePIN Cryptographic
                </button>
                <button
                  onClick={() => setLabelTheme("emerald-pure")}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    labelTheme === "emerald-pure"
                      ? "bg-emerald-500 text-black font-semibold shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🌿 Organic Wild
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold shadow transition"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Sticker</span>
              </button>

              <button
                onClick={handleDownloadSvg}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Label SVG</span>
              </button>
            </div>
          </div>

          {/* Sticker SVG Visual Canvas */}
          <div className="bg-slate-950/90 p-4 sm:p-8 rounded-3xl border border-slate-800/80 flex flex-col items-center justify-center relative shadow-inner overflow-x-auto">
            
            {/* Ambient Backlight Glow */}
            <div className="absolute w-96 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* High-Resolution Standalone SVG Honey Jar Sticker */}
            <svg
              ref={svgRef}
              viewBox="0 0 760 380"
              width="100%"
              className="max-w-[700px] h-auto drop-shadow-2xl rounded-2xl select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Background Gradient */}
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={themeStyles.bgGradStart} />
                  <stop offset="50%" stopColor={themeStyles.bgGradMid} />
                  <stop offset="100%" stopColor={themeStyles.bgGradEnd} />
                </linearGradient>

                {/* Metallic Border Gradient */}
                <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={themeStyles.borderGradStart} />
                  <stop offset="25%" stopColor={themeStyles.borderGradMid} />
                  <stop offset="50%" stopColor="#fffbeb" />
                  <stop offset="75%" stopColor={themeStyles.borderGradMid} />
                  <stop offset="100%" stopColor={themeStyles.borderGradEnd} />
                </linearGradient>

                {/* Holographic Iridescent Shimmer */}
                <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff0080" stopOpacity="0.85" />
                  <stop offset="20%" stopColor="#7928ca" stopOpacity="0.8" />
                  <stop offset="40%" stopColor="#0070f3" stopOpacity="0.85" />
                  <stop offset="60%" stopColor="#00dfd8" stopOpacity="0.8" />
                  <stop offset="80%" stopColor="#7928ca" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#ff4d4d" stopOpacity="0.9" />
                </linearGradient>

                {/* Metallic Gold Text Fill */}
                <linearGradient id="goldText" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="60%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>

                {/* Honeycomb Pattern */}
                <pattern id="honeycombPattern" x="0" y="0" width="28" height="48.5" patternUnits="userSpaceOnUse">
                  <path
                    d="M 14 0 L 28 8.08 L 28 24.25 L 14 32.33 L 0 24.25 L 0 8.08 Z M 14 48.5 L 28 40.42 L 28 24.25 L 14 16.17 L 0 24.25 L 0 40.42 Z"
                    fill="none"
                    stroke={themeStyles.borderGradMid}
                    strokeWidth="0.6"
                    strokeOpacity="0.12"
                  />
                </pattern>

                {/* Security Guilloche Rosette Filter */}
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Base Outer Sticker Container */}
              <rect
                x="6"
                y="6"
                width="748"
                height="368"
                rx="24"
                fill="url(#bgGrad)"
                stroke="url(#borderGrad)"
                strokeWidth="3.5"
              />

              {/* Honeycomb Watermark Pattern */}
              <rect
                x="10"
                y="10"
                width="740"
                height="360"
                rx="20"
                fill="url(#honeycombPattern)"
              />

              {/* Inner Fine Security Guilloche Border */}
              <rect
                x="16"
                y="16"
                width="728"
                height="348"
                rx="16"
                fill="none"
                stroke="url(#borderGrad)"
                strokeWidth="1"
                strokeDasharray="4 2"
                strokeOpacity="0.7"
              />

              {/* ================= HEADER SECTION ================= */}
              {/* Top Banner Bar */}
              <g transform="translate(30, 26)">
                {/* Honeycomb Icon Emblem */}
                <circle cx="20" cy="18" r="16" fill={themeStyles.tagBg} stroke={themeStyles.borderGradMid} strokeWidth="1.5" />
                <text x="20" y="24" textAnchor="middle" fontSize="18">🍯</text>

                {/* Brand & Cluster Title */}
                <text x="46" y="16" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="17" fill="url(#goldText)" letterSpacing="1.2">
                  HONEYCHAIN · PURE UNADULTERATED RAW HONEY
                </text>
                <text x="46" y="30" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="600" fontSize="10.5" fill="#94a3b8" letterSpacing="0.8">
                  {clusterName.toUpperCase()} · SIH PROBLEM STATEMENT 26021
                </text>

                {/* Certified Badge Top Right */}
                <rect x="520" y="3" width="168" height="26" rx="8" fill={themeStyles.tagBg} stroke={themeStyles.borderGradMid} strokeWidth="1" />
                <text x="604" y="20" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10" fill={themeStyles.tagText} letterSpacing="0.5">
                  ★ KVIC CO-SIGNED SEAL ★
                </text>
              </g>

              {/* Header Divider */}
              <line x1="30" y1="72" x2="730" y2="72" stroke="url(#borderGrad)" strokeWidth="1" strokeOpacity="0.4" />

              {/* ================= CENTER MAIN GRID ================= */}
              
              {/* Left Column: Batch & Hive Identification */}
              <g transform="translate(32, 86)">
                {/* Batch ID Pill */}
                <rect x="0" y="0" width="140" height="34" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
                <text x="14" y="22" fontFamily="monospace" fontWeight="800" fontSize="14" fill="#38bdf8">
                  BATCH #{batchId.toString().padStart(3, "0")}
                </text>

                {/* Hive ID Pill */}
                <rect x="150" y="0" width="130" height="34" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />
                <text x="164" y="22" fontFamily="monospace" fontWeight="800" fontSize="14" fill="#fbbf24">
                  HIVE #{hiveId.toString().padStart(3, "0")}
                </text>

                {/* Moisture Content Metric Box */}
                <g transform="translate(0, 44)">
                  <rect x="0" y="0" width="280" height="66" rx="10" fill="#090d16" stroke="#1e293b" strokeWidth="1" />
                  
                  <text x="14" y="22" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="11" fill="#94a3b8">
                    HONEY MOISTURE AT EXTRACTION
                  </text>

                  <text x="14" y="48" fontFamily="monospace" fontWeight="900" fontSize="22" fill="#10b981">
                    {moisturePct.toFixed(1)}%
                  </text>

                  <text x="96" y="44" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="9.5" fill="#f59e0b">
                    {isSelfDeclared ? "⚠️ Self-Declared Field Entry" : "✓ Dual-Refractometer Verified"}
                  </text>
                  <text x="96" y="56" fontFamily="system-ui, sans-serif" fontWeight="500" fontSize="8.5" fill="#64748b">
                    FSSAI Max Limit: 20.0% · Optimal Viscosity
                  </text>
                </g>

                {/* Consensus & AI Status Tag */}
                <g transform="translate(0, 118)">
                  <rect x="0" y="0" width="280" height="32" rx="8" fill={themeStyles.tagBg} stroke={themeStyles.borderGradMid} strokeWidth="0.8" />
                  <circle cx="16" cy="16" r="4" fill="#10b981" />
                  <text x="28" y="20" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={themeStyles.tagText}>
                    2-OF-3 ORACLE QUORUM SIGNED (IN865 LoRa)
                  </text>
                </g>
              </g>

              {/* Center Column: Verified Purity Hologram Stamp */}
              <g transform="translate(332, 90)">
                {/* Hologram Circle Outer Glow */}
                <circle cx="68" cy="68" r="62" fill="url(#holoGrad)" filter="url(#softGlow)" opacity="0.9" />
                <circle cx="68" cy="68" r="56" fill="#000000" opacity="0.35" />
                <circle cx="68" cy="68" r="54" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.85" />
                
                {/* Hologram Core Emblem */}
                <circle cx="68" cy="68" r="44" fill="url(#holoGrad)" opacity="0.6" />
                
                {/* Holographic Security Text */}
                <path
                  id="holoTextPath"
                  d="M 28 68 A 40 40 0 1 1 108 68 A 40 40 0 1 1 28 68"
                  fill="none"
                />
                <text fontSize="7.5" fontFamily="monospace" fontWeight="800" fill="#ffffff" letterSpacing="1">
                  <textPath href="#holoTextPath" startOffset="5%">
                    ★ VERIFIED PURITY ★ ZERO SUGAR SYRUP ★
                  </textPath>
                </text>

                {/* Center Hologram Shield Icon */}
                <g transform="translate(54, 52)">
                  <path
                    d="M14 0 L26 5 L26 15 C26 23 14 30 14 30 C14 30 2 23 2 15 L2 5 Z"
                    fill="#ffffff"
                    opacity="0.95"
                  />
                  <path
                    d="M10 14 L13 17 L19 10"
                    fill="none"
                    stroke="#047857"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>

                <text x="68" y="148" textAnchor="middle" fontFamily="monospace" fontWeight="800" fontSize="8" fill="#e2e8f0" letterSpacing="0.8">
                  HOLOGRAM SECURITY SEAL
                </text>
              </g>

              {/* Right Column: Dynamic SVG QR Code + Scan Prompt */}
              <g transform="translate(510, 84)">
                {/* QR Code Background Card */}
                <rect x="0" y="0" width="190" height="190" rx="14" fill={themeStyles.qrBg} stroke="url(#borderGrad)" strokeWidth="2" />
                
                {/* Crisp Vector QR Code Path */}
                <g transform="translate(15, 10)">
                  <path
                    d={qrPath}
                    fill={themeStyles.qrColor}
                    shapeRendering="crispEdges"
                  />
                </g>

                {/* Scan Label Bar */}
                <rect x="10" y="160" width="170" height="22" rx="6" fill={themeStyles.bgGradStart} />
                <text x="95" y="174" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="8.5" fill="#fef08a" letterSpacing="0.6">
                  SCAN TO VERIFY TELEMETRY
                </text>
              </g>

              {/* ================= FOOTER / SECURITY MERKLE BAR ================= */}
              <line x1="30" y1="288" x2="730" y2="288" stroke="url(#borderGrad)" strokeWidth="1" strokeOpacity="0.4" />

              <g transform="translate(30, 298)">
                {/* Keccak-256 Merkle Root String */}
                <text x="0" y="12" fontFamily="system-ui, sans-serif" fontWeight="700" fontSize="9.5" fill="#94a3b8">
                  KECCAK-256 MERKLE ROOT:
                </text>
                <text x="145" y="12" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill="#10b981" letterSpacing="0.4">
                  {merkleRoot}
                </text>

                {/* Smart Contract & Polygon Amoy Chain Info */}
                <text x="0" y="28" fontFamily="system-ui, sans-serif" fontWeight="600" fontSize="8.5" fill="#64748b">
                  SMART CONTRACT: <tspan fontFamily="monospace" fill="#cbd5e1">{contractAddress}</tspan> · CHAIN: <tspan fill="#a855f7">POLYGON AMOY (TESTNET)</tspan>
                </text>

                {/* Security Microprint Line */}
                <text x="0" y="44" fontFamily="monospace" fontWeight="500" fontSize="7" fill="#475569" letterSpacing="0.8">
                  SECURE CRYPTOGRAPHIC ATTESTATION · NO REHYDRATION DETECTED · NORDIC nRF52840 ECDSA HARDWARE SIGNATURE VALIDATED
                </text>
              </g>

              {/* Outer Corner Crop Marks (Print Guide) */}
              <g stroke="#cbd5e1" strokeWidth="1" strokeOpacity="0.5">
                <line x1="0" y1="16" x2="12" y2="16" />
                <line x1="16" y1="0" x2="16" y2="12" />
                <line x1="748" y1="16" x2="760" y2="16" />
                <line x1="744" y1="0" x2="744" y2="12" />
                <line x1="0" y1="364" x2="12" y2="364" />
                <line x1="16" y1="368" x2="16" y2="380" />
                <line x1="748" y1="364" x2="760" y2="364" />
                <line x1="744" y1="368" x2="744" y2="380" />
              </g>
            </svg>
          </div>

          {/* Details & Copy Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="space-y-1.5">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>On-Chain Merkle Provenance Anchor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-mono text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 truncate flex-grow">
                  {merkleRoot}
                </div>
                <button
                  onClick={handleCopyMerkle}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition shrink-0"
                  title="Copy Merkle Root"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Consumer Direct Scan Target</span>
              </div>
              <div className="font-mono text-[11px] text-emerald-400 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 truncate">
                {verifyUrl}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            Sticker Dimensions: 4.0&quot; × 2.0&quot; Standard Jar Wrap (300 DPI Vector)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
