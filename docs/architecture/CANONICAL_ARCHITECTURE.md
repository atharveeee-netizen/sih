# CANONICAL SYSTEM ARCHITECTURE — HONEY CHAIN SIH 2026
**Target**: SIH 2026 Problem Statement 26021  
**Authority**: Ministry of MSME / Coordination Section & KVIC Honey Mission  
**Document**: Canonical Apicultural Provenance & Operational Analytics Architecture  

---

## 1. Dual-Path Architecture Overview

Honey Chain separates operational cyber-physical smart-hive monitoring from post-harvest cryptographic traceability, while maintaining an immutable bridge between the two at extraction.

```
                    ┌────────────────────────────────────────┐
                    │       KVIC NATIONAL APICULTURE         │
                    │         Cluster Command Hub            │
                    └───────────────────┬────────────────────┘
                                        │
           ┌────────────────────────────┼────────────────────────────┐
           │                            │                            │
           ▼                            ▼                            ▼
      BEEKEEPER                     PROCESSOR                  TESTING LAB
(Apiary & Hive Mgmt)            (Packaging & Lots)         (Quality Parameters)
           │                            │                            │
           └─────────────────────┬──────┴────────────────────────────┘
                                 │
                                 ▼
                    ┌───────────────────────────┐
                    │      HONEY CHAIN API      │
                    │       FastAPI Engine      │
                    └────────────┬──────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
 ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
 │  SQLite WAL  │         │ Cryptographic│         │  QR Velocity │
 │  Relational  │         │ SHA-256 Ledger│        │Anomaly Engine│
 └──────────────┘         └──────────────┘         └──────────────┘
                                 │
                                 ▼
                    ┌───────────────────────────┐
                    │   CONSUMER VERIFICATION   │
                    │   (/verify & /v/[pkgId])  │
                    └───────────────────────────┘
```

---

## 2. Cyber-Physical Smart Hive Pipeline

```
  PHYSICAL SENSORS (16 Telemetry Dimensions)
  ├── TI TMP117 Brood Thermometer (±0.1°C, I2C 0x48)
  ├── 5x DS18B20 1-Wire Thermal Probe Array
  ├── Sensirion SCD41 NDIR CO₂ Photoacoustic (I2C 0x62)
  ├── Bosch BME688 MOX Gas Resistance + RH + Barometer (I2C 0x76)
  ├── ST LIS3DH 3-Axis Accelerometer (Hive Tilt, I2C 0x18)
  ├── Vishay VEML7700 Ambient Light Sensor (I2C 0x10)
  ├── HX711 24-Bit ADC Dual Load Cell Interface (0–200 kg)
  └── TDK InvenSense INMP441 I2S MEMS Microphone (8 kHz)
                   │
                   ▼
  MICROCONTROLLER & EDGE DSP (Nordic nRF52840 ARM Cortex-M4F)
  ├── Hardware Presence Bitmask Probe
  ├── CMSIS-DSP 256-pt Real FFT (8 Acoustic Sub-Bands)
  ├── Page-CUSUM Recursive Thermal Drift Filter
  ├── 7-Point OCV Arrhenius Battery Estimator
  └── 40-Byte Binary Telemetry Struct Packing + CRC-16
                   │
                   ▼
  WIRELESS RURAL BACKHAUL (Semtech SX1262 LoRa 865 MHz)
  ├── Spreading Factor SF7 / Bandwidth 125 kHz / CR 4/5
  └── 3–15 km Rural Point-to-Point Range to Shared Hub
                   │
                   ▼
  SHARED RURAL GATEWAY (Raspberry Pi 3B+ / Edge Linux)
  ├── LoRa Packet Receiver Daemon (`gateway/lora_receiver.py`)
  ├── Local SQLite WAL Offline Persistence
  ├── Multi-Factor Random Forest Risk Classification
  └── Empirical Productivity Yield Forecaster
```

---

## 3. Post-Harvest Cryptographic Traceability Lifecycle

