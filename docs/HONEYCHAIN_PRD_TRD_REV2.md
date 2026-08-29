# 📜 FINAL PRD & TRD: HONEYCHAIN
> **Product & Technical Requirements Specification — Revision 2 (Corrected)**
> **Problem Statement 26021 — Ministry of MSME, Coordination Section**
> *Category: Software · Theme: Smart Automation*
> Team: Beevil Knievel

---

## 📝 Revision Notes — What Changed From v1 and Why

| Issue in v1 | Fix in this revision |
|---|---|
| PRD described a blockchain product that didn't exist in the codebase; the actual repo (edge-AI disease/pathology stack) wasn't reflected in the PRD at all | This revision merges the **real, already-built AI-IoT disease detection stack** (TinyML triage, acoustic CNN, swarm LSTM, autoencoder) with a **corrected** blockchain provenance layer |
| Off-chain Merkle tree used SHA-256, on-chain contract used keccak256 — proofs would never verify | Standardized on **keccak256** end-to-end |
| `apiaryOwner = tx.origin` — phishing-vulnerable anti-pattern | Explicit **hive registration mapping**, ownership set once at onboarding |
| Single trusted oracle address — centralization / single point of failure | **Multi-oracle (2-of-3) attestation** before a batch is finalized |
| Hive air humidity was conflated with honey moisture content | Explicitly separated: humidity is a **hive-health signal**, moisture-at-extraction is a **separate roadmap sensor**, current MVP flags it as **self-declared pending hardware** |
| Zero AI/ML despite the problem statement explicitly requiring disease detection, health tracking, productivity prediction | AI is now the **core P0 deliverable**, not an afterthought |
| No rural/KVIC scalability plan | Added as a first-class requirement with an offline-first, low-hardware-cost onboarding path |
| Hardware-heavy pitch for a "Software" category problem statement | Physical node is treated as an **already-built, optional peripheral**; the submission leads with software (AI models, smart contract, dashboard, APIs) |
| Decorative Playdate/1-bit dither theme risked reading as unserious to a ministry panel | De-scoped to **P2 polish**, replaced with a clean, accessible, low-bandwidth UI as the P0 default |

---

# 📋 PART 1: PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. 🎯 Executive Summary

**HoneyChain** is a software platform that gives every jar of honey a verifiable digital identity, built on two pillars that already exist as working engineering assets for this team:

1. **Edge-to-gateway AI** that continuously reads hive telemetry (temperature, humidity, gas/VOC, acoustic signature) and detects disease, colony stress, and swarming risk *before* it costs a beekeeper their hive — directly answering the ministry's "AI-IoT disease detection, colony health tracking, productivity prediction" requirement.
2. **Blockchain-anchored harvest provenance**, where a cryptographic summary of each hive's health and curing history is committed on-chain, and consumers verify it via a QR code on the jar — answering the "block chain-based honey traceability" requirement.

The platform is designed to be deployable in software-first form (dashboard + AI models + smart contract + QR verification) with the physical sensor node as an optional, already-engineered upgrade path — not a blocking dependency — so it can scale to KVIC-affiliated rural beekeeping clusters without every beekeeper needing custom hardware on day one.

---

## 2. 🚨 Problem Statement

1. **Honey fraud**: honey is one of the most adulterated food products globally; a large share of commercial honey is diluted or harvested before natural curing completes, and paper certificates are trivially forged or swapped between containers.
2. **No verifiable link between the live hive and the finished product**: existing traceability solutions rely on manual data entry at the packing stage rather than continuous sensor evidence from the hive itself.
3. **Beekeepers can't detect colony problems early**: disease (Varroa, foulbrood), queenlessness, cold stress, starvation, and swarming events are usually caught only after visible damage, costing rural beekeepers their livelihood.
4. **Rural deployment reality**: any solution must work for KVIC-affiliated apiaries with intermittent connectivity, limited budgets, and beekeepers who may not want to manage a crypto wallet.

---

## 3. 👥 User Personas & Target Market

