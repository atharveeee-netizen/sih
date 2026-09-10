# BEEVIL KNIEVEL — 5-MINUTE LIVE JURY DEMO RUNBOOK
## Smart India Hackathon 2026 · Problem Statement ID: 26021
**Ministry of MSME / KVIC Honey Mission (*Meethi Kranti*)**

This document provides the exact sequence, script, and interaction steps for executing an airtight, flawless 5-minute technical jury presentation for Beevil Knievel.

---

### Pre-Flight Checklist
- [ ] Backend server running on `http://localhost:8000` (or running in standalone static export with deterministic demo fixtures).
- [ ] Frontend running on `http://localhost:3000` (or deployed on GitHub Pages).
- [ ] Deterministic demo database seeded via `python gateway/seed_honeychain_demo.py`.
- [ ] Open browser tabs:
  1. Tab 1: Home Page (`http://localhost:3000/`)
  2. Tab 2: Consumer Verification (`http://localhost:3000/v/HC-PKG-A7F93E12`)
  3. Tab 3: Flagged Counterfeit Token (`http://localhost:3000/v/HC-PKG-B8C24D91`)
  4. Tab 4: Ledger & Tamper Detection (`http://localhost:3000/batches`)
  5. Tab 5: KVIC Command Center (`http://localhost:3000/kvic`)
  6. Tab 6: Smart Hives Fleet (`http://localhost:3000/hives`)

---

### Step-by-Step 5-Minute Demonstration Journey

#### ⏱️ Minute 0:00 – 0:45: The Problem & The Mandate (Tab 1: Overview)
1. **Navigate to:** `http://localhost:3000/`
2. **Script / Narrative:**
   > *"Respected Jury Members, under the KVIC Honey Mission, rural and tribal beekeepers produce some of the finest raw honey in the world. Yet in the retail market, over 60% of commercial honey is adulterated with cheap inverted sugar syrups, while genuine beekeepers get depressed prices because consumers have zero way to verify origin or laboratory purity.*
   > 
   > *Beevil Knievel solves SIH Problem Statement 26021 by building an unbroken, cyber-physical bridge from smart hive IoT nodes in the field to retail consumer QR verification, anchored in a permissioned cryptographic ledger."*
3. **Point to:** The 5-stage value chain and KVIC national macro metrics on the homepage.

---

#### ⏱️ Minute 0:45 – 1:30: Smart Hive IoT Telemetry & Edge AI (Tab 6: Hives)
1. **Navigate to:** `http://localhost:3000/hives`
2. **Showcase:**
   - Select **Hive-001 (Alpha Core, Shola Ridge Alpha)**: Show real-time telemetry matrix (Brood Temp $34.8^\circ\text{C}$, 5-point frame gradient, Comb Weight $34.2\text{ kg}$, $CO_2\ 780\text{ ppm}$, Acoustic peak $245\text{ Hz}$, 40-byte packed LoRa payload). Status: **HEALTHY (Score: 98.5)**.
   - Select **Hive-010 (Pampore Sentinel 10)**: Show acoustic peak shift to $420\text{ Hz}$, thermal decline to $32.8^\circ\text{C}$, and weight decline. Status: **ATTENTION — Risk Flag: POSSIBLE QUEENLESS RISK**.
3. **Script / Narrative:**
   > *"In the rural apiary, our WisBlock RAK4631 node samples 8 physical sensor channels. It transmits a packed 40-byte binary frame with hardware CRC-16 over Sub-GHz LoRa (IN865), requiring zero cellular SIM cards. On-MCU CMSIS-DSP performs 256-point FFT acoustic analysis. We do not claim unverified 'disease diagnosis'; we provide disciplined risk triage to alert beekeepers before colony collapse."*

---

#### ⏱️ Minute 1:30 – 2:30: Harvest, Batching, QA, & Packaging (Tab: Processor)
1. **Navigate to:** `http://localhost:3000/processor`
2. **Showcase the 3 Operational Tabs:**
   - **Quality Testing:** Show Batch `BATCH-2026-NIL-001`. Point out the laboratory certificate hash (`e3b0c442...`), Moisture ($17.1\%$), HMF ($11.2\text{ mg/kg}$), and C4/C3 purity screen ($0.0\%$). Emphasize that the system records the lab certificate hash rather than claiming to chemically analyze the jar in software.
   - **Processing Event:** Show micro-filtration temperature recorded at $38.5^\circ\text{C}$ (gentle, raw standard) and 48 hours settling duration.
   - **Packaging Lot:** Show Lot `LOT-2026-NIL-500G` issuing 90 individual serialized QR tokens (`HC-PKG-XXXXXXXX`).
3. **Script / Narrative:**
   > *"Every physical event is signed by its authorized actor—the registered beekeeper, the certified KVIC testing lab in Pune, and the co-operative processing facility. Each step creates an immutable ledger block containing the previous block's SHA-256 hash."*

---

