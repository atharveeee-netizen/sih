"""
DEMO SCRIPT 1: Harvest -> Batch -> Quality -> Package -> Real On-Chain Mint

Run this against the REAL running gateway server (python3 server.py),
which must itself be connected to a running local Hardhat node.
This calls the real HTTP API exactly as the frontend/mobile app would --
nothing here talks to the blockchain bridge directly.
"""
import requests
import json
import sys
import uuid

BASE = "http://127.0.0.1:8000/api/v1"

def step(title):
    print(f"\n{'='*70}\n{title}\n{'='*70}")

def show(resp):
    print(f"HTTP {resp.status_code}")
    try:
        body = resp.json()
        print(json.dumps(body, indent=2))
        return body
    except Exception:
        print(resp.text)
        sys.exit(1)

def check(resp, label):
    if resp.status_code >= 400:
        print(f"\n!!! {label} FAILED with HTTP {resp.status_code}")
        print(resp.text)
        sys.exit(1)

step("0. Confirm blockchain connectivity")
r = requests.get(f"{BASE}/blockchain/status")
status = show(r)
if status.get("status") != "CONNECTED":
    print("\n!!! Blockchain is not connected. Start the Hardhat node + deploy_local.js first.")
    sys.exit(1)

step("1. Submit a harvest (beekeeper submits raw honey for review)")
r = requests.post(f"{BASE}/harvests", json={
    "hive_id": 1,
    "apiary_id": "APIARY-NILGIRIS-01",
    "beekeeper_id": "BK-TN-2026-001",
    "quantity_kg": 42.0,
    "field_moisture_pct": 18.5,
    "floral_source": "Wild Forest / Nilgiris",
    "notes": "Demo harvest for SIH jury walkthrough"
})
check(r, "POST /harvests")
harvest = show(r)
harvest_id = harvest["harvest_id"]
chain_info = harvest.get("chain", {})
print(f"\n--> harvest_id = {harvest_id}")
print(f"--> on-chain tx_hash = {chain_info.get('tx_hash')}")
print(f"--> on-chain block_number = {chain_info.get('block_number')}")

step("2. Create a batch from this harvest (KVIC officer groups it for approval)")
r = requests.post(f"{BASE}/batches", json={
    "harvest_id": harvest_id,
    "curing_days": 21
})
check(r, "POST /batches")
batch = show(r)
batch_id = batch["batch_id"]
print(f"\n--> batch_id = {batch_id}")

step("3. Record a lab quality test on the batch (real pass/fail thresholds)")
r = requests.post(f"{BASE}/batches/{batch_id}/quality", json={
    "lab_name": "KVIC Regional Testing Lab, Coimbatore",
    "moisture_pct": 17.8,
    "hmf_mg_kg": 8.2,
    "diastase_number": 22.5,
    "electrical_conductivity": 0.38,
    "c4_sugar_pct": 0.6,
    "c3_sugar_pct": 0.0,
    "adulteration_result": "PURE_AUTHENTIC",
    "notes": "Demo lab test - passes FSSAI purity thresholds"
})
check(r, "POST /batches/{id}/quality")
quality = show(r)

step("4. Attach packaging -> this is what triggers the REAL on-chain mint")
lot_number = f"LOT-DEMO-{uuid.uuid4().hex[:6].upper()}"
r = requests.post(f"{BASE}/batches/{batch_id}/package", json={
    "lot_number": lot_number,
    "jar_size_g": 500,
    "total_units": 50,
    "expiry_date": "2028-08-30",
    "facility_location": "KVIC Regional Packaging Center, Coimbatore"
})
check(r, "POST /batches/{id}/package")
# The response is large (50 issued QR packages) -- print a trimmed view.
body = r.json()
trimmed = {k: v for k, v in body.items() if k != "issued_packages"}
trimmed["issued_packages"] = f"[{len(body.get('issued_packages', []))} packages, showing first]"
trimmed["first_package"] = body.get("issued_packages", [None])[0]
print(json.dumps(trimmed, indent=2))
chain_info = body.get("chain", {})
onchain_batch_id = chain_info.get("batch_id")
print(f"\n--> chain.chain_status = {chain_info.get('chain_status')}")
print(f"--> chain.tx_hash = {chain_info.get('tx_hash')}")
print(f"--> chain.batch_id (on-chain numeric id) = {onchain_batch_id}")

if chain_info.get("chain_status") != "on_chain" or onchain_batch_id is None:
    print("\n!!! Minting did not complete on-chain -- stopping before step 5.")
    sys.exit(1)

step("5. Read the batch straight back off the blockchain (not the local DB)")
r = requests.get(f"{BASE}/blockchain/batch/{onchain_batch_id}")
check(r, "GET /blockchain/batch/{id}")
onchain = show(r)

step("DONE - full pipeline result")
print(json.dumps({
    "harvest_id": harvest_id,
    "batch_id": batch_id,
    "onchain_batch_record": onchain
}, indent=2))
