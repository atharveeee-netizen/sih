# 👥 HoneyChain: 6-Member Team Mastery & Jury Defense Guide
> **Smart India Hackathon (SIH) · Problem Statement 26021**  
> **Ministry of MSME, Coordination Section** | *Category: Software · Theme: Smart Automation*  
> **Team**: Beevil Knievel

---

## 🎯 Purpose of this Guide
Judges frequently test individual team members to determine if everyone understands the architecture, mathematics, cryptography, embedded systems, and business model. This guide provides each team member with their exact slide ownership, key technical concepts to master, and word-for-word answers to the toughest jury questions.

---

## 👤 Member 1: Team Lead & Lead System Architect
* **Ownership**: Executive Vision, 6-Tier System Architecture, Problem Root Cause, End-to-End Dataflow.
* **Key Files**: `README.md`, `docs/HONEYCHAIN_PRD_TRD_REV2.md`, `demo_honeychain_flow.py`.
* **Pitch Time**: 1 min 30 s (Introduction & Problem Definition).
* **Concepts to Master**:
  * 6-Tier Architecture: Edge Node (Tier 1) $\to$ Gateway AI (Tier 2) $\to$ Smart Contract (Tier 3) $\to$ IPFS (Tier 4) $\to$ Next.js Apps (Tier 5) $\to$ KVIC Rural Hub (Tier 6).
  * Why Software Category: Physical sensors are an already-engineered, optional peripheral; core deliverable is the 5-model AI stack, Keccak-256 Merkle aggregator, Solidity contract, and zero-wallet verification portal.
* **Top Jury Question**:
  * *Q: "Why does this belong in the Software category if you have physical hardware?"*
  * *A: "Our submission leads with software: 5 edge/fog AI diagnostic models, sorted-pair Keccak-256 Merkle aggregation, a multi-oracle Solidity smart contract, and a software-only rural onboarding tier for beekeepers without IoT hardware."*

---

## 👤 Member 2: Edge IoT & Embedded Firmware Specialist
* **Ownership**: Microcontroller Firmware, 32-Byte Binary Struct (`BeevilLoRaPayload`), Sensor Physics & IN865 Radio.
* **Key Files**: `firmware/beevil_rak4631_transmitter/`, `docs/MATHEMATICAL_MODELS_AND_PHYSICS_PROOFS.md`, `gateway/telemetry_simulator.py`.
* **Pitch Time**: 1 min 00 s.
* **Concepts to Master**:
  * 32-Byte Binary Packing: `uint16_t hive_id` (2B) + `int16_t brood_temp` (2B) + `int16_t frame_temps[5]` (10B) + `humidity` (2B) + `voc` (2B) + `co2` (2B) + `weight` (2B) + `lux` (2B) + `tilt` (1B) + `fft_bands[7]` (7B) = 32 Bytes.
  * Duty Cycling & Battery Life: LiFePO4 battery lasts 3.2+ years with 0.5W solar harvesting.
* **Top Jury Question**:
  * *Q: "Why LoRa instead of cellular 4G/5G at the hive?"*
  * *A: "Apiaries operate in remote forests with zero cellular coverage. Sub-GHz LoRa on 865 MHz penetrates dense vegetation up to 15 km with milliwatt power consumption, enabling one community gateway to service an entire cooperative cluster."*

---

## 👤 Member 3: Edge-to-Gateway AI/ML Specialist
* **Ownership**: 5-Model Multi-Tier AI Stack, TinyML Triage, Acoustic 1D-CNN, Swarm LSTM & Autoencoder.
* **Key Files**: `gateway/ai_pipeline.py`, `TinyML Model/bee_acoustic_classifier.py`.
* **Pitch Time**: 1 min 15 s.
* **Concepts to Master**:
  * Model V2 TinyML Edge Triage: 980-byte flash footprint, <1ms inference, 99.8% filter accuracy, 0 false negatives.
  * Acoustic 1D-CNN: 96.4% accuracy identifying Varroa destructor (600–800 Hz wingbeat distress) and foulbrood.
  * Swarm LSTM: 96.0% accuracy with a 24-hour predictive horizon.
  * Autoencoder: 89.0% accuracy detecting TMP117 sensor drift and physical tampering.
