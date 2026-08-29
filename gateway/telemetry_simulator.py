#!/usr/bin/env python3
"""
HoneyChain Telemetry Simulator
Problem Statement 26021 — Ministry of MSME, Coordination Section
Team: Beevil Knievel

Generates continuous 32-byte packed binary LoRa payloads (BeevilLoRaPayload)
for simulated 21-day hive curing periods, anomalous stress events, and harvest readiness.
"""

import struct
import time
import random
from typing import Dict, Any, List

class HiveTelemetrySimulator:
    def __init__(self, hive_id: int = 42):
        self.hive_id = hive_id
        self.base_weight = 32.5  # kg
        self.base_temp = 34.82   # Celsius (optimal brood nest homeostasis)
        self.base_humidity = 58.4 # % relative humidity (air cavity)
        self.base_voc = 45.2     # kOhms

    def generate_single_reading(self, day_index: int = 1, hour_index: int = 12, anomaly_type: str = "NONE") -> Dict[str, Any]:
        """
        Generates realistic diurnal telemetry with optional anomaly injection.
        """
        # Diurnal temperature fluctuation inside brood cluster is tightly regulated (±0.3°C)
        temp_jitter = (random.random() - 0.5) * 0.4
        brood_temp = self.base_temp + temp_jitter

        # Humidity fluctuates with ambient night/day (52% - 64%)
        humidity = self.base_humidity + math_sin_wave(hour_index) * 4.0 + (random.random() - 0.5) * 2.0

        # Nectar accumulation during 21-day honey flow (+0.3kg to +0.8kg / day)
        daily_weight_gain = day_index * 0.42 + (hour_index / 24.0) * 0.35
        weight = self.base_weight + daily_weight_gain

        voc_gas = self.base_voc + (random.random() - 0.5) * 3.0
        co2 = int(600 + math_sin_wave(hour_index) * 80 + random.randint(0, 40))
        lux = int(max(0, math_sin_wave(hour_index - 6) * 1200)) if 6 <= hour_index <= 18 else 0
        tilt = 0

        # 8-band FFT acoustic energy
        # Bands: [0-50Hz, 50-100Hz, 150-200Hz, 200-250Hz, 300-350Hz, 350-400Hz, 500-600Hz, 700-800Hz]
        fft_bands = [12, 18, 55, 92, 38, 22, 11, 6]

        # Anomaly modifications
        if anomaly_type == "COLD_STRESS":
            brood_temp = 31.8
            fft_bands = [15, 20, 25, 30, 45, 30, 10, 5]
        elif anomaly_type == "VARROA":
            fft_bands = [10, 15, 40, 60, 55, 75, 115, 120]  # High frequency grooming / distress
        elif anomaly_type == "SWARM_WARNING":
            fft_bands = [25, 45, 120, 150, 140, 110, 40, 20] # Intense piping & flight prep
        elif anomaly_type == "TAMPER_TILT":
            tilt = 52

        now = int(time.time()) - ((21 - day_index) * 86400) + (hour_index * 3600)

        return {
            "hive_id": self.hive_id,
            "timestamp": now,
            "day_index": day_index,
            "hour_index": hour_index,
            "brood_core_temp_c": round(brood_temp, 2),
            "humidity_pct": round(humidity, 2),
            "voc_gas_kohm": round(voc_gas, 2),
            "co2_ppm": co2,
            "weight_kg": round(weight, 2),
            "lux": lux,
            "tilt_deg": tilt,
            "fft_energy_bands": fft_bands,
            "is_anomaly": (anomaly_type != "NONE")
        }

    def pack_lora_binary(self, reading: Dict[str, Any]) -> bytes:
        """
        Packs the 32-byte BeevilLoRaPayload C struct:
        uint16_t hive_id (2B)
        int16_t  brood_core_temp_c_x100 (2B)
        int16_t  frame_temps_c_x100[5] (10B)
        uint16_t humidity_pct_x100 (2B)
        uint16_t voc_gas_kohm_x10 (2B)
        uint16_t co2_ppm (2B)
        uint16_t weight_kg_x100 (2B)
        uint16_t lux (2B)
        uint8_t  tilt_deg (1B)
        uint8_t  fft_energy_bands[7] (7B) -- Total: 32 bytes
        """
        hive_id = reading["hive_id"]
        brood_temp = int(reading["brood_core_temp_c"] * 100)
        f_temps = [brood_temp - 50, brood_temp - 20, brood_temp, brood_temp - 10, brood_temp - 80]
        hum = int(reading["humidity_pct"] * 100)
        voc = int(reading["voc_gas_kohm"] * 10)
        co2 = reading["co2_ppm"]
        wt = int(reading["weight_kg"] * 100)
        lux = reading["lux"]
        tilt = reading["tilt_deg"]
        fft = reading["fft_energy_bands"][:7]

        return struct.pack(
            ">Hh5hHHHHHB7B",
            hive_id,
            brood_temp,
            *f_temps,
            hum,
            voc,
            co2,
            wt,
            lux,
            tilt,
            *fft
        )

    def generate_full_curing_cycle(self, days: int = 21) -> List[Dict[str, Any]]:
        """
        Generates 21 days of daily summary records for harvest Merkle tree construction.
        """
        daily_records = []
        for d in range(1, days + 1):
            # Inject cold stress on Day 4 that clears by Day 6
            anomaly = "COLD_STRESS" if d == 4 else "NONE"
            rec = self.generate_single_reading(day_index=d, hour_index=14, anomaly_type=anomaly)
            daily_records.append(rec)
        return daily_records


def math_sin_wave(hour: float) -> float:
    import math
    return math.sin((hour / 24.0) * 2 * math.pi)

if __name__ == "__main__":
    sim = HiveTelemetrySimulator(42)
    sample = sim.generate_single_reading()
    packed = sim.pack_lora_binary(sample)
    print(f"Generated sample reading for Hive {sample['hive_id']}:")
    print(f"  Brood Temp: {sample['brood_core_temp_c']} °C | Weight: {sample['weight_kg']} kg")
    print(f"  Binary Struct Length: {len(packed)} bytes (Expected: 32 bytes)")
    assert len(packed) == 32, "Struct size must be exactly 32 bytes"
    print("✓ 32-byte LoRa Binary Struct verified!")