| Persona | Role | Pain Point | How HoneyChain Solves It |
|---|---|---|---|
| **Commercial / rural beekeeper** (KVIC cluster member) | Hive operator | Loses colonies to undetected disease; loses premium pricing to fake honey | Gets early AI health/disease alerts on a simple dashboard, and an on-chain purity record that supports premium pricing |
| **Conscious consumer** | Honey buyer | Doesn't trust generic "organic" labels | Scans a QR code, sees a verifiable on-chain provenance record — no wallet or crypto knowledge required |
| **Retailer / organic inspector** | QA / compliance | Needs an audit trail for export/organic compliance | Bulk, cryptographic batch verification without paper delays |
| **KVIC / cooperative administrator** | Program manager | Needs to roll this out across many small apiaries on a limited budget | Software-first onboarding, shared community gateways, offline-first sync |

---

## 4. 🌟 Core Feature Requirements (Prioritized)

```
┌───────────────────────────────────────────────────────────────────┐
│  P0 — Must-have for evaluation / demo                              │
│   • Edge-AI hive health & disease classifier (already built:       │
│     TinyML triage + acoustic CNN) running on existing hardware      │
│     OR against a provided/simulated telemetry stream                │
│   • Gateway swarm-prediction + anomaly detection pipeline           │
│   • Corrected smart contract: keccak256 end-to-end, registered      │
│     hive ownership, multi-oracle attestation                        │
│   • Beekeeper dashboard: live health alerts + harvest recording     │
│   • Consumer QR verification page (no wallet required to read)      │
│                                                                     │
│  P1 — High-impact polish                                            │
│   • IPFS (redundant-pinned) storage for full logs, photos, AI       │
│     diagnostic reports per batch                                    │
│   • Retailer / inspector bulk verification portal                   │
│   • Offline-first sync queue at the gateway for rural connectivity  │
│   • Per-device signed telemetry (ECDSA) for authenticity            │
│                                                                     │
│  P2 — Post-hackathon roadmap                                        │
│   • Real moisture-at-extraction sensor (refractometer IoT probe)    │
│   • ERC-20 DePIN-style data-contribution rewards for beekeepers     │
│   • Chainlink Functions / multi-chain oracle relay                  │
│   • Retro/visual theming, ambient audio feedback                    │
└───────────────────────────────────────────────────────────────────┘
```

---

## 5. 🔄 End-to-End User Flow

```
[1. Hive]──▶[2. Edge AI]──▶[3. Gateway AI + queue]──▶[4. Smart contract]──▶[5. QR on jar]
 Sensors      On-device       Disease / swarm risk        Multi-oracle          Consumer
 (temp,       triage model    classifiers run on           attestation,         scans and
 humidity,    filters noise,  Pi + Coral TPU; daily         keccak256 Merkle     sees health
 gas, audio)  saves airtime   Merkle sub-root queued        sub-roots anchored   + purity
                              locally if offline             on-chain             record
```

1. **Continuous monitoring**: hive sensors stream telemetry; the on-device triage model filters healthy readings locally, only escalating anomalies (saves battery/airtime).
2. **AI diagnosis**: the gateway runs disease/swarm/fault models on escalated data and on scheduled full-log windows; results are pushed to the beekeeper dashboard in near-real time.
3. **Harvest commitment**: at extraction, the beekeeper confirms the harvest; the gateway computes a keccak256 Merkle root over the curing-period log and submits it, tagged with the AI health summary, moisture (flagged as self-declared until the P2 sensor ships), and hive ID.
4. **Multi-oracle attestation**: at least 2 of 3 registered gateway/oracle signers must co-sign before a batch is finalized on-chain, preventing a single compromised node from fabricating history.
5. **Consumer verification**: the jar's QR code links to a page that reads the contract directly (no wallet needed) and shows the Merkle-proof-verified batch record plus the AI-derived colony health summary for that harvest window.

---

# ⚙️ PART 2: TECHNICAL REQUIREMENTS DOCUMENT (TRD)

## 1. 🏗️ Corrected Architecture (Six Layers)

