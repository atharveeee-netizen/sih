# Vermikendra Analysis Report (via Syzygy Brain)

Based on the provided **Vermikendra PRD/TRD** and the repository found in your workspace (`sih` - Beevil Knievel), here is a structural analysis of how the existing codebase aligns with the new Vermikendra requirements. 

It appears the `sih` repository serves as a foundational template (built under the Syzygy framework) that heavily overlaps with Vermikendra's technical architecture.

## 1. Architectural Alignment (High Overlap)
The existing `sih` repository provides a massive head start for Vermikendra. Both projects share the same core cyber-physical architecture:
- **Node Hardware:** RAK4631 (nRF52840 + SX1262) on WisBlock.
- **Radio Link:** Sub-GHz LoRa P2P (865-867 MHz) with 40-byte (or similar) binary payloads, CRC-16, and HMAC-SHA256 signing.
- **Gateway:** Raspberry Pi CM4 + Waveshare SX1262 LoRa HAT.
- **Backend Stack:** FastAPI, SQLite (WAL mode), Mosquitto MQTT.
- **Frontend Stack:** Next.js / PWA architecture.

## 2. Reusable Components
You can directly port or slightly modify the following modules from the `sih` repo for Vermikendra:
- **LoRa Receiver & MQTT Bridge (`gateway/lora_receiver.py`):** The binary unpacking logic is identical in concept. It just needs to parse Vermikendra's specific 44-byte periodic reading (Type 0x01) and event payloads instead of the Beevil 40-byte payload.
- **Edge Gateway Service (`gateway/server.py` & API):** The FastAPI structure and SQLite WAL mode approach are perfectly aligned. 
- **Firmware Base (`firmware/sensor_node/`):** The FreeRTOS sleep cycles, radio transmission logic, and basic sensor reading loops can be reused.

## 3. Required Divergences & New Development

### Hardware & Sensors (The "Sense" Layer)
- **Replace Hive Sensors with Compost Sensors:** 
  - *Remove:* INMP441 (Audio/FFT), OPT3001 (Light).
  - *Keep/Adapt:* DS18B20 array (change from 5-point horizontal to 5-point depth), TMP117, BME688 + SCD41 (move to Lid Pod), LIS3DH (move to Lid Pod for tilt detection), HX711 (adapt to 4-load-cell platform).
  - *Add:* Capacitive soil moisture sensor, 5V DC Fan, Water pump/misting logic.
- **Power Budget:** Vermikendra has a higher power draw due to the SCD41 and 5V fan flush cycles. The solar power logic needs validation against the new 73 mAh/day budget.

### Firmware State Machine (The "Edge Failsafe" Layer)
- **New States:** Vermikendra requires new active states: `RESP_FLUSH`, `RESP_MEASURE`, `LID_OPEN`, `LID_CLOSED`, and `MIST`. 
- **Edge Failsafe:** The RAK4631 needs new localized logic to independently evaluate moisture and temperature thresholds to trigger the misting pump (EF-1 to EF-4) without gateway intervention.

### Backend Data Model & Algorithms (The "Decide" Layer)
- **Database Schema:** Transition from Honey traceability (Harvest -> Batch -> QA -> QR) to Compost tracking (Bins, Nodes, Respiration Runs, Events, Alerts, Batches).
- **Algorithmic Engine (`vk-engine`):** 
  - Replace the CMSIS-DSP FFT and Random Forest hive risk triage with Vermikendra's **Respiration Rate (CO2 slope fitting)** and **Heat-Risk Forecast** (linear regression on temperature over the last 30 minutes).
  - Implement the Readiness rules (Version 1: rules-based, Version 2: exponential decay prediction).
- **Remove Blockchain:** Vermikendra does not require the Polygon Amoy smart contracts or the commit-reveal QR counterfeit engine (though simple QR batch summaries are a P2 requirement).

### Frontend Dashboard (The "Show" Layer)
- **UI Paradigm:** Shift from the "Trust/Traceability" consumer portal to an "Operator-First" dashboard.
- **Offline-First & Localized:** Must be served over the gateway's local WiFi hotspot (no internet required).
- **Language Support:** Implement Gujarati, Hindi, and English translation layers.
- **Visuals:** Status must be easily readable (colour + icon + word) for low-literacy users.

---

> [!TIP]
> **Next Steps**
> If your goal is to mutate this repository into `Vermikendra`, we should start by tearing down the blockchain and honey-specific logic, refactoring the database schema to match Section 6.4 of the TRD, and updating the C++ firmware payload structures to match Section 4.3. 

Would you like me to draft an implementation plan for phase 1 of this conversion?
