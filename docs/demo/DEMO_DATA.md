# BEEVIL KNIEVEL — DETERMINISTIC DEMONSTRATION DATASET
## Smart India Hackathon 2026 · Problem Statement ID: 26021
**Ministry of MSME / KVIC Honey Mission (*Meethi Kranti*)**

This document catalogs the complete deterministic demonstration dataset seeded into the Beevil Knievel SQLite WAL database by `gateway/seed_honeychain_demo.py` and embedded into `frontend/src/lib/api.ts` for offline evaluation.

---

### 1. KVIC Organization & Regional Clusters
- **Central Organization:** `org-kvic-national` — Khadi & Village Industries Commission (KVIC) — Honey Mission, New Delhi
- **Regional Clusters:**
  1. `cluster-nilgiris`: Nilgiris Mountain Forest Cluster, Ooty/Coonoor, Tamil Nadu (Pincode: 643001) · Officer: Dr. S. Sundaram (`+91 94432 00101`)
  2. `cluster-gir`: Gir Forest Flora Apiculture Cluster, Junagadh/Sasan Gir, Gujarat (Pincode: 362150) · Officer: Er. K. Vala (`+91 99245 00202`)
  3. `cluster-kashmir`: Kashmir Valley Acacia Cluster, Pulwama/Pampore, Jammu & Kashmir (Pincode: 192301) · Officer: Dr. M. Lone (`+91 94190 00303`)

---

### 2. Registered Beekeepers
1. `BEE-KVIC-001`: Ramanathan Pillai (Reg: `KVIC-REG-TN-4102`, Nilgiris, Bank Linked: Yes, Phone: `+91 94432 18491`, Aadhaar: `XXXX-XXXX-8912`)
2. `BEE-KVIC-002`: Kavitha Murugan (Reg: `KVIC-REG-TN-4189`, Nilgiris, Bank Linked: Yes, Phone: `+91 98421 90123`, Aadhaar: `XXXX-XXXX-4531`)
3. `BEE-KVIC-003`: Bhavesh Patel (Reg: `KVIC-REG-GJ-8821`, Gir Forest, Bank Linked: Yes, Phone: `+91 99245 61720`, Aadhaar: `XXXX-XXXX-3319`)
4. `BEE-KVIC-004`: Dharmesh Ahir (Reg: `KVIC-REG-GJ-8854`, Gir Forest, Bank Linked: Yes, Phone: `+91 97230 44910`, Aadhaar: `XXXX-XXXX-7742`)
5. `BEE-KVIC-005`: Ghulam Nabi Lone (Reg: `KVIC-REG-JK-1044`, Kashmir, Bank Linked: Yes, Phone: `+91 94190 28311`, Aadhaar: `XXXX-XXXX-9905`)

---

### 3. Apiaries & Smart Hive Nodes
- **Shola Ridge Apiary Alpha (`apiary-nilgiris-01`):** Lat: 11.3601, Lon: 76.8010, Elev: 1,850m. Flora: Nilgiris Wild Multifloral & Eucalyptus.
  - `Hive 1` (Node 1): Shola Sentinel 01 (Queen A3). Brood Temp: $34.8^\circ\text{C}$, Weight: $34.2\text{ kg}$, $CO_2$: $780\text{ ppm}$, FFT Peak: $245\text{ Hz}$. Status: **HEALTHY (Score: 98.5)**.
  - `Hive 2` (Node 2): Shola Sentinel 02. Brood Temp: $34.6^\circ\text{C}$, Weight: $31.8\text{ kg}$. Status: **HEALTHY (Score: 96.0)**.
  - `Hive 3` (Node 3): Shola Sentinel 03. Brood Temp: $34.9^\circ\text{C}$, Weight: $32.5\text{ kg}$. Status: **HEALTHY (Score: 97.2)**.
