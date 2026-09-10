"""
DEMO SCRIPT 2: Local Ledger Tamper-Evidence Demonstration

This is DELIBERATELY SEPARATE from the blockchain (demo_harvest_to_mint.py).
This demonstrates the gateway's own forward-linked SHA-256 hash chain
(BlockchainLedgerFacade in blockchain_bridge.py) -- a local, tamper-evident
audit log of every lifecycle event on a batch. It is NOT a distributed
ledger and NOT the smart contract. Say that explicitly to the jury:
"This ledger is a cryptographic hash chain, similar in principle to how
blocks link in a blockchain, but it runs locally on this gateway -- the
actual blockchain transactions are the other demo."

Flow:
  1. Create a fresh harvest + batch (this creates a HARVEST_RECORDED ledger event)
  2. Add a quality test on top (exercises the rest of the pipeline; the ledger
     chain itself grows across ALL batches system-wide, not just this one)
  3. Verify the chain -- should report intact
  4. Tamper with one event via the real jury endpoint (/api/v1/demo/tamper)
  5. Verify the chain again -- should now report broken, and name the exact
     tampered event
"""
import requests
import json
import sys

BASE = "http://127.0.0.1:8000/api/v1"

def step(title):
    print(f"\n{'='*70}\n{title}\n{'='*70}")

def show(resp):
    print(f"HTTP {resp.status_code}")
    body = resp.json()
    print(json.dumps(body, indent=2))
    return body

def check(resp, label):
    if resp.status_code >= 400:
        print(f"\n!!! {label} FAILED with HTTP {resp.status_code}")
        print(resp.text)
        sys.exit(1)

step("1. Create a harvest + batch (this alone writes a HARVEST_RECORDED ledger event)")
r = requests.post(f"{BASE}/harvests", json={
    "hive_id": 2,
    "apiary_id": "APIARY-NILGIRIS-01",
    "beekeeper_id": "BK-TN-2026-001",
    "quantity_kg": 30.0,
    "field_moisture_pct": 19.0,
    "floral_source": "Wild Forest / Nilgiris",
    "notes": "Demo harvest for tamper-evidence walkthrough"
})
check(r, "POST /harvests")
harvest = r.json()
harvest_id = harvest["harvest_id"]
print(f"--> harvest_id = {harvest_id} (ledger uses this as batch_id key)")

r = requests.post(f"{BASE}/batches", json={"harvest_id": harvest_id, "curing_days": 21})
check(r, "POST /batches")
batch = r.json()
batch_id = batch["batch_id"]
print(f"--> batch_id = {batch_id}")

step("2. Add a quality test -> writes another ledger event on the same chain")
r = requests.post(f"{BASE}/batches/{batch_id}/quality", json={
    "lab_name": "KVIC Regional Testing Lab, Coimbatore",
    "moisture_pct": 18.0,
    "hmf_mg_kg": 9.0,
    "diastase_number": 21.0,
    "electrical_conductivity": 0.40,
    "adulteration_result": "PURE_AUTHENTIC",
    "notes": "Demo lab test"
})
check(r, "POST /batches/{id}/quality")
show(r)

step("3. Read the ledger for the HARVEST (note: ledger is keyed by harvest_id, not batch_id)")
r = requests.get(f"{BASE}/batches/{harvest_id}/ledger")
check(r, "GET /batches/{id}/ledger")
ledger = show(r)
events = ledger["events"]
if len(events) < 1:
    print("\n!!! No ledger events found -- cannot continue tamper demo.")
    sys.exit(1)
print(f"\n--> {len(events)} event(s) on this chain")
print(f"--> verification BEFORE tamper: {ledger['verification']}")
if not ledger["verification"].get("chain_intact", ledger["verification"].get("intact")):
    print("\n!!! Chain already reports broken before we tampered with anything -- unexpected.")
    sys.exit(1)

target_event = events[0]
target_event_id = target_event.get("event_id") or target_event.get("id")
print(f"\n--> will tamper with event: {target_event_id} ({target_event.get('event_type')})")

step("4. Tamper with that event via the jury endpoint (silently forges the payload)")
r = requests.post(f"{BASE}/demo/tamper", json={
    "event_id": target_event_id,
    "forged_moisture_pct": 24.5
})
check(r, "POST /demo/tamper")
show(r)

step("5. Verify the chain again -- should now be caught")
r = requests.get(f"{BASE}/batches/{harvest_id}/verify")
check(r, "GET /batches/{id}/verify")
after = show(r)

intact_after = after.get("chain_intact", after.get("intact"))
if intact_after:
    print("\n!!! Tamper was NOT detected -- this is a real bug, chain should report broken.")
    sys.exit(1)
else:
    tampered_list = after.get("tampered_events", [])
    print(f"\n--> Tamper correctly detected. Tampered event(s): {tampered_list}")
    if target_event_id not in tampered_list:
        print(f"!!! WARNING: detected tamper does not name the event we actually tampered ({target_event_id})")

step("DONE")
print("Local hash-chain ledger correctly went from intact -> broken after tampering,")
print("and named the exact event that was touched. Remember to tell the jury this is")
print("the LOCAL ledger, separate from the on-chain smart contract demo.")
