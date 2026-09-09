# CLAIM-EVIDENCE FIREWALL MATRIX — HONEY CHAIN SIH 2026
**Target**: SIH 2026 Problem Statement 26021  
**Authority**: Ministry of MSME / KVIC Honey Mission  
**Document**: Claim-Evidence Firewall & Presentation Boundary  

---

## 1. Claim Classification Legend
- **[A] DIRECTLY IMPLEMENTED**: Verified in active code repository.
- **[B] AUTOMATED TEST**: Covered by deterministic CI unit/integration/E2E test.
- **[C] PHYSICAL MEASUREMENT**: Measured on physical silicon bench or calibrated load.
- **[D] SIMULATION**: ANSYS FEA / CFD / SPICE multi-physics simulation.
- **[E] SYNTHETIC DATA**: Trained or evaluated on mathematically generated distributions.
- **[F] LITERATURE / REFERENCE**: Backed by peer-reviewed apicultural literature.
- **[G] PROJECTION**: Engineering calculation / link-budget estimate.
- **[H] UNSUPPORTED / RETRACTED**: Removed from public claims to prevent jury attack.

---

## 2. Comprehensive Claim Evaluation Matrix

| Subsystem | Original Aggressive Claim | Evidence Classification | Scientific Reality / Evidence | Hardened Defensive Presentation Language |
| :--- | :--- | :--- | :--- | :--- |
| **Blockchain** | "Immutable decentralized blockchain guarantees honey is 100% genuine." | [A] + [B] (Ledger) | SHA-256 event chaining proves data history hasn't been altered; cannot chemically test honey inside jar. | **"A permissioned cryptographic ledger provides tamper-evident provenance tracking across custody transfers; physical authenticity relies on accredited lab testing."** |
| **QR Code** | "QR code prevents any counterfeit honey from entering the market." | [A] + [B] (Velocity Engine) | Detects duplicate token scans and velocity anomalies; cannot physically prevent a bad actor from photocopying a label onto fake honey outside retail points. | **"Cryptographically registered package tokens flag suspicious scan velocity anomalies and repeated activations to alert consumers to cloned labels."** |
| **IoT Range** | "15 km LoRa range guaranteed in all rural deployments." | [G] + [D] (Link Budget) | Theoretical link budget with SX1262 (+22 dBm, SF12, line-of-sight). Dense canopy or hilly terrain reduces range. | **"Sub-GHz LoRa (865 MHz IN) provides long-range telemetry designed for rural topography; effective field coverage spans 1.5–15 km depending on terrain and canopy."** |
| **Battery Life** | "18-month battery life with zero maintenance." | [C] + [D] (Power Profiling) | Bench current: 4.2 µA deep sleep, 110 mA TX (62 ms). Math shows 18 months on 3500 mAh 18650 cell under 15-min wake cycles. | **"Engineered for up to 18-month operational lifespan on a single LiFePO4 cell based on 4.2 µA deep sleep current profiling and 15-minute periodic wake cycles."** |
| **AI Disease** | "1D-CNN AI detects and diagnoses Varroa mites and brood diseases." | [E] + [A] (Random Forest) | Model trained on 1,500 parametric synthetic sensor records; no physical field microscopic validation. | **"Gateway multi-factor risk engine classifies anomalous colony states (thermal instability, brood cooling, acoustic spectral shift) to recommend manual inspection."** |
| **Acoustic FFT** | "Real-time swarming detection 14 days in advance with 94.2% accuracy." | [B] + [F] (Acoustic literature) | Literature indicates pre-swarm acoustic energy shift (400–500 Hz); 14-day early warning is a research observation, not a field-proven SLA. | **"CMSIS-DSP on-MCU 256-pt Real FFT monitors energy shifts in the 400–500 Hz swarming and 300–600 Hz queen piping bands to alert beekeepers to pre-swarm agitation."** |
| **Thermal Drift** | "NIST-calibrated temperature tracking across all 10 hive frames." | [C] + [B] (TMP117 + DS18B20) | TMP117 is factory-calibrated to ±0.1°C; DS18B20 digital probes are factory ±0.5°C. NIST calibration was not conducted by team. | **"Dual-sensor thermal topology combines a high-precision TI TMP117 brood-center probe (±0.1°C) with five distributed DS18B20 frame probes for spatial gradient analysis."** |
| **Quality Lab** | "Automatic laboratory purity verification on every batch." | [A] + [B] (Schema & Hash) | System records lab parameters (moisture, HMF, diastase, sugar ratios) and certificate hash; does not run wet chemistry. | **"Digitally records certified lab analysis results (moisture, HMF, sugar profile) cryptographically bound to the batch ledger before packaging authorization."** |
| **Yield Forecast**| "AI deep-learning productivity prediction engine." | [A] + [B] (Regression Heuristic)| Prototype linear regression heuristic tracking continuous load-cell weight dynamics and seasonal floral nectar flow. | **"Continuous comb load-cell dynamics provide an empirical yield estimation heuristic to suggest optimal extraction windows without disturbing the colony."** |
| **Geolocation** | "Hardware GPS anti-counterfeiting tracking." | [A] + [B] (Portal metadata) | Scan records client IP geolocation and user-reported location; not hardware GPS on individual retail jars. | **"Consumer scan portal logs network location and timestamp metadata to detect impossible multi-city verification velocity."** |

---

## 3. The Trust Boundary (Firewall Definition)

### What Honey Chain CAN Prove
1. **Cryptographic Provenance**: Exact timestamped record of harvest, batch creation, lab results, and packaging lot.
2. **Ledger Integrity**: SHA-256 hash chaining proves that recorded events have not been modified or deleted.
3. **Package Identity**: Each retail jar possesses a unique, single-origin packaging token registered in the KVIC database.
4. **Scan Velocity Anomalies**: Detects if a single QR code is scanned repeatedly across multiple IPs or sessions.
5. **Sensor-Observed Hive Conditions**: Empirical physical measurements from connected hive sensors during comb production.

### What Honey Chain CANNOT Prove
1. **Physical Liquid Adulteration Outside Testing**: Does not magically detect syrup dilution injected after packaging if the tamper seal is breached.
2. **Human Fraud at Testing**: If a dishonest lab worker inputs falsified moisture readings, the ledger faithfully records the false reading.
3. **Definitive Clinical Disease Diagnosis**: Acoustic and thermal shifts indicate colony distress, not a definitive microbiological diagnosis.
