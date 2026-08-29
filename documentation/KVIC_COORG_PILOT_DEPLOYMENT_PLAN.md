# 🌾 KVIC Coorg Honey Cluster: 20-Hive Field Pilot Deployment Plan

> **Program**: Ministry of MSME / KVIC Honey Mission Field Validation  
> **Location**: Coorg Beekeeping Cooperative Cluster, Yard Alpha (Virajpet, Karnataka)  
> **Scale**: 20 Langstroth Hives (*Apis cerana indica* & *Apis mellifera*) + 1 Shared Gateway Hub

---

## 1. 📅 Pilot Rollout Roadmap (4-Season Validation)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          4-SEASON KVIC FIELD PILOT SCHEDULE                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Q4 2026 (Phase 1): Pre-Deployment Calibration & Farmer Orientation                    │
│   • Onboard 6 local KVIC master beekeepers using /kvic-onboard software portal         │
│   • Bench calibrate 20 sensor nodes (Sensirion SHT45 + HX711 Load Cell + MEMS Mic)     │
│                                                                                        │
│ Q1 2027 (Phase 2): Spring Nectar Flow & Swarm Season (Jan - Mar)                      │
│   • Peak brood rearing & honey flow from coffee blossoms and Western Ghats wild flora  │
│   • Validate Swarm-Prediction LSTM on real pre-swarm acoustic harmonic surges (450 Hz) │
│                                                                                        │
│ Q2 2027 (Phase 3): Summer Dearth & Robbing Prevention (Apr - Jun)                      │
│   • Validate Thermal Stress Edge Triage when ambient canopy exceeds 38°C               │
│   • Test community gateway battery endurance with 5W solar panel in shade              │
│                                                                                        │
│ Q3 2027 (Phase 4): Heavy Monsoon & Offline SQLite Resilience (Jul - Sep)              │
│   • 30+ days continuous rainfall, simulating intermittent rural cellular outages       │
│   • Validate gateway_telemetry.db buffer and automatic transaction replay to Polygon   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. ⚡ Power Budget & Solar Energy Harvesting

| Subsystem | Active Power | Sleep Power | Duty Cycle | Daily Energy Consumption |
|---|---|---|---|---|
| **In-Hive MCU (nRF52840)** | 12.0 mA @ 3.3V | 2.5 $\mu$A @ 3.3V | 0.5% (Every 15 min) | **2.88 mAh / day** |
| **Sensirion SHT45 (T/RH)** | 1.8 mA (3 ms) | 0.2 $\mu$A | 0.003% | **0.02 mAh / day** |
| **MEMS Mic (Audio FFT)** | 8.5 mA (500 ms) | 0.0 mA (Switched) | 0.05% | **0.35 mAh / day** |
| **SX1262 LoRa (20 dBm)** | 85.0 mA (60 ms) | 0.1 $\mu$A | 0.006% | **0.42 mAh / day** |
| **Total In-Hive Node** | — | — | — | **3.67 mAh / day** |

* **Battery Choice**: Single $3.7\text{V } 2600\text{ mAh}$ 18650 LiFePO4 cell.
* **Autonomous Operating Life**: $> 708\text{ Days (1.94 Years)}$ without solar charging!
* **With 0.5W Mini Solar Harvester**: **Indefinite 5+ Year Continuous Operation**.

---

## 3. 🎯 Key Performance Indicators (KPIs) for SIH Jury Evaluation

1. **Adulteration Rejection Rate**: $100\%$ detection of artificial syrup feeding during nectar flow.
2. **Varroa Infestation Alert Lead Time**: $> 7\text{ days}$ prior to visible frame wing-deformation.
3. **Swarm Loss Prevention**: $> 90\%$ pre-swarm notification delivery allowing beekeepers to split hives.
4. **Consumer Purity Verification Latency**: $< 500\text{ ms}$ on 4G mobile browser with zero gas fees.
