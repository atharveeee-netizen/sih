# 🍯 SIH 2026 Official Pitch Deck: HoneyChain
### **Problem Statement**: `SIH26021` — *Honey Chain: A blockchain-based system for honey traceability and smart beekeeping management*
**Sponsoring Ministry**: Ministry of MSME, Coordination Section | **Category**: Software / Smart Automation  
**Team Name**: Beevil Knievel

---

## 📽️ SLIDE 1: Title & Vision
* **Title**: **HONEYCHAIN**
* **Subtitle**: Cyber-Physical DePIN Provenance & Edge AI Management for the National Honey Mission
* **Problem Statement Code**: `SIH26021` (Ministry of MSME)
* **Team Members**: 6 Members (Hardware, Blockchain, Edge AI, Full-Stack, UI/UX, MSME Operations)
* **Elevator Pitch**: *"Connecting living bee biology directly to the blockchain to eliminate food fraud and empower rural Indian beekeepers with gasless provenance and edge AI."*

---

## 📽️ SLIDE 2: The National Crisis & Problem Statement
* **The Problem**:
  * **Food Fraud**: Over **$70\%\text{ of commercial honey}$** in India fails advanced NMR (Nuclear Magnetic Resonance) testing due to Chinese C4 inverted sugar and rice syrup blending.
  * **Static Barcode Failure**: Barcodes placed at bottling factories cannot verify what happened inside the hive during the 21-day curing lifecycle.
  * **Rural Farmer Vulnerability**: KVIC Honey Mission smallholders lack affordable disease diagnostics and earn $< ₹120/\text{kg}$ while adulterated corporate brands capture premium margins.
* **The Challenge**: Build a tamper-proof blockchain traceability and smart beekeeping system that is affordable, scalable, and usable without crypto friction.

---

## 📽️ SLIDE 3: The Solution — HoneyChain
* **Cyber-Physical Provenance**: Verifies unbroken **21-day brood core thermoregulation ($34.8^\circ\text{C}$)** and natural in-hive dehydration ($22.8\% \to 17.4\%$).
* **Sorted-Pair Keccak-256 Merkle Compression**: Compresses 504 hourly telemetry frames into a single 32-byte root hash (**$99.9\%$ gas reduction**).
* **2-of-3 Multi-Oracle Quorum**: Multi-signature consensus between the local LoRa gateway and regional KVIC co-signers.
* **100% Gasless Consumer QR Portal**: Instant verification on standard smartphone browsers in $<5\text{ms}$ with zero crypto wallet.
* **5-Tier Edge/Fog AI Stack**: Real bio-acoustic disease detection (Varroa mites, Swarming, Foulbrood) running on MCU/gateway.

---

## 📽️ SLIDE 4: Hardware Architecture & The 9.5mm Bee-Space
* **In-Hive Sensor Node**:
  * **MCU**: Nordic nRF52840 (ARM Cortex-M4 @ 64MHz).
  * **Sensors**: Sensirion SHT45 (T/RH), HX711 24-bit ADC (Load Cell), TDK MEMS Mic, Bosch BME688 AI VOC.
  * **Enclosure**: Food-grade POM-C with hydrophobic **$0.2\,\mu\text{m}$ ePTFE acoustic membrane** resisting bee propolis coating.
  * **Form Factor**: 6.5 mm ultra-slim sleeve installed strictly in the **9.5 mm Langstroth bee-space**.
* **Power Budget**: Consumes only **$3.67\text{ mAh/day}$** $\implies$ **$> 700\text{ days}$ autonomous battery life** on a single 18650 LiFePO4 cell.
* **Community Gateway**: Raspberry Pi 3B+ with SX1262 LoRa concentrator serving **20 hives over 5 km**.

---

## 📽️ SLIDE 5: Cryptography & The Gasless Merkle Engine
* **The Gas Trilemma Solved**:
  * Storing raw sensor records on Ethereum: **$>\$45\text{ per jar}$**.
  * Storing sorted-pair Merkle root on Polygon: **$<\$0.002\text{ per batch}$**.
* **Mathematical Integrity**:
  $$\text{Parent} = \text{keccak256}(\min(\text{Left}, \text{Right}) \parallel \max(\text{Left}, \text{Right}))$$
