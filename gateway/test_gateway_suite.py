#!/usr/bin/env python3
"""
HoneyChain Gateway & AI Test Suite
Problem Statement 26021 — Ministry of MSME, Coordination Section
Team: Beevil Knievel
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import tempfile
from gateway.merkle_builder import (
    keccak256, keccak256_hex, hash_pair,
    serialize_daily_telemetry_leaf, HoneyMerkleTree,
    build_curing_batch_merkle_tree
)
from gateway.ai_pipeline import (
    EdgeTriageClassifier, AcousticDiseaseClassifier,
    SwarmPredictionLSTM, AutoencoderFaultDetector, HoneyChainAIEngine
)
from gateway.telemetry_simulator import HiveTelemetrySimulator
from gateway.sqlite_queue import GatewayOfflineQueue
from gateway.oracle_bridge import HoneyChainOracleBridge

class TestHoneyChainGatewaySuite(unittest.TestCase):

    def test_01_keccak256_known_vector(self):
        """Verifies bit-exact Keccak-256 calculation."""
        empty_keccak = keccak256_hex(b"")
        self.assertEqual(
            empty_keccak.lower(),
            "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470".lower()
        )

    def test_02_sorted_pair_hashing_symmetry(self):
        """Verifies hash_pair(A, B) == hash_pair(B, A) (sorted pair guarantee)."""
        a = keccak256(b"Leaf_A")
        b = keccak256(b"Leaf_B")
        self.assertEqual(hash_pair(a, b), hash_pair(b, a))

    def test_03_merkle_tree_proof_verification(self):
        """Verifies Merkle Tree proof generation and valid leaf verification."""
        leaf1 = keccak256(b"Day_1_Telemetry")
        leaf2 = keccak256(b"Day_2_Telemetry")
        leaf3 = keccak256(b"Day_3_Telemetry")
        leaf4 = keccak256(b"Day_4_Telemetry")

        tree = HoneyMerkleTree([leaf1, leaf2, leaf3, leaf4])
        self.assertTrue(tree.root_hex.startswith("0x"))

        # Verify all 4 leaves
        for idx, leaf in enumerate([leaf1, leaf2, leaf3, leaf4]):
            proof = tree.get_proof(idx)
            is_valid = HoneyMerkleTree.verify_proof(leaf, proof, tree.root_hex)
            self.assertTrue(is_valid, f"Proof for leaf {idx} must be valid")

        # Forged leaf must fail
        forged_leaf = keccak256(b"Forged_Telemetry")
        self.assertFalse(HoneyMerkleTree.verify_proof(forged_leaf, tree.get_proof(0), tree.root_hex))

    def test_04_ai_triage_classifier(self):
        """Tests Tier 1 Edge Triage model on nominal vs anomalous telemetry."""
        triage = EdgeTriageClassifier()
        nominal = {"brood_core_temp_c": 34.8, "humidity_pct": 58.0, "voc_gas_kohm": 45.0}
        res_nom = triage.evaluate(nominal)
        self.assertFalse(res_nom["is_anomaly"])
        self.assertEqual(res_nom["confidence"], 0.998)

        # Thermal stress
        anom = {"brood_core_temp_c": 31.0, "humidity_pct": 58.0, "voc_gas_kohm": 45.0}
        res_anom = triage.evaluate(anom)
        self.assertTrue(res_anom["is_anomaly"])
        self.assertTrue(res_anom["flags"]["thermal_stress"])

    def test_05_acoustic_disease_classifier(self):
        """Tests 1D-CNN Acoustic Classifier for Varroa and Queenless detection."""
        acoustic = AcousticDiseaseClassifier()
        # High frequency grooming / distress bands
        varroa_bands = [10, 15, 30, 40, 50, 60, 120, 130]
        res = acoustic.classify(varroa_bands)
        self.assertEqual(res["prediction"], "VARROA_DESTRUCTOR")

        # Queenless agitation bands
        queenless_bands = [10, 15, 30, 40, 140, 150, 20, 10]
        res_q = acoustic.classify(queenless_bands)
        self.assertEqual(res_q["prediction"], "QUEENLESS_COLONY")

    def test_06_offline_sqlite_queue(self):
        """Tests local SQLite transaction queueing for rural offline clusters."""
        with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as f:
            temp_db = f.name

        try:
            queue = GatewayOfflineQueue(db_path=temp_db)
            tx_id = queue.queue_harvest_proposal(
                hive_id=42,
                merkle_root="0x1234567890abcdef",
                moisture_ppm=1740,
                moisture_self_declared=True,
                ipfs_uri="ipfs://QmTest"
            )
            self.assertGreater(tx_id, 0)

            pending = queue.get_unsynced_harvest_txs()
            self.assertEqual(len(pending), 1)
            self.assertEqual(pending[0]["hive_id"], 42)

            queue.mark_harvest_synced(tx_id, on_chain_batch_id=1)
            pending_after = queue.get_unsynced_harvest_txs()
            self.assertEqual(len(pending_after), 0)
        finally:
            if os.path.exists(temp_db):
                try:
                    os.remove(temp_db)
                except Exception:
                    pass

    def test_07_end_to_end_oracle_bridge(self):
        """Tests full Oracle Bridge curing analysis, AI summary, and Merkle root."""
        bridge = HoneyChainOracleBridge(hive_id=42)
        bundle = bridge.process_curing_and_prepare_harvest(curing_days=7)
        self.assertIn("merkle_root", bundle)
        self.assertIn("ipfs_metadata", bundle)
        self.assertEqual(bundle["ipfs_metadata"]["curing_period_days"], 7)
        self.assertEqual(bundle["moisture_self_declared"], True)

if __name__ == "__main__":
    unittest.main()
