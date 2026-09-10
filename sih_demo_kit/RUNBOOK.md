# HoneyChain Blockchain Demo — Runbook

This folder is self-contained. Everything in it has been tested end-to-end,
including a full fresh install from scratch. You don't need anything else
from the main repo to run this demo.

**What this demo actually shows**: two separate things, and you must keep
them separate :

1. **A real blockchain transaction.** The gateway server signs and sends a
   real transaction to a real smart contract (`HoneyChain.sol`) running on a
   local practice blockchain node (Hardhat — same technology Ethereum/Polygon
   use, just running on your own laptop instead of the public internet). This
   is Script 1 below.
2. **A local tamper-evident ledger.** A separate mechanism — a SHA-256
   hash chain, the same *idea* as blockchain block-linking, but running
   locally in the gateway's own database, no network, no smart contract. This
   is Script 2 below.

If a judge asks "is this on the real blockchain?" — the honest answer is:
"The smart contract transactions are real, running against a local practice
network right now for the demo. To go live on Polygon's public network we'd
swap one RPC URL and fund a wallet — the contract code itself doesn't change."

---

## 0. One-time setup (do this before the day of the demo)

You need Node.js, npm, and Python 3 installed. Everything else installs
into this folder.

```bash
cd sih_demo_kit/contracts
npm install
```

This pulls in Hardhat (the local blockchain node) and `solc` (the Solidity
compiler), among other things. Takes 30-60 seconds. Only needs to be done
once (or again if you delete `node_modules`).

```bash
cd sih_demo_kit/gateway
pip install -r requirements.txt --break-system-packages
```

