"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Cpu, ShieldCheck, Sun, Radio, Activity } from "lucide-react";

export function SystemSection() {
  const [frequencyDial, setFrequencyDial] = useState(220);

  const getAcousticDiagnostic = (freq: number) => {
    if (freq < 200) return { label: "180 Hz — Normal Foraging & Brood Care", state: "Optimal Colony State", badge: "bg-emerald-700 text-white" };
    if (freq < 300) return { label: "250 Hz — Queen Piping & Emergence Pulse", state: "Queen Active / Oviposition", badge: "bg-[#ffc833] text-[#312f28]" };
    if (freq < 500) return { label: "450 Hz — Swarm Imminent (24h Departure Alert)", state: "Pre-Swarm Harmonic Escalation", badge: "bg-amber-600 text-white" };
    return { label: "800+ Hz — Robbing / Aggression Spike", state: "Predator / Wasp Defense Mode", badge: "bg-rose-600 text-white" };
  };

  const currentDiagnostic = getAcousticDiagnostic(frequencyDial);

  return (
    <section id="the_system" className="bg-[#ffc833] text-[#312f28] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t-4 border-[#312f28]/10">
      <div className="max-w-4xl mx-auto space-y-20 sm:space-y-28">
        
        {/* 1. The System */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-[#312f28] text-[#ffc833] px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>16-Sensor Telemetry Fusion</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            The System.
          </h2>

          <p className="text-xl sm:text-2xl leading-relaxed font-medium max-w-3xl">
            Beevil Knievel is familiar in form, but unlike anything ever deployed in apiculture. It has a{" "}
            <strong>16-parameter physical &amp; acoustic sensor fusion array</strong> – capturing ultra-precise brood temperature (±0.08°C), internal relative humidity, VOC volatile organic compounds, and high-frequency hive audio.
          </p>

          {/* Hardware Enclosure Render */}
          <div className="my-10 flex justify-center">
            <div className="relative w-full max-w-2xl h-[320px] sm:h-[420px] rounded-2xl overflow-hidden shadow-lg border border-[#312f28]/10 bg-[#312f28] flex items-center justify-center p-4">
              <Image
                src="/images/hardware/beevil_hardware_node.jpg"
                alt="Beevil Knievel Solar Sensor Node"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500 rounded-xl"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </div>

          <p className="text-xl sm:text-2xl leading-relaxed font-medium max-w-3xl">
            It integrates an on-device TinyML 1D-CNN (3.8 KB SRAM, 8.0 KB Flash) that performs instant edge triage with 99.80% recall – suppressing 91.4% of redundant radio transmissions to deliver over 3.2 years of solar-powered battery autonomy.
          </p>
        </div>

        {/* 2. The Design */}
        <div id="the_design" className="space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-[#312f28] text-[#ffc833] px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Disturbance Non-Invasive Enclosure</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            The Design.
          </h2>

          <p className="text-xl sm:text-2xl leading-relaxed font-medium max-w-3xl">
            Designed for harsh apiary conditions, <strong>Beevil Knievel mounts in 30 seconds</strong> on any Langstroth, Warre, or top-bar hive without disturbing the queen or breaking propolis seals. Its IP67 UV-stabilized enclosure withstands driving storms, winter cluster sub-zero temperatures, and high solar UV.
          </p>

          {/* Operational Apiary Field Installation Photo */}
          <div className="my-10 flex justify-center">
            <div className="relative w-full max-w-2xl h-[340px] sm:h-[460px] rounded-2xl overflow-hidden shadow-xl border border-[#312f28]/10 bg-[#312f28] flex items-center justify-center">
              <Image
                src="/images/hardware/beevil_hero_apiary.jpg"
                alt="Beevil Knievel active apiary field deployment"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500 rounded-xl"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </div>
        </div>

        {/* 3. The Acoustic Ear */}
        <div id="the_crank" className="space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-[#312f28] text-[#ffc833] px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase">
            <Activity className="w-3.5 h-3.5" />
            <span>Digital MEMS Acoustic Ear</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            The Acoustic Ear.
          </h2>

          <p className="text-xl sm:text-2xl leading-relaxed font-medium max-w-3xl">
            Why listen to the hive? Because acoustic frequency shifts occur up to 24 hours before visual symptoms emerge.{" "}
            <strong>Our high-bandwidth acoustic analyzer samples from 100 Hz to 6,000 Hz</strong>, detecting queen emergence piping, Varroa distress buzzes, and pre-swarm harmonic escalation in real time.
          </p>

          {/* Interactive Acoustic Frequency Tuner */}
          <div className="bg-[#312f28] text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-black/20">
            <div className="space-y-2 text-center md:text-left">
              <div className="text-xs font-mono uppercase tracking-widest text-[#ffc833]">
                Live Hive Audio Spectrogram Simulator
              </div>
              <h3 className="text-2xl font-extrabold">{currentDiagnostic.label}</h3>
              <p className="text-sm text-[#b1afa8] max-w-md">
                State: <span className="font-bold text-white">{currentDiagnostic.state}</span>
              </p>
              <div className="pt-2">
                <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-full ${currentDiagnostic.badge}`}>
                  AI Diagnosis Active
                </span>
              </div>
            </div>

            {/* Interactive Frequency Slider / Dial */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-28 h-28 bg-[#212223] rounded-full border-4 border-[#ffc833] flex items-center justify-center shadow-inner select-none cursor-pointer group">
                <input
                  type="range"
                  min="150"
                  max="900"
                  step="10"
                  value={frequencyDial}
                  onChange={(e) => setFrequencyDial(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-ew-resize z-20"
                />
                <div
                  className="w-full h-full rounded-full flex items-center justify-center transition-transform duration-75"
                  style={{ transform: `rotate(${(frequencyDial - 150) * 0.48}deg)` }}
                >
                  <div className="absolute top-2 w-4 h-4 rounded-full bg-[#ffc833] border-2 border-[#312f28] shadow-md group-hover:scale-125 transition-transform" />
                  <div className="w-1.5 h-12 bg-gray-400 rounded-full" />
                </div>
              </div>
              <span className="font-mono text-xs text-[#ffc833] font-bold">
                Tuned Frequency: {frequencyDial} Hz
              </span>
            </div>
          </div>
        </div>

        {/* 4. Complete Cyber-Physical System Flowchart */}
        <div id="system_flowchart" className="space-y-6 pt-6 border-t-2 border-[#312f28]/15">
          <div className="inline-flex items-center gap-1.5 bg-[#312f28] text-[#ffc833] px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase">
            <Radio className="w-3.5 h-3.5" />
            <span>End-to-End Cyber-Physical Architecture</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            The Flowchart.
          </h2>

          <p className="text-lg sm:text-xl leading-relaxed font-medium max-w-3xl">
            From the microscopic acoustic vibrations of the queen to gasless consumer verification on a supermarket smartphone, here is the complete 5-stage cyber-physical flow:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-4">
            {/* Step 1 */}
            <div className="bg-[#312f28] text-white p-5 rounded-2xl border border-black/20 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold text-[#ffc833] uppercase tracking-wider">Step 01</div>
                <h4 className="text-base font-extrabold text-white">In-Hive Node</h4>
                <p className="text-xs text-[#b1afa8] leading-relaxed">
                  Sensirion SHT45 + MEMS Mic + HX711 Load Cell sample every 15 min in the 9.5mm bee space.
                </p>
              </div>
              <div className="text-[10px] font-mono bg-black/40 text-emerald-400 px-2.5 py-1 rounded-lg">
                nRF52840 MCU
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#312f28] text-white p-5 rounded-2xl border border-black/20 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold text-[#ffc833] uppercase tracking-wider">Step 02</div>
                <h4 className="text-base font-extrabold text-white">LoRa Gateway</h4>
                <p className="text-xs text-[#b1afa8] leading-relaxed">
                  Raspberry Pi Hub receives 5km radio frames. Buffers in offline SQLite if 4G drops.
                </p>
              </div>
              <div className="text-[10px] font-mono bg-black/40 text-cyan-400 px-2.5 py-1 rounded-lg">
                1 Hub : 20 Hives
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#312f28] text-white p-5 rounded-2xl border border-black/20 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold text-[#ffc833] uppercase tracking-wider">Step 03</div>
                <h4 className="text-base font-extrabold text-white">5-Tier AI Engine</h4>
                <p className="text-xs text-[#b1afa8] leading-relaxed">
                  1D-CNN checks Varroa (96.4%), LSTM forecasts Swarms (24h), Autoencoder checks tamper.
                </p>
              </div>
              <div className="text-[10px] font-mono bg-black/40 text-[#ffc833] px-2.5 py-1 rounded-lg">
                Zenodo 10k-hr AI
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#312f28] text-white p-5 rounded-2xl border border-black/20 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold text-[#ffc833] uppercase tracking-wider">Step 04</div>
                <h4 className="text-base font-extrabold text-white">Merkle Tree</h4>
                <p className="text-xs text-[#b1afa8] leading-relaxed">
                  Compresses 504 hourly frames into 32-byte Keccak-256 root. 2-of-3 Oracle Quorum signs on Polygon.
                </p>
              </div>
              <div className="text-[10px] font-mono bg-black/40 text-purple-300 px-2.5 py-1 rounded-lg">
                99.9% Gas Reduction
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-[#312f28] text-white p-5 rounded-2xl border border-black/20 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-bold text-[#ffc833] uppercase tracking-wider">Step 05</div>
                <h4 className="text-base font-extrabold text-white">Consumer QR</h4>
                <p className="text-xs text-[#b1afa8] leading-relaxed">
                  Shopper scans jar label $\to$ browser evaluates proof in &lt;5ms with zero crypto wallet.
                </p>
              </div>
              <div className="text-[10px] font-mono bg-black/40 text-emerald-400 px-2.5 py-1 rounded-lg">
                100% Gasless Scan
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
