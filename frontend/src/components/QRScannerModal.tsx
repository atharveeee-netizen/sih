"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  Camera, 
  Upload, 
  Flashlight, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Sparkles,
  Zap,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  Cpu
} from "lucide-react";
import { SAMPLE_BATCHES } from "@/lib/mockData";

export interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan?: (batchId: number) => void;
}

export default function QRScannerModal({
  isOpen,
  onClose,
  onScan
}: QRScannerModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [detectedBatch, setDetectedBatch] = useState<number | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [isRealCamera, setIsRealCamera] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Play synthetic scanner audio beep
  const playScanBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.15); // A6 chirp
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.16);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Attempt real camera stream, fallback gracefully to simulation
  useEffect(() => {
    if (!isOpen || activeTab !== "camera") {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      return;
    }

    let isMounted = true;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: cameraFacing }
          });
          if (isMounted) {
            streamRef.current = stream;
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play().catch(() => {});
            }
            setIsRealCamera(true);
          }
        }
      } catch {
        if (isMounted) {
          setIsRealCamera(false);
        }
      }
    }

    initCamera();

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, activeTab, cameraFacing]);

  // Reset states on open
  useEffect(() => {
    if (isOpen) {
      setDetectedBatch(null);
      setIsScanning(true);
      setScanProgress(0);
      setUploadFile(null);
      setUploadPreview(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTriggerDetection = (batchId: number) => {
    setIsScanning(false);
    setScanProgress(100);
    setDetectedBatch(batchId);
    playScanBeep();

    setTimeout(() => {
      if (onScan) {
        onScan(batchId);
      } else {
        router.push(`/verify/${batchId}`);
      }
      onClose();
    }, 1100);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);
    const objectUrl = URL.createObjectURL(file);
    setUploadPreview(objectUrl);

    // Simulate scanning image upload
    setIsScanning(true);
    setScanProgress(25);

    setTimeout(() => setScanProgress(60), 300);
    setTimeout(() => setScanProgress(90), 600);
    setTimeout(() => {
      // Default to Batch 1 for demo or extract from filename
      const extractedId = file.name.includes("2") ? 2 : file.name.includes("3") ? 3 : 1;
      setScanProgress(100);
      setIsScanning(false);
      setDetectedBatch(extractedId);
      playScanBeep();
    }, 900);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadFile(file);
      const objectUrl = URL.createObjectURL(file);
      setUploadPreview(objectUrl);
      setIsScanning(true);
      setScanProgress(30);
      setTimeout(() => setScanProgress(80), 400);
      setTimeout(() => {
        const extractedId = file.name.includes("2") ? 2 : file.name.includes("3") ? 3 : 1;
        setScanProgress(100);
        setIsScanning(false);
        setDetectedBatch(extractedId);
        playScanBeep();
      }, 800);
    }
  };

  const handleCompleteUploadVerification = () => {
    if (detectedBatch) {
      if (onScan) {
        onScan(detectedBatch);
      } else {
        router.push(`/verify/${detectedBatch}`);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-4">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Cryptographic Jar QR Scanner
                </h3>
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  SIH-26021
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Align the honey jar sticker QR matrix within the viewfinder
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

        {/* Tab Switcher */}
        <div className="px-6 pt-4 pb-2 bg-slate-950/40">
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab("camera")}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl font-semibold transition ${
                activeTab === "camera"
                  ? "bg-amber-500 text-black shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Live Optical Camera</span>
            </button>

            <button
              onClick={() => setActiveTab("upload")}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl font-semibold transition ${
                activeTab === "upload"
                  ? "bg-amber-500 text-black shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Label File</span>
            </button>
          </div>
        </div>

        {/* Modal Main Viewfinder Body */}
        <div className="p-6 space-y-4">
          
          {activeTab === "camera" ? (
            <div className="space-y-4">
              
              {/* Viewfinder Frame Container */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-800 flex items-center justify-center group shadow-2xl">
                
                {/* Real Video Stream or Synthetic Simulation Backdrop */}
                {isRealCamera ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 flex flex-col items-center justify-center p-6 text-center">
                    {/* Simulated honey jar background graphics */}
                    <div className="w-32 h-44 rounded-3xl border-2 border-amber-500/30 bg-amber-500/5 backdrop-blur-sm flex flex-col items-center justify-center p-3 relative shadow-inner">
                      <span className="text-3xl mb-2">🍯</span>
                      <div className="w-16 h-16 rounded-xl bg-white p-1 flex items-center justify-center">
                        <QrCode className="w-12 h-12 text-slate-900" />
                      </div>
                      <span className="text-[9px] font-mono text-amber-300 mt-2 font-bold">BATCH #001</span>
                    </div>
                  </div>
                )}

                {/* Torch / Flashlight overlay effect */}
                {isTorchOn && (
                  <div className="absolute inset-0 bg-white/10 pointer-events-none mix-blend-overlay" />
                )}

                {/* HUD Viewfinder Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                  {/* Top HUD Info */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/30 shadow">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      {isRealCamera ? "CAMERA: 1080P · 60FPS" : "OPTICAL FEED SIMULATOR"}
                    </span>
                    <span className="text-amber-400">ECDSA TRACKING</span>
                  </div>

                  {/* Center Target Box with 4 Corner Brackets */}
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto my-auto flex items-center justify-center">
                    {/* Top-Left Corner */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-xl" />
                    {/* Top-Right Corner */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-xl" />
                    {/* Bottom-Left Corner */}
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-xl" />
                    {/* Bottom-Right Corner */}
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-xl" />

                    {/* Animated Scanning Laser Line */}
                    {isScanning && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#f59e0b] animate-bounce duration-1000" />
                    )}

                    {/* Subtle Crosshair in Center */}
                    <div className="w-8 h-8 border border-amber-400/40 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    </div>
                  </div>

                  {/* Bottom Scan Status */}
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono bg-slate-950/85 backdrop-blur-md text-slate-300 px-3 py-1 rounded-full border border-slate-800 shadow">
                      {isScanning ? (
                        <>
                          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                          <span>Searching for Keccak-256 Merkle Matrix...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">MATCH DETECTED: BATCH #{detectedBatch}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Viewfinder Action Buttons (Torch & Camera Switch) */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                  <button
                    onClick={() => setIsTorchOn(!isTorchOn)}
                    className={`p-2.5 rounded-xl border backdrop-blur-md transition ${
                      isTorchOn 
                        ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20" 
                        : "bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800"
                    }`}
                    title="Toggle Flashlight / Lighting"
                  >
                    <Flashlight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setCameraFacing(prev => prev === "environment" ? "user" : "environment")}
                    className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white hover:bg-slate-800 transition"
                    title="Switch Camera Lens"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Instant Scan Simulation Helper Pills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Simulate Quick Jar QR Scan:
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">Tap to test</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleTriggerDetection(1)}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 hover:bg-amber-500/10 text-left transition group"
                  >
                    <div className="font-mono font-bold text-xs text-amber-400 group-hover:text-amber-300">
                      Batch #001
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">Coorg Cluster</div>
                  </button>

                  <button
                    onClick={() => handleTriggerDetection(2)}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/60 hover:bg-sky-500/10 text-left transition group"
                  >
                    <div className="font-mono font-bold text-xs text-sky-400 group-hover:text-sky-300">
                      Batch #002
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">Nilgiris Tribal</div>
                  </button>

                  <button
                    onClick={() => handleTriggerDetection(3)}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 hover:bg-emerald-500/10 text-left transition group"
                  >
                    <div className="font-mono font-bold text-xs text-emerald-400 group-hover:text-emerald-300">
                      Batch #003
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">Kashmir Valley</div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload File Dropzone */
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative aspect-video w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition ${
                  uploadPreview 
                    ? "border-emerald-500/50 bg-emerald-950/10" 
                    : "border-slate-700 hover:border-amber-500 bg-slate-950/60 hover:bg-slate-950"
                }`}
              >
                <input
                  type="file"
                  accept="image/*,.svg,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />

                {uploadPreview ? (
                  <div className="flex flex-col items-center space-y-3 z-0">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-emerald-500/40 shadow-lg">
                      <img src={uploadPreview} alt="Label Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-emerald-500/10" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white truncate max-w-xs">{uploadFile?.name}</p>
                      <p className="text-[11px] text-emerald-400 font-mono">Image loaded &amp; processed</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 z-0">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Drag &amp; Drop Jar Sticker Image or SVG
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports PNG, JPG, or exported HoneyChain label SVG
                      </p>
                    </div>
                    <span className="inline-block mt-2 text-xs bg-slate-800 text-amber-400 px-3 py-1 rounded-lg border border-slate-700 font-medium">
                      Browse Files
                    </span>
                  </div>
                )}
              </div>

              {/* Upload Progress / Match Result Box */}
              {scanProgress > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-amber-400" />
                      Optical QR Matrix Parsing
                    </span>
                    <span className="font-mono text-emerald-400">{scanProgress}%</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>

                  {detectedBatch && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Detected: Batch #{detectedBatch}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {SAMPLE_BATCHES[detectedBatch]?.clusterName || "KVIC Cluster"}
                        </div>
                      </div>

                      <button
                        onClick={handleCompleteUploadVerification}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition"
                      >
                        <span>Verify On-Chain</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Zero Gas Fee · Instant Client Merkle Verification
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