(Drop `--break-system-packages` if your Python setup doesn't need it.)

---

## 1. Every time you want to run the demo — 3 terminals

**Terminal A — the local blockchain node.** This is your "practice
Polygon network." Leave it running the whole time.

```bash
cd sih_demo_kit/contracts
node compile.js
npx hardhat node
```

Leave this terminal open. You'll see a list of 20 test accounts with fake
ETH — that's normal, it's a local sandbox.

**Terminal B — deploy the contracts to that node.** Run once after
starting the node (every time you restart the node, you must redeploy):

```bash
cd sih_demo_kit/contracts
node deploy_local.js
```

You should see:
```
HoneyChain deployed: 0x5FbDB2315678afecb367f032d93F642f64180aa3
HoneyChainQR deployed: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

These exact addresses are not random — a fresh Hardhat node always
produces them, and `gateway/.env` is already pre-filled to match. If you
ever see different addresses here, update `gateway/.env` to match before
continuing.

**Terminal B (same terminal, next) — start the gateway server:**

```bash
cd sih_demo_kit/gateway
source venv/bin/activate
python3 server.py
```

Wait for `Application startup complete.` (it prints twice — that's normal,
the server runs 2 worker processes). Leave this running too.

**Terminal C — sanity check, then run the actual demo scripts:**

```bash
curl http://127.0.0.1:8000/api/v1/blockchain/status
```

You want to see `"status": "CONNECTED"`. If you see `DEMO_FALLBACK`
instead, the gateway can't reach the Hardhat node — check Terminal A is
still running.

Now run the two demo scripts, in order:

```bash
cd sih_demo_kit/scripts
python3 demo_harvest_to_mint.py
python3 demo_tamper_evidence.py
```

Both print a step-by-step trace and exit cleanly (exit code 0) if
everything works. If either one fails partway, re-read the printed error —
it tells you exactly which HTTP call failed and why.

---

## 2. What `demo_harvest_to_mint.py` does, and what to say at each step

This is your main "look, it's real" demo. Narrate it like this as it runs:

1. **Checks blockchain connectivity.** *"This confirms the gateway is
   actually talking to a live smart contract, not faking it."*
2. **Submits a harvest.** A beekeeper reports 42kg of honey. Behind the
   scenes, this is the beekeeper's own on-chain wallet signing and sending
   a real transaction (`submitHarvest`) to the contract. *"This transaction
   hash and block number are real — they came back from an actual blockchain
   node."*
3. **Creates a batch.** This groups the harvest for review — an off-chain
   administrative step (a KVIC field officer would do this in the real app).
4. **Records a lab quality test.** Real pass/fail thresholds — moisture,
   HMF, diastase — the same numbers a food-safety lab would report.
5. **Attaches packaging — this is the big moment.** This is what actually
   triggers the second real transaction: `approveHarvestAndMint`. The
   contract mints an official on-chain batch record, atomically bundling
   the quality score, grade, and QR code together — you can't have one
   without the other. *"This is the anti-fraud guarantee: a jar's QR code
   cannot exist on-chain unless a real quality test passed first."*
6. **Reads the batch straight back off the blockchain** — not from the
   local database. *"I'm not showing you our own database record — I'm
   showing you what the smart contract itself says, independently."*

The final `onchain_batch_record` shows `grade`, `quality_score`,
`is_authentic: true`, and the real `contract_address` — that's your closing
visual.

---

## 3. What `demo_tamper_evidence.py` does, and what to say

**Say this explicitly before you run it**: *"This next part is a
different mechanism — a local tamper-evident ledger, not the blockchain
transaction you just saw. It's the same cryptographic idea — each record
is hash-linked to the one before it, so touching an old record breaks the
chain — but it runs locally on the gateway, not on a distributed network.
I want to be upfront about that distinction."*

Then run it and narrate:

1. Creates a harvest (writes one ledger event).
2. Adds a quality test.
3. **Verifies the chain — reports intact.** Show the `chain_intact: true`.
4. **Tampers with one event** — via a real endpoint that mutates the
   stored record without recomputing its hash (this simulates someone
   editing the database directly, bypassing the app).
5. **Verifies again — now reports broken**, and names the *exact* event
   that was touched. *"Nothing else in the chain changed, but the system
   knows precisely which record was falsified — that's the tamper-evidence
   guarantee."*

---

## 4. If something breaks during rehearsal

- **`blockchain/status` shows `DEMO_FALLBACK`**: Terminal A (Hardhat node)
  isn't running, or `gateway/.env` addresses don't match what
  `deploy_local.js` printed. Restart Terminal A, redeploy, check `.env`.
- **A demo script fails on step 1 or 2 with a connection error**: the
  gateway server (Terminal B) isn't running or crashed — check its output
  for a traceback.
- **You restart the Hardhat node mid-rehearsal**: you MUST run
  `node deploy_local.js` again — a fresh node has no contracts on it yet.
  You do not need to restart the gateway server itself unless the
  addresses changed.
- **You want a fully clean slate**: stop the gateway (Ctrl+C in Terminal
  B), delete `gateway/honeychain.db*`, restart the Hardhat node, redeploy,
  restart the gateway. This gives you a fresh 100-hive registry and an
  empty ledger/chain state.
- **Run the scripts more than once**: totally fine — each run creates a
  new harvest/batch with fresh IDs, and batch numbers on-chain just keep
  incrementing (batch 1, 2, 3...). Rehearse as many times as you want.

---

## 5. Files in this kit

```
sih_demo_kit/
  RUNBOOK.md              <- this file
  gateway/                <- the real gateway server (with 4 bug fixes
                              applied and verified — see note below)
    server.py
    blockchain_bridge.py
    honeychain_db.py
    honeychain_api.py
    honeychain_qr.py
    .env                  <- pre-filled for a fresh local Hardhat deploy
    requirements.txt
  contracts/
    contracts/HoneyChain.sol
    contracts/HoneyChainQR.sol
    compile.js            <- compiles without needing the blocked
                              binaries.soliditylang.org download
    deploy_local.js
    hardhat.config.js
    package.json
  scripts/
    demo_harvest_to_mint.py     <- Section 2 above
    demo_tamper_evidence.py     <- Section 3 above
```

**Note on the bug fixes**: while building and testing this kit, I found
and fixed 5 real bugs in `server.py`/`blockchain_bridge.py` that were
blocking the server from starting at all on a fresh database (a missing
`location` column migration, a missing `apiary_id`/`beekeeper_id` seed, a
startup-order bug that left the demo beekeeper's own referenced rows
missing, a race condition between the server's two worker processes
seeding the same 100 hives at once, and a `tx_hash` formatting bug that
silently dropped the `0x` prefix). None of these are in your main repo's
`gateway/` folder yet — only in this kit. If you want them applied to the
main repo too, just ask and I'll send them over the same way, but this
kit works standing entirely on its own for the demo.