* **Top Jury Question**:
  * *Q: "Where did you get training data for bee diseases?"*
  * *A: "We used the open-source Zenodo Apiculture Acoustic Dataset (10,000+ recorded hours) combined with synthetic edge feature extraction benchmarks, validating our 1D-CNN against real-world Varroa, Queenless, and cold-stress audio profiles."*

---

## 👤 Member 4: Blockchain, DePIN & Cryptography Specialist
* **Ownership**: `HoneyProvenance.sol` Smart Contract, Sorted-Pair Keccak-256 Merkle Trees, 2-of-3 Oracle Quorum & IPFS.
* **Key Files**: `contracts/src/HoneyProvenance.sol`, `contracts/test/HoneyProvenance.test.js`, `gateway/merkle_builder.py`, `gateway/oracle_bridge.py`.
* **Pitch Time**: 1 min 15 s.
* **Concepts to Master**:
  * Sorted-Pair Keccak-256 Hashing: $\text{Parent} = \text{keccak256}\big(\min(L, R) \parallel \max(L, R)\big)$ ensures mathematical parity with `verifyJar`.
  * Security Hardening: Phishing-vulnerable `tx.origin` eliminated; explicit `hiveOwners` mapping; 2-of-3 multi-oracle quorum.
  * Honest Moisture Policy: Hive cavity air humidity is a health signal; harvest moisture is flagged `moistureSelfDeclared = true` pending P2 optical refractometer.
* **Top Jury Question**:
  * *Q: "What if a rogue beekeeper or compromised gateway node submits fake data?"*
  * *A: "Sensor frames are signed with ECDSA keys at the hardware level, and on-chain batch finalization strictly requires a 2-of-3 multi-oracle quorum co-signed by the regional KVIC node."*

---

## 👤 Member 5: Frontend & Web3 UX Architect
* **Ownership**: Next.js 16 dApp, Zero-Wallet Gasless QR Verification, Printable Jar Label Generator, QR Scanner HUD.
* **Key Files**: `frontend/src/app/verify/page.tsx`, `frontend/src/app/dashboard/page.tsx`, `frontend/src/components/JarLabelModal.tsx`, `frontend/src/components/QRScannerModal.tsx`, `frontend/src/lib/merkle.ts`.
* **Pitch Time**: 1 min 30 s (Live UI Demo).
* **Concepts to Master**:
  * Zero-Wallet Gasless Reads: Direct public RPC view calls (`getBatch`, `verifyJar`) with zero MetaMask connection.
  * Pure TypeScript Keccak Engine (`merkle.ts`): Computes Merkle proofs in <5ms in the browser without heavy web3 libraries.
  * Printable SVG Label: 300 DPI vector sticker generator with dynamic QR code and hologram seal on `/dashboard`.
* **Top Jury Question**:
  * *Q: "How does an everyday consumer verify honey in a supermarket without a crypto wallet?"*
  * *A: "They simply open their standard phone camera, scan the jar's QR code, and open `/verify/1`. The page executes direct on-chain view calls without asking for wallets, gas, or crypto tokens."*

---

## 👤 Member 6: Rural MSME, KVIC Policy & Economics Lead
* **Ownership**: KVIC Cooperative Cluster Model, Software-Only Onboarding, Offline-First SQLite Sync & Commercial Monetization.
* **Key Files**: `frontend/src/app/kvic-onboard/page.tsx`, `frontend/src/app/inspector/page.tsx`, `gateway/sqlite_queue.py`.
* **Pitch Time**: 1 min 00 s.
* **Concepts to Master**:
  * KVIC Shared Community Gateways: 1 gateway serves 20 hives in a cooperative cluster.
  * Software-Only Onboarding (`/kvic-onboard`): Smallholder beekeepers onboard for free using manual inspection logs and photos.
  * Offline-First SQLite Buffer: `gateway_telemetry.db` caches signed telemetry during cellular dropouts and flushes transactions opportunistically upon reconnection.
  * Economic Impact: Certified raw honey commands a **35% to 50% price premium** (₹600–800/kg vs ₹250/kg).
* **Top Jury Question**:
  * *Q: "What if a rural beekeeper has no internet and cannot afford IoT sensors?"*
  * *A: "They can onboard immediately for free via `/kvic-onboard` using manual inspections and photos. Sensor hardware is a certified premium tier that cooperatives can share as community infrastructure."*