```
┌───────────────────────────────────────────────────────────────────────────┐
│ TIER 1 — EDGE SENSOR NODE (existing hardware, reused as-is)               │
│  nRF52840 + SX1262 LoRa · TI TMP117 · Sensirion SHT45 · Bosch BME688 ·     │
│  MEMS mic · Model V2 on-device triage (980 B flash, <1 ms inference)      │
│  NEW: each 32-byte payload is ECDSA-signed with a per-device key          │
└──────────────────────────────────┬──────────────────────────────────────┘
                                    │ LoRa (signed packets)
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ TIER 2 — GATEWAY / FOG AI LAYER (Raspberry Pi CM4 + Coral TPU)            │
│  Model 1: acoustic 1D/2D-CNN disease classifier (Varroa, foulbrood, etc.) │
│  Swarm-prediction LSTM (24h horizon) · unsupervised autoencoder fault     │
│  detector · daily keccak256 Merkle sub-root builder · offline tx queue    │
└──────────────────────────────────┬──────────────────────────────────────┘
                                    │ JSON-RPC (queued if offline)
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ TIER 3 — BLOCKCHAIN LAYER (corrected HoneyProvenance.sol)                 │
│  keccak256 throughout · registered hive→owner mapping (no tx.origin) ·    │
│  2-of-3 oracle attestation · progressive daily sub-root anchoring         │
└──────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ TIER 4 — DECENTRALIZED STORAGE                                            │
│  Pinata IPFS (primary) + web3.storage/Filecoin (redundant pin) for full   │
│  telemetry logs, jar photos, and AI diagnostic reports per batch          │
└──────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ TIER 5 — APPLICATION LAYER (Next.js dApp + REST API)                     │
│  Beekeeper dashboard (health alerts, harvest recording) · gasless QR      │
│  consumer verification page · retailer/inspector bulk-verify portal       │
└──────────────────────────────────┬──────────────────────────────────────┘
                                    │
                                    ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ TIER 6 — RURAL DEPLOYMENT MODEL                                           │
│  Shared LoRa gateway per KVIC cooperative cluster · offline-first sync ·  │
│  software-only onboarding path (phone data entry, no hardware required)   │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 🔌 Hardware & Radio Protocol Specs (retained from existing engineering)

* **MCU**: Nordic nRF52840 (ARM Cortex-M4F @ 64 MHz, 1 MB Flash, 256 KB RAM)
* **RF module**: Semtech SX1262 Sub-GHz LoRa
* **Frequency**: 865.0625 MHz (IN865 license-free band), SF7, BW 125 kHz
* **Payload**: 32-byte packed binary struct, unchanged from the existing firmware, **plus a signature field carried in the LoRa frame envelope** (not counted in the 32-byte struct) so the gateway can verify sender authenticity before accepting a reading into the Merkle tree.

```c
typedef struct __attribute__((packed)) {
    uint16_t hive_id;
    int16_t  brood_core_temp_c_x100;
    int16_t  frame_temps_c_x100[5];
    uint16_t humidity_pct_x100;     // hive air humidity — a HEALTH signal, not honey moisture
    uint16_t voc_gas_kohm_x10;
    uint16_t co2_ppm;
    uint16_t weight_kg_x100;
    uint16_t lux;
    uint8_t  tilt_deg;
    uint8_t  fft_energy_bands[8];   // feeds the acoustic disease classifier directly
} BeevilLoRaPayload;                 // 32 bytes, unchanged
```

---

## 3. 🧠 AI/ML Layer

| Model | Where it runs | Task | Reported metric |
|---|---|---|---|
| Model V2 — triage | nRF52840 (edge) | Healthy vs. anomalous gate; skips LoRa TX on healthy readings to save battery | 99.8% triage accuracy, 0 false negatives, 980 B flash |
| Model 1 — acoustic classifier | nRF52840 (edge) | 1D-CNN over FFT bands: early disease/stress signature | 96.4% accuracy, 75.4 KB flash |
| Swarm-prediction LSTM | Gateway (Coral TPU) | Predicts swarming risk ~24h ahead | 96.0% accuracy |
| Mel-spectrogram 2D-CNN | Gateway (Coral TPU) | Fine-grained pathology classification (Queenless, Cold Stress, Varroa, Swarming, Starvation) | 94.0% accuracy |
| Autoencoder fault detector | Gateway (RPi CM4) | Unsupervised sensor/hardware fault detection | 89.0% accuracy |

---

## 4. 📜 Smart Contract Specification (`HoneyProvenance.sol`)

Full source code implemented at `contracts/src/HoneyProvenance.sol` with 100% automated test coverage in Hardhat.

---

## 5. 🌾 Rural / KVIC Scalability Framework

1. **Shared Community Gateways**: One Pi CM4 gateway per 5–20 hives in a KVIC cooperative cluster.
2. **Software-Only Onboarding Tier**: Rural beekeepers can onboard immediately with mobile field inspection logs and photos at `/kvic-onboard`.
3. **Offline-First Sync**: Gateways buffer signed readings and transactions in local SQLite (`gateway_telemetry.db`) and sync opportunistically.