#### ⏱️ Minute 2:30 – 3:30: Consumer Verification & Trust Boundary (Tab 2 & 3: Verify)
1. **Navigate to Authentic Jar:** `http://localhost:3000/v/HC-PKG-A7F93E12`
   - **Show:** **VERIFIED AUTHENTIC KVIC PROVENANCE** (Green status banner).
   - **Expand:** Origin (Nilgiris Mountain Forest Cluster, Ramanathan Pillai, Shola Ridge Apiary Alpha, 1,850m AMSL).
   - **Expand:** Quality Control (Pune KVIC Lab, Moisture $17.1\%$, HMF $11.2\text{ mg/kg}$, Diastase $14.8$).
   - **Point to the Claim-Evidence Firewall Card:**
     > *"Notice our Trust Boundary card: Beevil Knievel mathematically proves recorded provenance, registered package identity, and ledger integrity. We explicitly disclose that liquid authenticity outside inspection points still depends on the physical tamper-evident seal."*
2. **Navigate to Flagged Clone:** `http://localhost:3000/v/HC-PKG-B8C24D91`
   - **Show:** **SUSPICIOUS — SCAN VELOCITY ANOMALY DETECTED** (Red status banner).
   - **Show:** Scan count: 6 times across geographically distinct network endpoints.
   - **Script / Narrative:**
     > *"If a counterfeiter photocopies our QR code onto 50 fake jars, our scan velocity engine detects the impossible scan frequency and immediately flags the label as SUSPICIOUS, preventing duplicate label exploitation."*

---

#### ⏱️ Minute 3:30 – 4:30: Cryptographic Ledger & Real-Time Tamper Injection (Tab 4: Batches)
1. **Navigate to:** `http://localhost:3000/batches`
2. **Showcase:**
   - Select `BATCH-2026-NIL-001`. Point to the 5 chained blocks: `BATCH_CREATED` → `QUALITY_VERIFIED` → `PROCESSING_COMPLETED` → `PACKAGED` → `QR_ISSUED`.
   - Point to **SHA-256 HASH CHAIN: INTACT** (Green badge).
3. **Execute Live Tampering Demo:**
   - Click the **"Simulate Malicious Database Tamper"** button.
   - This modifies a historical record in the database directly (simulating a corrupt insider modifying harvest weight from $45.0\text{ kg}$ to $999.0\text{ kg}$).
   - **Watch the Engine React:**
     - Status immediately flips to **CRITICAL: SHA-256 HASH MISMATCH DETECTED!**
     - Ledger verification displays `chain_intact: False`, pinpointing the exact modified block.
4. **Script / Narrative:**
   > *"This proves that Beevil Knievel is not a simple database with a pretty dashboard. It is a genuine permissioned cryptographic ledger. The moment any historical value is altered, the entire subsequent hash chain breaks mathematically, exposing the tampering instantly."*

---

#### ⏱️ Minute 4:30 – 5:00: KVIC National Command & Conclusion (Tab 5: KVIC)
1. **Navigate to:** `http://localhost:3000/kvic`
2. **Showcase:**
   - 3 active clusters: Nilgiris (Tamil Nadu), Gir Forest (Gujarat), Kashmir Valley (Jammu & Kashmir).
   - Real-time aggregate telemetry, healthy vs at-risk colonies, compliance rates, and direct market linkage orders.
3. **Closing Pitch:**
   > *"In summary, Beevil Knievel delivers an end-to-end, SIH-defensible, tamper-evident ecosystem. It protects consumer health, prevents commercial adulteration, empowers rural tribal beekeepers with fair market prices, and gives KVIC complete operational governance over the Honey Mission. Thank you, and we welcome your questions."*

---

### Jury Defense Quick Reference
| Likely Jury Question | Exact Beevil Knievel Answer |
| :--- | :--- |
| *"Can someone refill a genuine bottle with sugar syrup?"* | *"Yes, if they break the seal. That is why Beevil Knievel pairs the QR token with a physical tamper-evident seal and scan velocity tracking. The QR proves registered provenance; the physical seal protects the liquid. We explicitly document this in our Trust Boundary (FIG 12)."* |
| *"Why not use public Ethereum?"* | *"Public blockchains incur variable gas fees ($2–$15 per transaction) and high latency, which is economically unviable for a rural 500g jar costing ₹350. We implement an authorized, permissioned SHA-256 hash-chain that provides identical mathematical tamper-evidence at zero transaction cost."* |
| *"Is your AI model clinically validated for bee diseases?"* | *"No. Our current AI model uses sensor fusion (temperature, comb acoustics, weight, CO2) to classify colony health risk states (`NORMAL`, `SUSPICIOUS`, `ANOMALOUS`). We explicitly label this as risk triage rather than clinical pathology diagnosis until certified field bio-assays are conducted."* |
| *"How does the node transmit without cellular coverage?"* | *"Our sensor node uses an SX1262 LoRa transceiver operating on the license-free IN865 band (865–867 MHz). It transmits to a central apiary gateway up to 1.5 km through thick canopy or 15 km line-of-sight with zero SIM cards."* |
| *"What happens if the gateway loses internet?"* | *"The gateway operates in offline-first mode with local SQLite WAL storage. It buffers all 40-byte binary telemetry frames locally and automatically synchronizes with the KVIC cloud ledger once backhaul connectivity is restored."* |
