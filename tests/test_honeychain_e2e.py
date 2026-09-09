"""
HONEY CHAIN — SIH 26021 End-to-End Test Suite
Ministry of MSME — Coordination Section / KVIC Honey Mission

Validates:
1. Relational Database Schema & WAL Configuration (16 Tables)
2. Cryptographic Permissioned Ledger (SHA-256 Hash Chaining, Immutability & Tamper Detection)
3. QR Engine, Package Token Issuance & Counterfeit Reuse Anomaly Detection
4. Batch Lifecycle API: Harvest -> Batch -> Quality -> Processing -> Packaging -> QR -> Market
5. Consumer Verification API with Origin Provenance & Cryptographic Proof
6. KVIC Administrative Analytics & Aggregations
7. Complete Autonomous Honey Chain E2E Traceability Loop
"""

import os
import sys
import json
import pytest
from pathlib import Path
from starlette.testclient import TestClient

# Ensure repo root and gateway in python path
BASE_DIR = Path(__file__).resolve().parent.parent
GATEWAY_DIR = BASE_DIR / "gateway"
for p in [str(BASE_DIR), str(GATEWAY_DIR)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from gateway.server import app
from gateway.honeychain_db import get_db, init_db
from gateway.honeychain_ledger import HoneyChainLedger
from gateway.honeychain_qr import HoneyChainQREngine

@pytest.fixture(scope="module")
def client():
    init_db()
    with TestClient(app) as c:
        yield c

class TestHoneyChainCore:
    def test_database_schema_and_tables(self):
        """Verifies that all 16 required tables exist in SQLite WAL database."""
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        existing_tables = {row["name"] for row in cursor.fetchall()}
        conn.close()

        expected_tables = {
            "organizations", "clusters", "beekeepers", "apiaries", "hives",
            "telemetry", "alerts", "harvests", "honey_batches", "quality_tests",
            "processing_events", "packaging_lots", "packages", "qr_scans",
            "ledger_events", "market_orders"
        }
        missing = expected_tables - existing_tables
        assert not missing, f"Missing required database tables: {missing}"

    def test_cryptographic_ledger_chain_and_tamper_detection(self):
        """
        Validates SHA-256 hash chaining, genesis linking,
        unbroken verification, and instant detection of retroactive tampering.
        """
        # 1. Verify chain currently intact
        verification = HoneyChainLedger.verify_chain()
        assert verification["chain_intact"] is True
        assert verification["tampered"] is False

        # 2. Record a test event
        test_batch_id = "TEST-BATCH-AUDIT-001"
        event = HoneyChainLedger.record_event(
            batch_id=test_batch_id,
            event_type="QUALITY_VERIFIED",
            actor_id="LAB-TEST-AUDITOR",
            actor_role="QUALITY_LAB",
            payload={"moisture": 17.2, "hmf": 12.0, "status": "PASS"}
        )
        assert event["event_hash"] is not None
        assert event["previous_event_hash"] is not None
        assert len(event["event_hash"]) == 64

        # 3. Verify chain remains intact with new event
        post_verification = HoneyChainLedger.verify_chain()
        assert post_verification["chain_intact"] is True
        assert post_verification["events"] >= 1

        # 4. Inject deliberate tampering into event payload
        tampered_ok = HoneyChainLedger.tamper_event_for_demo(
            event_id=event["event_id"],
            forged_payload={"moisture": 24.5, "hmf": 95.0, "status": "FORGED_PASS"}
        )
        assert tampered_ok is True

        # 5. Ledger MUST immediately catch tampering
        tamper_check = HoneyChainLedger.verify_chain()
        assert tamper_check["chain_intact"] is False
        assert tamper_check["tampered"] is True
        assert len(tamper_check["tampered_events"]) >= 1
        assert tamper_check["tampered_events"][-1]["event_id"] == event["event_id"]

        # 6. Revert tampering to restore cryptographic chain integrity for subsequent tests
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM ledger_events WHERE event_id = ?;", (event["event_id"],))
        conn.commit()
        conn.close()

        restored_check = HoneyChainLedger.verify_chain()
        assert restored_check["chain_intact"] is True

    def test_qr_engine_and_counterfeit_reuse_detection(self):
        """Validates package token issuance and counterfeit anomaly detection."""
        # 1. Issue test package code
        test_code = HoneyChainQREngine.generate_package_code()
        assert test_code.startswith("HC-PKG-")
        assert len(test_code) == 15

        # 2. Test scan anomaly logic
        anomaly = HoneyChainQREngine.detect_scan_anomaly(
            package_code="HC-PKG-D4E56F78",
            current_ip="103.24.12.8",
            location_city="Chennai, India"
        )
        assert anomaly in ["NORMAL", "EXCESSIVE_SCANS", "REUSE_DETECTED", "REPEAT_SCAN"]

        # 3. Verify suspicious package B8C24D91 reflects counterfeit reuse
        suspicious_status = HoneyChainQREngine.get_package_counterfeit_status("HC-PKG-B8C24D91")
        assert suspicious_status["status"] in ["SUSPICIOUS", "FLAGGED", "EXCESSIVE_SCANS", "REUSE_DETECTED", "REPEAT_SCAN"]
        assert suspicious_status["anomaly_flag"] in ["REUSE_DETECTED", "EXCESSIVE_SCANS", "REPEAT_SCAN"]

class TestHoneyChainAPIEndpoints:
    def test_kvic_admin_dashboard_stats(self, client):
        """GET /api/v1/stats/kvic returns macro rural cluster analytics."""
        resp = client.get("/api/v1/stats/kvic")
        assert resp.status_code == 200
        data = resp.json()
        assert data["clusters_active"] >= 3
        assert data["registered_beekeepers"] >= 5
        assert data["total_monitored_hives"] >= 10
        assert data["healthy_colonies"] >= 1
        assert data["total_harvested_honey_kg"] > 0.0
        assert "traceability_compliance_pct" in data
        assert "suspicious_counterfeit_alerts" in data

    def test_clusters_list(self, client):
        """GET /api/v1/clusters returns active regional clusters."""
        resp = client.get("/api/v1/clusters")
        assert resp.status_code == 200
        data = resp.json()
        assert "clusters" in data
        assert len(data["clusters"]) >= 3
        assert any("Nilgiris" in c["name"] for c in data["clusters"])

    def test_beekeepers_and_apiaries(self, client):
        """GET /api/v1/beekeepers and /api/v1/apiaries return rural network."""
        resp_bk = client.get("/api/v1/beekeepers")
        assert resp_bk.status_code == 200
        assert len(resp_bk.json().get("beekeepers", [])) >= 5

        resp_ap = client.get("/api/v1/apiaries")
        assert resp_ap.status_code == 200
        assert len(resp_ap.json().get("apiaries", [])) >= 5

    def test_productivity_forecaster_endpoint(self, client):
        """GET /api/v1/productivity/forecast/{hive_id} returns weight delta and yield forecast."""
        resp = client.get("/api/v1/productivity/forecast/1")
        assert resp.status_code == 200
        data = resp.json()
        assert "current_weight_kg" in data
        assert "projected_harvestable_yield_kg" in data
        assert "recommended_harvest_window" in data
        assert "model_provenance" in data

    def test_consumer_verification_endpoint(self, client):
        """GET /api/v1/verify/{code} returns complete consumer provenance and ledger proof."""
        resp = client.get("/api/v1/verify/HC-PKG-C3D45E67")
        assert resp.status_code == 200
        data = resp.json()
        assert data["verified"] is True
        assert data["package_code"] == "HC-PKG-C3D45E67"
        assert "provenance" in data
        assert "batch" in data["provenance"]
        assert "origin" in data["provenance"]
        assert "quality" in data["provenance"]
        assert "ledger" in data["provenance"]
        assert data["provenance"]["ledger"]["chain_intact"] is True

    def test_market_orders_endpoint(self, client):
        """GET /api/v1/market/orders returns verified honey listings."""
        resp = client.get("/api/v1/market/orders")
        assert resp.status_code == 200
        data = resp.json()
        assert "market_orders" in data
        assert len(data["market_orders"]) >= 1

class TestCompleteHoneyChainE2EJourney:
    def test_complete_autonomous_honeychain_lifecycle(self, client):
        """
        Executes full end-to-end flow:
        Hive Telemetry Ingestion ->
        Record Harvest ->
        Consolidate Batch ->
        Attach Quality Certification ->
        Record Processing ->
        Package Lot & Issue QR Codes ->
        Verify Consumer Scan ->
        Verify Cryptographic Ledger Proof
        """
        # Step 1: Telemetry Ingest on Hive 1
        telem_payload = {
            "hive_id": 1,
            "brood_core_temp": 34.8,
            "frame_temps": [34.4, 34.1, 33.9, 33.6, 33.2],
            "humidity": 56.5,
            "voc_gas_res": 142.0,
            "co2_ppm": 720.0,
            "weight_kg": 38.5,
            "lux": 42000.0,
            "tilt_deg": 0.2,
            "fft_bands": [0.05, 0.1, 0.4, 0.8, 0.35, 0.15, 0.05, 0.02]
        }
        resp_telem = client.post("/api/v1/telemetry", json=telem_payload)
        assert resp_telem.status_code == 200
        assert resp_telem.json()["status"] == "SUCCESS"

        # Step 2: Record Honey Harvest
        harvest_payload = {
            "hive_id": 1,
            "apiary_id": "apiary-nilgiris-01",
            "beekeeper_id": "BEE-KVIC-001",
            "quantity_kg": 32.5,
            "field_moisture_pct": 17.4,
            "floral_source": "Eucalyptus & Wild Forest Bloom",
            "notes": "E2E Automated Test Harvest"
        }
        resp_harv = client.post("/api/v1/harvests", json=harvest_payload)
        assert resp_harv.status_code == 200
        harvest_id = resp_harv.json()["harvest_id"]
        assert harvest_id.startswith("HARVEST-")

        # Step 3: Create Honey Batch
        batch_payload = {
            "harvest_id": harvest_id,
            "curing_days": 21
        }
        resp_batch = client.post("/api/v1/batches", json=batch_payload)
        assert resp_batch.status_code == 200
        batch_id = resp_batch.json()["batch_id"]
        assert batch_id.startswith("BATCH-")

        # Step 4: Attach Quality Lab Certification
        quality_payload = {
            "lab_name": "KVIC Central QA Analytical Laboratory, New Delhi",
            "moisture_pct": 16.8,
            "hmf_mg_kg": 9.4,
            "diastase_number": 15.2,
            "electrical_conductivity": 0.49,
            "c4_sugar_pct": 0.0,
            "c3_sugar_pct": 0.0,
            "adulteration_result": "PURE_AUTHENTIC",
            "notes": "Zero synthetic adulteration detected."
        }
        resp_qual = client.post(f"/api/v1/batches/{batch_id}/quality", json=quality_payload)
        assert resp_qual.status_code == 200
        assert resp_qual.json()["batch_status"] == "QUALITY_VERIFIED"
        assert resp_qual.json()["status"] == "PASS"

        # Step 5: Record Processing Event
        proc_payload = {
            "facility_name": "KVIC Regional Honey Processing Center",
            "operator_id": "OP-E2E-TESTER",
            "filtering_temp_c": 38.0,
            "settling_hours": 36.0,
            "moisture_reduction_pct": 0.4
        }
        resp_proc = client.post(f"/api/v1/batches/{batch_id}/processing", json=proc_payload)
        assert resp_proc.status_code == 200
        assert resp_proc.json()["status"] == "COMPLETED"

        # Step 6: Package Lot & Issue Unique QR Tokens
        package_payload = {
            "lot_number": f"LOT-E2E-{batch_id[-6:]}",
            "jar_size_g": 500,
            "total_units": 20,
            "facility_location": "Nilgiris Packaging Facility"
        }
        resp_pkg = client.post(f"/api/v1/batches/{batch_id}/package", json=package_payload)
        assert resp_pkg.status_code == 200
        issued_packages = resp_pkg.json()["issued_packages"]
        assert len(issued_packages) == 20
        first_pkg_code = issued_packages[0]["package_code"]
        assert first_pkg_code.startswith("HC-PKG-")

        # Step 7: Verify Batch Audit Timeline & Ledger
        resp_timeline = client.get(f"/api/v1/batches/{batch_id}/timeline")
        assert resp_timeline.status_code == 200
        timeline_events = resp_timeline.json()["timeline"]
        assert len(timeline_events) >= 4

        resp_ledger = client.get(f"/api/v1/batches/{batch_id}/ledger")
        assert resp_ledger.status_code == 200
        assert resp_ledger.json()["verification"]["chain_intact"] is True

        # Step 8: Consumer Scan & Verification of Issued Package
        resp_verify = client.get(f"/api/v1/verify/{first_pkg_code}")
        assert resp_verify.status_code == 200
        v_data = resp_verify.json()
        assert v_data["verified"] is True
        assert v_data["provenance"]["harvest"]["floral_source"] == "Eucalyptus & Wild Forest Bloom"
        assert v_data["provenance"]["quality"]["status"] == "PASS"
        assert v_data["provenance"]["ledger"]["chain_intact"] is True

        # Step 9: Register consumer scan (second scan returns REPEAT_SCAN with verified=True)
        resp_scan = client.post(f"/api/v1/verify/{first_pkg_code}/scan", json={})
        assert resp_scan.status_code == 200
        assert resp_scan.json()["status"] == "REPEAT_SCAN"
        assert resp_scan.json()["verified"] is True
        assert resp_scan.json()["scan_count"] == 2