- **Somnath Border Apiary (`apiary-gir-01`):** Lat: 21.0512, Lon: 70.5210, Elev: 140m. Flora: Saurashtra Jamun & Forest Mustard.
  - `Hive 6` (Node 6): Somnath Sentinel 06. Brood Temp: $35.1^\circ\text{C}$, Weight: $36.4\text{ kg}$. Status: **HEALTHY (Score: 94.5)**.
- **Pampore Saffron & Acacia Apiary (`apiary-kashmir-01`):** Lat: 33.9920, Lon: 74.9210, Elev: 1,610m. Flora: White Acacia & Saffron Bloom.
  - `Hive 10` (Node 10): Pampore Saffron Sentinel 10. Brood Temp: $32.8^\circ\text{C}$, Weight: $24.1\text{ kg}$, $CO_2$: $1150\text{ ppm}$, FFT Peak: $420\text{ Hz}$. Status: **ATTENTION — Anomaly: POSSIBLE_QUEENLESS_RISK (Score: 74.0)**.

---

### 4. Batches & Cryptographic Block Chains
- **Batch 1 (`HC-BATCH-2026-NIL-001`):**
  - Batch Code: `BATCH-2026-NIL-001`
  - Weight: $45.0\text{ kg}$ · Floral Source: Nilgiris High-Altitude Wild Flora · Status: `PACKAGED` · Curing: 21 Days
  - Quality Test: `QTEST-A19F83E2` (Pune Lab). Moisture: $17.1\%$, HMF: $11.2\text{ mg/kg}$, Diastase: $14.8$, C4/C3 Sugar: $0.0\%$, Status: `PASS`.
  - Processing: `PROC-7B2C19E4` (Nilgiris Tribal Apiculture Processing Co-op). Micro-filtration temp: $38.5^\circ\text{C}$, Settling: 48 hours.
  - Packaging Lot: `LOT-2026-NIL-500G` ($90\times 500\text{g}$ jars).
  - Cryptographic Chain: 5 Blocks (`BATCH_CREATED` → `QUALITY_VERIFIED` → `PROCESSING_COMPLETED` → `PACKAGED` → `QR_ISSUED`). Status: **INTACT**.
- **Batch 2 (`HC-BATCH-2026-GIR-002`):**
  - Batch Code: `BATCH-2026-GIR-002`
  - Weight: $62.5\text{ kg}$ · Floral Source: Saurashtra Jamun & Forest Mustard · Status: `QUALITY_VERIFIED`
  - Quality Test: `QTEST-8C21B4E9` (Rajkot Agmark Lab). Moisture: $17.9\%$, HMF: $14.2\text{ mg/kg}$, Diastase: $12.1$, Status: `PASS`.
  - Cryptographic Chain: 2 Blocks (`BATCH_CREATED` → `QUALITY_VERIFIED`). Status: **INTACT**.

---

### 5. Retail Package QR Tokens & Demonstration Codes
| Package Code | Target Demonstration Persona | Expected Verification Status | Key Characteristics |
| :--- | :--- | :--- | :--- |
| `HC-PKG-A7F93E12` | **Primary Authentic Retail Jar** | `VERIFIED` (Scan Count: 1) | Single scan; complete Nilgiris provenance timeline, Pune QA certificate hash, 5-block intact ledger. |
| `HC-PKG-B8C24D91` | **Counterfeit Label Clone & Reuse** | `SUSPICIOUS` (Scan Count: 6) | Multiple scans across distant network endpoints; red banner warning consumer of cloned label. |
| `HC-PKG-C3D45E67` | **Repeat Scan Inspection Prompt** | `REPEAT_SCAN` (Scan Count: 3) | Repeated scans; prompts consumer to inspect physical tamper-evident lid seal before buying. |
| `HC-PKG-RECALLED-01` | **Recalled Contaminated Batch** | `RECALLED` (Verified: False) | Emergency KVIC batch recall; warning against consumption. |
| `HC-PKG-INVALID-99` | **Unregistered / Fraudulent Token** | `INVALID` (Verified: False) | Token not present in authorized packaging lots. |