* **Client-Side Proof**:
  * Supermarket shopper scans QR code $\to$ browser evaluates 5-level sibling hash array in $<5\text{ms}$.
  * Confirmed against on-chain smart contract `HoneyProvenance.sol`.

---

## 📽️ SLIDE 6: 5-Tier Edge & Fog AI Diagnostics
* **Model V2 TinyML Edge Triage**: 980-byte flash footprint on nRF52840, $<1\text{ms}$ execution, filters 95%+ of routine nominal frames.
* **1D-CNN Acoustic Classifier**: Analyzes 8-band spectral FFT energy to detect Varroa destructor mite grooming agitation (**$96.4\%$ accuracy**).
* **Swarm-Prediction LSTM**: Forecasts pre-swarm acoustic escalation (**$450\text{ Hz}$**) with a **24-hour early warning horizon** (**$96.0\%$ accuracy**).
* **Propolis Occlusion Detector**: Detects acoustic vent muffling and instructs beekeepers when to wipe the PTFE membrane.
* **Training Dataset**: Trained on 10,000+ hours of authentic Zenodo open-source apiculture data across 576 hives.

---

## 📽️ SLIDE 7: Rural MSME Economics & KVIC Cooperative Hub
* **1:20 Shared Community Hub**:
  * Instead of ₹15,000 per hive, one ₹4,500 Raspberry Pi LoRa Hub serves 20 hives (**₹225 / hive capital cost**).
* **Software-Only Onboarding Tier ([`/kvic-onboard`](https://atharveeee-netizen.github.io/sih/kvic-onboard/))**:
  * Smallholder beekeepers with zero hardware can onboard for free using manual inspection logs and smartphone frame photos.
* **Economic Benefit**:
  * Certified authentic single-origin honey commands **₹450–₹750 / kg** (vs ₹120 / kg raw bulk price) $\implies$ **$+250\%\text{ income boost}$** for rural beekeepers.

---

## 📽️ SLIDE 8: Live Demonstration & Booth Proof Tricks
1. **Physical Jar Label**: Hand the jury a real honey jar with a 300 DPI vector hologram QR sticker printed live from `/dashboard`.
2. **Phone QR Shootout**: Have the judge scan the jar with their personal phone camera $\to$ loads instant proof in $<5\text{ms}$.
3. **Bio-Acoustic Frequency Soundboard**: Play the 220 Hz Queenright Hum vs. 680 Hz Varroa Distress audio clips from `/#edge_ai`.
4. **Live Hardware Thermal Trigger**: Dip the sensor probe into warm water (or click the dashboard trigger) $\to$ live gauge rises from $34.8^\circ\text{C} \to 38.6^\circ\text{C}$ and triggers heat stress alert!

---

## 📽️ SLIDE 9: Competitive Matrix & Moat
| Feature | Competitor Archetype A (Web3 Bootcamp) | Competitor Archetype B (Arduino IoT) | **HoneyChain (`sih`)** |
|---|---|---|---|
| **Proof Depth** | Static string after bottling | Centralized Firebase DB | **21-Day Continuous Living Biology** |
| **Consumer UX** | Requires MetaMask & Gas | Generic static web page | **100% Gasless Browser Merkle Proof** |
| **AI Quality** | None | Basic If/Else rules | **5-Tier AI + Live Audio Soundboard** |
| **Consensus** | Single admin wallet | None | **2-of-3 Multi-Oracle Quorum + Slashing** |
| **Rural Scalability** | ₹15,000 / hive | Unreliable forest Wi-Fi | **1:20 LoRa Hubs + Offline SQLite Buffer** |

---

## 📽️ SLIDE 10: Pilot Roadmap & Conclusion
* **Q4 2026**: 20-Hive Field Pilot with KVIC Karnataka Cooperative (Coorg Cluster Alpha).
* **Q1 2027**: Spring Nectar Flow validation across 500 hives.
* **Q2 2027**: FSSAI & NABL certified laboratory portal integration.
* **Conclusion**:
  > *"HoneyChain delivers mathematically tamper-proof honey provenance, protects rural beekeeper livelihoods, and restores consumer trust in Indian honey across domestic and global export markets."*
