# 🏛️ HoneyChain: Complete Architecture Diagrams & Flowchart Suite
### **Problem Statement**: `SIH26021` — *Ministry of MSME, Coordination Section*
**Theme**: Smart Automation | **Team**: Beevil Knievel

---

## 1. 🌐 Master End-to-End Cyber-Physical System Architecture

```mermaid
graph TD
    subgraph SENSORS["1. In-Hive Cyber-Physical Sensing Node (nRF52840)"]
        S1["Sensirion SHT45<br/>(±0.1°C / ±1.0% RH)"]
        S2["HX711 24-bit ADC<br/>(4x Shear Beam Load Cells)"]
        S3["TDK InvenSense MEMS Mic<br/>(100Hz - 2.5kHz Audio)"]
        S4["Bosch BME688 AI VOC<br/>(Paenibacillus Odor Scanner)"]
        MCU["Nordic nRF52840 MCU<br/>(ARM Cortex-M4 @ 64MHz)"]
        TINY["Model V2 TinyML Triage<br/>(980B Flash, <1ms Filter)"]
        LORA_TX["SX1262 LoRa Transceiver<br/>(865 MHz IN865 Band)"]
        
        S1 & S2 & S3 & S4 --> MCU
        MCU --> TINY
        TINY -->|Routine Filtered / Anomaly Escalated| LORA_TX
    end

    subgraph GATEWAY["2. Community Gateway Hub (Raspberry Pi 3B+ / CM4)"]
        LORA_RX["SX1302 / SX1262 LoRa Concentrator"]
        SQLITE["gateway_telemetry.db<br/>(Offline SQLite Queue Buffer)"]
        AI_STACK["5-Tier Fog AI Diagnostics Engine<br/>• 1D-CNN Acoustic (96.4%)<br/>• Swarm LSTM (96.0%)<br/>• Autoencoder Tamper (89.0%)<br/>• Propolis Occlusion Detector"]
        MERKLE_GEN["Sorted-Pair Keccak-256<br/>Merkle Tree Generator"]
        IPFS_BRIDGE["Pinata / Filecoin<br/>IPFS JSON Metadata Bridge"]
        
        LORA_TX -.->|LoRa Radio Link up to 5km| LORA_RX
        LORA_RX --> SQLITE
        SQLITE --> AI_STACK
        AI_STACK --> MERKLE_GEN
        MERKLE_GEN --> IPFS_BRIDGE
    end

    subgraph CONSENSUS["3. DePIN Consensus & Multi-Oracle Layer"]
        ORACLE_GW["Oracle 1: Local LoRa Gateway Node<br/>(ECDSA Hardware Signed)"]
        ORACLE_KVIC["Oracle 2: KVIC Regional Co-Signer Node<br/>(Karnataka Apiary Federation)"]
        ORACLE_LAB["Oracle 3 / Lab: NABL Testing Lab<br/>(Optical Refractometer nD 1.4925)"]
        
        MERKLE_GEN --> ORACLE_GW
        SQLITE --> ORACLE_KVIC
        ORACLE_LAB -.->|Dual Verification| SMART_CONTRACT
    end

    subgraph BLOCKCHAIN["4. Polygon Amoy Smart Contract Layer"]
        SMART_CONTRACT["HoneyProvenance.sol<br/>• 2-of-3 Multi-Oracle Quorum<br/>• 32-byte Merkle Root Anchor<br/>• Lab Refractometer Certification<br/>• Anti-Collusion Slashing"]
        TRACE_CONTRACT["HoneyBatchTraceability.sol<br/>• OpenZeppelin AccessControl<br/>• Supply Chain Custody Transfer"]
        
        ORACLE_GW & ORACLE_KVIC -->|proposeBatch & attestBatch| SMART_CONTRACT
        SMART_CONTRACT -.-> TRACE_CONTRACT
    end

    subgraph CONSUMER["5. Consumer & Institutional Delivery Portals"]
        JAR_QR["Physical Honey Jar QR Sticker<br/>(300 DPI Vector Hologram Stamp)"]
        GASLESS_UI["Gasless Consumer QR Portal<br/>(/verify/[batchId])<br/>• <5ms Client-side Keccak Merkle Proof<br/>• 21-Day Brood Homeostasis Curve<br/>• Zero Wallet / MetaMask Required"]
        WEB3_UI["Enterprise Web3 Portal<br/>(/traceability)<br/>• MetaMask Role-Based Dashboard<br/>• Batch Minting & Ownership Transfer"]
        FLEET_UI["Beekeeper Fleet Dashboard<br/>(/dashboard)<br/>• Live Gauges & Thermal Stress Trigger<br/>• 100-Hive Colony Matrix"]
        
        SMART_CONTRACT --> JAR_QR
        JAR_QR -->|Instant Camera Scan| GASLESS_UI
        TRACE_CONTRACT --> WEB3_UI
        SQLITE --> FLEET_UI
    end
```

