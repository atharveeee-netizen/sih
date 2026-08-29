# 🍯 HoneyChain — Smart India Hackathon (SIH)
> **Problem Statement 26021 — Ministry of MSME, Coordination Section**  
> *Category: Software · Theme: Smart Automation*  
> **Team: Beevil Knievel**

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg?style=flat-square&logo=solidity)](contracts/src/HoneyProvenance.sol)
[![Hardhat](https://img.shields.io/badge/Hardhat-100%25%20Passing-green.svg?style=flat-square)](contracts/test/HoneyProvenance.test.js)
[![Next.js](https://img.shields.io/badge/Next.js-16%20(App%20Router)-black.svg?style=flat-square&logo=next.js)](frontend/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-yellow.svg?style=flat-square&logo=python)](gateway/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg?style=flat-square)](LICENSE)

---

## 🏛️ Executive Summary

**HoneyChain** is an end-to-end DePIN (Decentralized Physical Infrastructure Network) and Smart Automation platform solving honey adulteration and colony collapse in India's beekeeping sector:

1. **Edge-to-Gateway AI Diagnostics**: Continuous multi-sensor hive telemetry analysis (brood core temperature, humidity, VOC gas, acoustic 8-band FFT) detecting Varroa destructor, foulbrood, queenlessness, and swarming risk.
2. **Blockchain Honey Traceability**: Curing window telemetry is compiled into daily sorted-pair `keccak256` Merkle trees and anchored on-chain with a **2-of-3 multi-oracle quorum**.
3. **Gasless Consumer Verification**: Consumers scan the QR code on the honey jar to view mathematical Merkle proofs and AI colony health reports with **zero crypto wallet required**.
4. **Rural KVIC Scalability**: Software-only onboarding portal (`/kvic-onboard`) and offline-first gateway SQLite queue (`gateway_telemetry.db`) enabling rapid rollout to KVIC cooperative clusters.

---

## 🏗️ 6-Tier System Architecture

```
┌───────────────────────────────────────────────────────────────────────────┐
│ TIER 1 — EDGE SENSOR NODE (nRF52840 + SX1262 LoRa @ 865 MHz)              │
│  TMP117 · SHT45 · BME688 · MEMS Mic · Model V2 Triage (99.8% filter)     │
│  ECDSA-signed 32-byte binary frames (BeevilLoRaPayload)                   │
└──────────────────────────────────┬────────────────────────────────────────┘
                                    │ Signed LoRa Telemetry
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ TIER 2 — GATEWAY FOG AI & MERKLE BUILDER (Raspberry Pi CM4 + Coral TPU)   │
│  1D-CNN Acoustic Disease Classifier (96.4%) · Swarm LSTM (96.0%)          │
│  Autoencoder Fault Detector (89.0%) · keccak256 Merkle Engine             │
│  Offline SQLite Transaction Queue (gateway_telemetry.db)                  │
└──────────────────────────────────┬────────────────────────────────────────┘
                                    │ Opportunistic RPC Sync
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ TIER 3 — BLOCKCHAIN CONSENSUS LAYER (Polygon Amoy / Ethereum Testnet)     │
│  HoneyProvenance.sol (^0.8.20) · 2-of-3 Multi-Oracle Quorum Consensus     │
│  Explicit registered hive ownership · verifyJar sorted-pair Merkle proofs │
└──────────────────────────────────┬────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ TIER 4 — DECENTRALIZED STORAGE                                            │
│  Pinata IPFS + Filecoin redundant pinning for AI diagnostic logs & photos │
└──────────────────────────────────┬────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ TIER 5 — APPLICATION LAYER (Next.js 16 + React 19 + Tailwind CSS)         │
│  • /verify — Gasless Consumer QR Verification (Zero-Wallet Merkle check)  │
│  • /dashboard — Beekeeper Fleet Command Center & Harvest Proposer         │
│  • /kvic-onboard — Rural MSME Cooperative Hive Registration               │
│  • /inspector — Bulk Retailer & QA Export Audit Portal                    │
└──────────────────────────────────┬────────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ TIER 6 — RURAL DEPLOYMENT MODEL (KVIC Apiary Clusters)                    │
│  Shared community gateway (1 per 20 hives) · Software-only onboarding    │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quickstart & Verification

### 1. Smart Contracts & Hardhat Test Suite
```bash
cd contracts
npm install
npx hardhat test
```
*Output: 9/9 passing tests verifying multi-oracle quorum, access control, and sorted-pair Merkle proofs.*

### 2. Python Gateway & AI Engine
```bash
python gateway/test_gateway_suite.py
```
*Output: 7/7 passing tests verifying bit-exact Keccak-256 calculation, AI triage, and SQLite offline queue.*

### 3. Next.js Application Frontend
```bash
cd frontend
npm install
npm run dev
```
*Access the dApp at `http://localhost:3000`:*
- `/verify` — Consumer QR Verification
- `/dashboard` — Beekeeper Fleet Management
- `/kvic-onboard` — KVIC Rural Onboarding
- `/inspector` — Bulk Audit Portal

---

## 📂 Repository Structure

```
sih/
├── contracts/                      # Solidity ^0.8.20 Smart Contracts
│   ├── src/HoneyProvenance.sol     # Multi-oracle DePIN provenance registry
│   ├── test/HoneyProvenance.test.js# Hardhat automated test suite
│   ├── scripts/deploy.js           # Testnet deployment script
│   └── hardhat.config.js           # Hardhat configuration
│
├── gateway/                        # Python 3.10+ Gateway AI & Merkle Suite
│   ├── merkle_builder.py           # Pure-Python Keccak-256 sorted-pair Merkle tree
│   ├── ai_pipeline.py              # Acoustic CNN, Swarm LSTM, Autoencoder suite
│   ├── oracle_bridge.py            # LoRa to Smart Contract bridge
│   ├── sqlite_queue.py             # Offline-first SQLite transaction manager
│   ├── telemetry_simulator.py      # 32-byte LoRa payload stream generator
│   └── test_gateway_suite.py       # Gateway & AI unit test runner
│
├── frontend/                       # Next.js 16 + React 19 dApp
│   ├── src/app/verify/             # Gasless QR verification portal
│   ├── src/app/dashboard/          # Beekeeper command center
│   ├── src/app/kvic-onboard/       # Software-only rural onboarding
│   ├── src/app/inspector/          # Retailer bulk audit portal
│   └── src/lib/merkle.ts           # Pure-TS browser Keccak-256 verifier
│
└── docs/                           # Documentation & Presentation
    ├── HONEYCHAIN_PRD_TRD_REV2.md  # Official PRD & TRD Specification
    └── SIH_PITCH_DECK_26021.md     # Official SIH 7-Slide Pitch & Jury Q&A
```

---

## 👥 Team: Beevil Knievel
- **SIH Problem Statement**: 26021 (Ministry of MSME)
- **Repository**: [https://github.com/atharveeee-netizen/sih](https://github.com/atharveeee-netizen/sih)
- **License**: MIT