```
  [1] KVIC Cluster (e.g. Nilgiris Forest Cluster, Tamil Nadu)
           │
  [2] Beekeeper (KVIC Reg. Beekeeper with active apiary)
           │
  [3] Smart Hive (Telemetry history, colony health confirmed)
           │
  [4] Harvest Event (Date, weight extracted, field moisture)
           │
  [5] Honey Batch (Raw batch created, floral source tagged)
           │  [State: HARVESTED -> QUALITY_PENDING]
           │
  [6] Quality Test (Lab moisture, HMF, diastase, sugar ratio, cert hash)
           │  [State: QUALITY_PENDING -> QUALITY_VERIFIED]
           │
  [7] Processing Event (Controlled settling, hygienic filtering temp)
           │  [State: QUALITY_VERIFIED -> PROCESSING]
           │
  [8] Packaging Lot (Jars bottled, lot number, expiry date assigned)
           │  [State: PROCESSING -> PACKAGED]
           │
  [9] Unique Package Tokens (Individual QR codes issued: HC-PKG-XXXXXXXX)
           │
 [10] Cryptographic Ledger Seal (SHA-256 event chained from Genesis)
           │
 [11] Consumer Verification (Scan authenticates origin, purity, & ledger proof)
```

---

## 4. Hardware Telemetry Protocol (40 Bytes Canonical)

```
Offset  Field Name                 Type       Bytes  Description / Valid Range
─────────────────────────────────────────────────────────────────────────────
0x00    protocol_version           uint8_t    1      0x02 (Canonical Honey Chain)
0x01    hive_id                    uint16_t   2      Node ID (0x0001 - 0xFFFF)
0x03    sequence_number            uint16_t   2      Monotonic packet sequence counter
0x05    presence_mask              uint8_t    1      Bitmask of 8 connected sensor types
0x06    brood_core_temp_c_x100     int16_t    2      TMP117 Temp (cC, -9999 if absent)
0x08    frame_temps_c_x100[5]      int16_t    10     5x DS18B20 Probes (cC, -9999 if absent)
0x12    humidity_pct_x100          uint16_t   2      BME688 RH (0.01%, 0xFFFF if absent)
0x14    voc_gas_kohm_x10           uint16_t   2      BME688 Gas Res (0.1 kΩ, 0xFFFF if absent)
0x16    co2_ppm                    uint16_t   2      SCD41 CO₂ (400-10,000 ppm, 0xFFFF if absent)
0x18    weight_kg_x100             uint16_t   2      HX711 Comb Weight (0.01 kg, 0xFFFF if absent)
0x1A    lux                        uint16_t   2      VEML7700 Ambient Light (0-65535 lux)
0x1C    tilt_deg                   uint8_t    1      LIS3DH Hive Tilt Angle (0-90°, 0xFF if absent)
0x1D    battery_pct                uint8_t    1      Estimated State of Charge (0-100%)
0x1E    fft_energy_bands[8]        uint8_t[8] 8      Normalized Acoustic Sub-Bands (0-255)
0x26    crc16                      uint16_t   2      CRC-16-CCITT across offsets 0x00..0x25
─────────────────────────────────────────────────────────────────────────────
TOTAL PAYLOAD SIZE = Exactly 40 Bytes
```

---

## 5. Security & Trust Boundaries

| Capability | Supported by Honey Chain? | Technical Implementation |
| :--- | :--- | :--- |
| **Proof of Origin** | YES | Linked from cluster GPS, registered beekeeper ID, and apiary location. |
| **Tamper-Evident History** | YES | SHA-256 chained ledger blocks prevent retroactive record alteration. |
| **Package Cloned Detection** | YES | Real-time QR scan velocity counter flags duplicate/multiple scans. |
| **Lab Quality Transparency** | YES | Lab technician ID, moisture %, HMF mg/kg, and cert hash attached to batch. |
| **Physical Content Guarantee** | NO (Outside Lab) | Requires intact physical tamper-evident tamper seal on the retail jar. |
| **Chemical Analysis in Browser**| NO | Consumer browser displays verified lab record; does not test physical honey. |