---

## 2. 🌳 Sorted-Pair Keccak-256 Merkle Provenance Compression Flowchart

```mermaid
flowchart TD
    subgraph TELEMETRY["504 Hourly Physical Telemetry Frames (21 Days)"]
        F1["Day 1 Hour 1 Frame<br/>(34.82°C, 58.4% RH, 38.4kg)"]
        F2["Day 1 Hour 2 Frame"]
        F504["Day 21 Harvest Frame<br/>(34.80°C, 57.9% RH, 44.8kg)"]
    end

    subgraph LEAVES["Daily Telemetry Leaf Hashes (Keccak-256)"]
        L1["Leaf 1: keccak256(HiveId, T1, Temp, RH, Wt)"]
        L2["Leaf 2: keccak256(HiveId, T2, Temp, RH, Wt)"]
        L21["Leaf 21: keccak256(HiveId, T21, Temp, RH, Wt)"]
        L_PAD["Padded Zero Leaves (Power of 2 = 32)"]
    end

    subgraph TREE["Sorted-Pair Binary Hash Tree (Parent = keccak256(min(A,B) || max(A,B)))"]
        N1["Level 1 Parent Hash"]
        N2["Level 2 Parent Hash"]
        N3["Level 3 Parent Hash"]
        N4["Level 4 Parent Hash"]
        ROOT["Final 32-Byte Merkle Root Hash<br/>(0x088c70f33437f4a22e6c...)"]
    end

    subgraph ONCHAIN["On-Chain Storage & Verification"]
        CONTRACT["HoneyProvenance.sol on Polygon<br/>Gas Used: ~65,000 gas (<$0.002)<br/>99.9% Gas Reduction vs Raw Telemetry"]
        PROOF["Client-side 5-Element Sibling Proof Array<br/>[Sibling1, Sibling2, Sibling3, Sibling4, Sibling5]"]
        VERIFY["Consumer Browser verifies in <5ms:<br/>Leaf + Proof == MerkleRoot (true/false)"]
    end

    F1 & F2 --> L1
    F504 --> L21
    L1 & L2 --> N1
    L21 & L_PAD --> N1
    N1 --> N2 --> N3 --> N4 --> ROOT
    ROOT --> CONTRACT
    CONTRACT --> PROOF
    PROOF --> VERIFY
```

---

## 3. ⚖️ 2-of-3 Multi-Oracle Quorum & Anti-Collusion Slashing State Machine

```mermaid
stateDiagram-v2
    [*] --> Unregistered
    
    Unregistered --> HiveRegistered: admin.registerHive(hiveId, owner)
    HiveRegistered --> OracleStaked: admin.registerOracle(oracleAddress) {stake >= 0.01 ETH}
    
    OracleStaked --> Proposed: Oracle 1 (LoRa Gateway) calls proposeBatch(hiveId, merkleRoot, moisturePpm)
    note right of Proposed
        Attestation Count = 1
        State = PENDING_QUORUM
    end note
    
    Proposed --> Finalized: Oracle 2 (KVIC Regional Co-Signer) calls attestBatch(batchId)
    note right of Finalized
        Attestation Count = 2 >= REQUIRED (2/3)
        Batch is now officially Finalized & Verifiable
    end note

    Finalized --> LabCertified: Accredited Lab calls recordLabRefractometerCertification(batchId, opticalBrix, labCertHash)
    note right of LabCertified
        Dual-Tier Purity Confirmed
        Optical Refractometer nD = 1.4925
    end note

    Finalized --> Challenged: Central FSSAI / KVIC QA Auditor calls challengeBatch(batchId, evidenceHash)
    
    Challenged --> Invalidated: admin.resolveChallenge(batchId, isFraudulent = true)
    note right of Invalidated
        Batch marked UNTRUSTED
        Fraudulent Oracles Slashed 50%
        Whistleblower Awarded 50%
    end note

    Challenged --> Finalized: admin.resolveChallenge(batchId, isFraudulent = false)
```

---

