#!/usr/bin/env python3
"""
HoneyChain DePIN Oracle Bridge
Problem Statement 26021 — Ministry of MSME, Coordination Section
Team: Beevil Knievel

Connects physical/simulated LoRa hive telemetry streams to:
1. Daily keccak256 Merkle Tree sub-roots
2. AI colony health & pathology assessment
3. IPFS metadata bundle preparation (Pinata / Filecoin schema)
4. Multi-oracle consensus (2-of-3 quorum) on HoneyProvenance.sol
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
import time
from typing import Dict, Any, List, Tuple
from gateway.merkle_builder import build_curing_batch_merkle_tree, HoneyMerkleTree
from gateway.ai_pipeline import HoneyChainAIEngine
from gateway.telemetry_simulator import HiveTelemetrySimulator
from gateway.sqlite_queue import GatewayOfflineQueue

class HoneyChainOracleBridge:
    def __init__(self, hive_id: int = 42, contract_address: str = "0x5FbDB2315678afecb367f032d93F642f64180aa3"):
        self.hive_id = hive_id
        self.contract_address = contract_address
        self.ai_engine = HoneyChainAIEngine()
        self.simulator = HiveTelemetrySimulator(hive_id)
        self.offline_queue = GatewayOfflineQueue()

    def process_curing_and_prepare_harvest(
        self,
        curing_days: int = 21,
        moisture_pct: float = 17.4,
        moisture_self_declared: bool = True,
        apiary_location: str = "KVIC Cluster Yard Alpha, Lat: 12.9716 N, Long: 77.5946 E"
    ) -> Dict[str, Any]:
        """
        Executes end-to-end batch harvest preparation:
        1. Ingests 21-day telemetry history
        2. Executes AI diagnostic models across all days
        3. Computes sorted-pair Keccak-256 Merkle Tree
        4. Compiles standard IPFS metadata artifact
        5. Returns contract proposal payload with Merkle proofs
        """
        # print(f"[Oracle Bridge] Processing {curing_days}-day curing telemetry for Hive {self.hive_id}...")
        daily_records = self.simulator.generate_full_curing_cycle(curing_days)

        # 1. AI Health Diagnosis
        ai_summary = self.ai_engine.generate_curing_health_summary(daily_records)

        # 2. Merkle Tree Construction
        tree, raw_leaves = build_curing_batch_merkle_tree(daily_records)
        merkle_root = tree.root_hex

        # 3. Telemetry Aggregation
        avg_temp = sum(r["brood_core_temp_c"] for r in daily_records) / len(daily_records)
        net_weight = daily_records[-1]["weight_kg"] - daily_records[0]["weight_kg"]

        # 4. Standard IPFS Metadata Schema
        ipfs_metadata = {
            "name": f"HoneyChain Batch #1 — HIVE-{self.hive_id:03d}",
            "batch_id": 1,
            "hive_id": f"HIVE-{self.hive_id:03d}",
            "apiary_location": apiary_location,
            "location_source": "kvic_registered_cluster",
            "curing_period_days": curing_days,
            "telemetry_summary": {
                "avg_brood_core_temp_c": round(avg_temp, 2),
                "net_nectar_weight_gain_kg": round(net_weight, 2),
                "daily_packet_count": len(daily_records)
            },
            "moisture": {
                "value_pct": moisture_pct,
                "self_declared": moisture_self_declared,
                "note": "Refractometer probe is a P2 roadmap sensor; current value is beekeeper-declared at extraction"
            },
            "ai_health_summary": ai_summary,
            "merkle_root": merkle_root,
            "purity_verdict": "Verified Pure Uncapped Nectar" if moisture_pct <= 18.5 else "Excess Moisture Warning",
            "image": "ipfs://bafybeicg2u4v4w2v2gxyy7x4...",
            "attestations": [
                "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
                "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
            ]
        }

        # 5. Generate sample proofs for Day 1 and Harvest Day
        day1_proof = tree.get_proof(0)
        harvest_proof = tree.get_proof(len(daily_records) - 1)

        # 6. Queue locally in offline DB
        moisture_ppm = int(moisture_pct * 100)
        ipfs_uri = "ipfs://QmHoneyChainBatch1Metadata"
        queue_id = self.offline_queue.queue_harvest_proposal(
            hive_id=self.hive_id,
            merkle_root=merkle_root,
            moisture_ppm=moisture_ppm,
            moisture_self_declared=moisture_self_declared,
            ipfs_uri=ipfs_uri
        )

        return {
            "queue_id": queue_id,
            "hive_id": self.hive_id,
            "merkle_root": merkle_root,
            "moisture_ppm": moisture_ppm,
            "moisture_self_declared": moisture_self_declared,
            "ipfs_uri": ipfs_uri,
            "ipfs_metadata": ipfs_metadata,
            "leaf_count": len(raw_leaves),
            "sample_proof_day_1": day1_proof,
            "sample_proof_harvest_day": harvest_proof,
            "contract_call_proposal": {
                "target": self.contract_address,
                "method": "proposeBatch",
                "args": [self.hive_id, merkle_root, moisture_ppm, moisture_self_declared, ipfs_uri]
            }
        }

if __name__ == "__main__":
    bridge = HoneyChainOracleBridge(hive_id=42)
    result = bridge.process_curing_and_prepare_harvest()
    print("==================================================")
    print("[SUCCESS] HoneyChain Harvest Provenance Bundle Created!")
    print(f"Batch Root: {result['merkle_root']}")
    print(f"Offline SQLite Queue ID: {result['queue_id']}")
    print(f"IPFS Colony Health: {result['ipfs_metadata']['ai_health_summary']['colony_status']}")
    print("==================================================")