## 4. 🧠 5-Tier Hierarchical AI Diagnostic Pipeline

```mermaid
graph LR
    subgraph TIER1["Tier 1: Edge MCU (nRF52840)"]
        T1_IN["Raw Sensor Signals<br/>(Temp, RH, Gas, Audio)"] --> T1_MODEL["Model V2 TinyML Triage<br/>(980 Bytes Flash)"]
        T1_MODEL -->|95% Nominal| T1_SLEEP["Deep Sleep & Buffer"]
        T1_MODEL -->|5% Anomaly| T1_TX["LoRa Urgent Escalation"]
    end

    subgraph TIER2["Tier 2: Fog Gateway (Raspberry Pi / CM4)"]
        T1_TX --> T2_1["1D-CNN Acoustic Classifier<br/>(Varroa Mite & Foulbrood, 96.4%)"]
        T1_TX --> T2_2["Swarm-Prediction LSTM<br/>(24h Warning Horizon, 96.0%)"]
        T1_TX --> T2_3["Sensor Autoencoder<br/>(Tamper & Drift Detection, 89.0%)"]
        T1_TX --> T2_4["Propolis Occlusion Detector<br/>(PTFE Acoustic Vent Health)"]
    end

    subgraph TIER3["Tier 3: IPFS & Blockchain Ledger"]
        T2_1 & T2_2 & T2_3 & T2_4 --> AI_SUMMARY["Consolidated AI Colony Welfare Score (0-100%)<br/>+ Structured JSON Schema"]
        AI_SUMMARY --> PINATA["Pinata / Filecoin IPFS URI"]
        PINATA --> ONCHAIN_REG["HoneyProvenance.sol Contract"]
    end
```

---

## 5. 📱 Gasless Consumer QR Verification Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Consumer as 🛒 Supermarket Shopper
    participant Camera as 📷 Phone Camera (iOS/Android)
    participant Browser as 🌐 Mobile Safari / Chrome
    participant Contract as ⛓️ HoneyProvenance.sol (Polygon)
    participant IPFS as 📦 IPFS / Pinata Gateway

    Consumer->>Camera: Points camera at Honey Jar QR Sticker
    Camera->>Browser: Opens URL: /verify/1
    Browser->>Contract: Fetches batch 1 Merkle Root & 2-of-3 Quorum Signatures
    Browser->>IPFS: Fetches 21-day telemetry sub-roots & AI Health Summary
    Browser->>Browser: Computes client-side sorted-pair Keccak-256 hash in <5ms
    Browser->>Browser: Compares Computed Hash == On-Chain Merkle Root (True)
    Browser->>Consumer: Renders 100% Authentic Green Verification Badge + Homeostasis Graph
    Note over Consumer,Browser: Zero MetaMask extension, zero wallet login, and zero gas fees!
```

---

## 6. 🌾 KVIC Rural Cooperative Cluster Deployment Topology

```mermaid
graph TD
    subgraph CLUSTER["KVIC Rural Cooperative Cluster (Coorg / Western Ghats)"]
        H1["Hive #001<br/>(Node 1)"]
        H2["Hive #002<br/>(Node 2)"]
        H3["Hive #003<br/>(Node 3)"]
        H20["Hive #020<br/>(Node 20)"]
        
        GW["Shared Community LoRa Hub<br/>(Raspberry Pi 3B+ / CM4 + 5W Solar)<br/>Ratio: 1 Gateway per 20 Hives"]
        
        H1 & H2 & H3 & H20 -.->|LoRa Multi-Hop Mesh (up to 5 km)| GW
    end

    subgraph SOFTWARE["Software-Only Onboarding Tier (Free for Smallholders)"]
        FARMER["Smallholder Farmer<br/>(Zero Hardware Cost)"]
        OFFICER["KVIC Field Officer"]
        APP["KVIC Rural Onboard Portal (/kvic-onboard)<br/>• Photo Frame Inspection<br/>• Manual Moisture Refractometer Entry"]
        
        FARMER --> OFFICER
        OFFICER --> APP
        APP --> GW
    end

    subgraph CLOUD["National Federation Ledger"]
        POLYGON["Polygon POS Network"]
        KVIC_DASH["National KVIC Fleet Command Center"]
        FSSAI_AUDIT["FSSAI Export Audit Portal (/inspector)"]
        
        GW -->|4G LTE / Satellite / Offline Replay| POLYGON
        POLYGON --> KVIC_DASH
        POLYGON --> FSSAI_AUDIT
    end
```
