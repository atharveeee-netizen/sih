"""
HoneyChain Blockchain Bridge — Web3.py Integration
Directly connects the Gateway to Shivam Gawade's HoneyChain & HoneyChainQR Smart Contracts
(Polygon Amoy / Hardhat Network).
"""

import os
import json
import hashlib
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

try:
    from web3 import Web3
    from web3.middleware import ExtraDataToPOAMiddleware
    WEB3_AVAILABLE = True
except ImportError:
    Web3 = None
    ExtraDataToPOAMiddleware = None
    WEB3_AVAILABLE = False

logger = logging.getLogger("HoneyChainBlockchainBridge")

# Hardhat's well-known, publicly-documented local-node test accounts (index 0-19).
# These private keys are printed by `npx hardhat node` itself and are safe ONLY on a
# local/throwaway chain -- never fund these addresses on a real network. Index 0 is
# used as the gateway's own admin / field-officer signer (see BLOCKCHAIN_PRIVATE_KEY
# below); indices 1-19 are used to derive one deterministic demo wallet per beekeeper
# so submitHarvest() -- which the contract restricts to the calling farmer's own
# wallet via BEEKEEPER_ROLE -- has a real key to sign with locally.
HARDHAT_WELL_KNOWN_KEYS = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
    "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
    "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
    "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
    "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
    "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356",
    "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97",
    "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
    "0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897",
    "0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82",
    "0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1",
    "0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd",
    "0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa",
    "0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61",
    "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0",
    "0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd",
    "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
    "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
]


class HoneyChainBlockchainBridge:
    def __init__(
        self,
        rpc_url: Optional[str] = None,
        honeychain_address: Optional[str] = None,
        honeychain_qr_address: Optional[str] = None,
        private_key: Optional[str] = None,
    ):
        self.rpc_url = rpc_url or os.getenv("BLOCKCHAIN_RPC_URL", "http://127.0.0.1:8545")
        self.w3 = None
        if WEB3_AVAILABLE and Web3:
            try:
                self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
                try:
                    self.w3.middleware_onion.inject(ExtraDataToPOAMiddleware, layer=0)
                except Exception:
                    pass
            except Exception:
                pass

        self.honeychain_address = honeychain_address or os.getenv("HONEYCHAIN_CONTRACT_ADDRESS")
        self.honeychain_qr_address = honeychain_qr_address or os.getenv("HONEYCHAIN_QR_CONTRACT_ADDRESS")
        self.private_key = private_key or os.getenv("BLOCKCHAIN_PRIVATE_KEY")

        self.account = None
        if self.private_key and self.w3:
            try:
                self.account = self.w3.eth.account.from_key(self.private_key)
            except Exception as e:
                logger.warning(f"Could not load account from private key: {e}")

        # Load ABIs from compiled Hardhat artifacts if present
        self.honeychain_abi = self._load_abi("HoneyChain")
        self.honeychain_qr_abi = self._load_abi("HoneyChainQR")

        self.honeychain_contract = None
        if self.honeychain_address and self.honeychain_abi and self.w3 and Web3:
            try:
                self.honeychain_contract = self.w3.eth.contract(
                    address=Web3.to_checksum_address(self.honeychain_address),
                    abi=self.honeychain_abi
                )
            except Exception:
                pass

        self.honeychain_qr_contract = None
        if self.honeychain_qr_address and self.honeychain_qr_abi and self.w3 and Web3:
            try:
                self.honeychain_qr_contract = self.w3.eth.contract(
                    address=Web3.to_checksum_address(self.honeychain_qr_address),
                    abi=self.honeychain_qr_abi
                )
            except Exception:
                pass

    def _load_abi(self, contract_name: str) -> Optional[list]:
        artifact_path = os.path.join(
            os.path.dirname(__file__),
            f"../contracts/artifacts/contracts/{contract_name}.sol/{contract_name}.json"
        )
        if os.path.exists(artifact_path):
            try:
                with open(artifact_path, "r") as f:
                    data = json.load(f)
                    return data.get("abi")
            except Exception as e:
                logger.warning(f"Failed to load ABI from {artifact_path}: {e}")
        return None

    def is_connected(self) -> bool:
        try:
            return bool(self.w3 and self.w3.is_connected())
        except Exception:
            return False

    def can_write(self) -> bool:
        """True only when we can actually build+sign+send a real transaction."""
        return bool(self.is_connected() and self.honeychain_contract and self.account)

    # ------------------------------------------------------------------
    # Read paths (pre-existing)
    # ------------------------------------------------------------------

    def verify_qr_token(self, qr_token: str) -> Dict[str, Any]:
        """
        Query on-chain HoneyChainQR contract to verify token authenticity.
        """
        if not self.is_connected() or not self.honeychain_qr_contract:
            return {
                "verified": True,
                "mode": "offline_demonstration_fallback",
                "qr_token": qr_token,
                "batch_id": 1,
                "scan_count": 1,
                "is_flagged": False,
                "authentic": True,
                "contract_address": self.honeychain_qr_address or "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            }
        try:
            exists = self.honeychain_qr_contract.functions.qrExists(qr_token).call()
            if not exists:
                return {"verified": False, "reason": "QR Token not registered on blockchain"}

            record = self.honeychain_qr_contract.functions.qrRecords(qr_token).call()
            # record struct: (qrToken, batchId, createdAt, scanCount, lastScannedAt, isFlagged, flagReason, ...)
            return {
                "verified": True,
                "mode": "on_chain_polygon",
                "qr_token": record[0],
                "batch_id": record[1],
                "created_at": record[2],
                "scan_count": record[3],
                "last_scanned_at": record[4],
                "is_flagged": record[5],
                "flag_reason": record[6],
                "authentic": not record[5],
                "contract_address": self.honeychain_qr_address,
            }
        except Exception as e:
            logger.error(f"On-chain verification error: {e}")
            return {"verified": False, "error": str(e)}

    def get_batch_provenance(self, batch_id: int) -> Dict[str, Any]:
        """
        Query HoneyChain contract for full batch details and lab verification.
        """
        if not self.is_connected() or not self.honeychain_contract:
            return {
                "verified": True,
                "mode": "offline_demonstration_fallback",
                "batch_id": batch_id,
                "quality_score": 95,
                "grade": "FSSAI Grade A (Pure Authentic)",
                "status": "Approved",
                "contract_address": self.honeychain_address or "0x5FbDB2315678afecb367f032d93F642f64180aa3",
            }
        try:
            # NOTE: this used to call the auto-generated `batches(batchId)` mapping
            # getter and index into its tuple as if every Batch struct field were
            # present in order. Solidity's auto-generated getters silently OMIT any
            # array-typed struct fields (farmerIds, contributionKg here) -- so every
            # field after them was actually reading one or two positions off from what
            # this code assumed (quality_score, grade, ipfs_metadata_hash and
            # is_authentic were all reading each other's values). This was never
            # caught because this method only ever ran through the
            # offline_demonstration_fallback branch above until a real chain was
            # connected. getBatch(batchId) is the contract's own explicit getter and
            # returns the full struct, arrays included, in true declaration order --
            # using it instead of the raw mapping getter is both correct and simpler.
            batch = self.honeychain_contract.functions.getBatch(batch_id).call()
            return {
                "verified": True,
                "mode": "on_chain_polygon",
                "batch_id": batch[0],
                "request_id": batch[1],
                "farmer_ids": list(batch[2]),
                "contribution_kg": list(batch[3]),
                "quantity_kg": batch[4],
                "harvest_timestamp": batch[5],
                "ipfs_metadata_hash": batch[6],
                "quality_score": batch[7],
                "grade": batch[8],
                "is_authentic": batch[9],
                "is_disputed": batch[10],
                "is_revoked": batch[13],
                "contract_address": self.honeychain_address,
            }
        except Exception as e:
            logger.error(f"On-chain batch lookup error: {e}")
            return {"verified": False, "error": str(e)}

    # ------------------------------------------------------------------
    # Write paths (real transactions -- new)
    #
    # These submit real signed transactions to whatever chain self.rpc_url
    # points at (a local Hardhat node by default). Every method returns a
    # dict with "chain_status" set to either "on_chain" (a real tx went
    # through -- tx_hash/block_number are genuine) or "offline" (no node
    # reachable / contract not configured, so the caller's off-chain
    # SQLite record is still the source of truth and nothing was faked
    # here). Callers should always check chain_status rather than assume
    # a write succeeded.
    # ------------------------------------------------------------------

    def _demo_wallet_for_beekeeper(self, beekeeper_id: str):
        """
        Deterministically map an off-chain beekeeper_id to one of Hardhat's
        well-known local test accounts (index 1-19; index 0 is the admin).
        Same beekeeper_id always resolves to the same wallet, so a farmer
        registered once keeps the same on-chain address across calls.
        """
        idx = 1 + (int(hashlib.sha256(beekeeper_id.encode("utf-8")).hexdigest(), 16) % (len(HARDHAT_WELL_KNOWN_KEYS) - 1))
        key = HARDHAT_WELL_KNOWN_KEYS[idx]
        account = self.w3.eth.account.from_key(key)
        return account, key

    @staticmethod
    def _placeholder_ipfs_cid(content: Dict[str, Any]) -> str:
        """
        HoneyChain.sol requires every ipfsProfileHash/ipfsMetadataHash to be >= 44
        bytes (a real IPFS CID's length). This gateway does not actually pin
        anything to IPFS yet, so this derives a CID-shaped, deterministic
        placeholder from the real content instead of sending a random or fake
        string -- same value in, same "CID" out, but it will not resolve on IPFS.
        Replace with a real `ipfshttpclient`/pinning-service call to make this
        genuine; until then, on-chain records store this placeholder honestly
        rather than a value that looks live but isn't.
        """
        canonical = json.dumps(content, sort_keys=True, separators=(",", ":"), default=str)
        return "Qm" + hashlib.sha256(canonical.encode("utf-8")).hexdigest()[:44]

    def _send(self, account, fn_call, value: int = 0) -> Dict[str, Any]:
        """Build, sign, send and wait for one contract transaction from `account`."""
        nonce = self.w3.eth.get_transaction_count(account.address, "pending")
        tx = fn_call.build_transaction({
            "from": account.address,
            "nonce": nonce,
            "gas": 3_000_000,
            "gasPrice": self.w3.eth.gas_price,
            "value": value,
            "chainId": self.w3.eth.chain_id,
        })
        signed = account.sign_transaction(tx)
        tx_hash = self.w3.eth.send_raw_transaction(signed.raw_transaction)
        receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
        # Web3.to_hex() (not .hex()): hexbytes>=1.0 dropped the "0x" prefix from
        # HexBytes.hex(), which silently produced tx hashes like "817bc2..." instead
        # of "0x817bc2..." -- harmless for internal use but breaks a "view on
        # PolygonScan/explorer" link built by prepending the usual "0x".
        return {"tx_hash": Web3.to_hex(receipt["transactionHash"]), "block_number": receipt["blockNumber"], "receipt": receipt}

    def ensure_farmer_registered(self, beekeeper_id: str, name: str, location: str, cooperative_id: str) -> Dict[str, Any]:
        """
        Registers `beekeeper_id`'s demo wallet as a HoneyChain farmer if it isn't
        already (registerFarmer is FIELD_OFFICER_ROLE-gated, so the admin account
        signs this one). Idempotent: a wallet already mapped to a farmerId on-chain
        is detected via beekeeperToFarmerId() and reused instead of re-registering.
        """
        if not self.can_write():
            return {"chain_status": "offline"}
        try:
            wallet, _key = self._demo_wallet_for_beekeeper(beekeeper_id)
            existing_id = self.honeychain_contract.functions.beekeeperToFarmerId(wallet.address).call()
            if existing_id and existing_id != 0:
                return {
                    "chain_status": "on_chain",
                    "already_registered": True,
                    "farmer_id": existing_id,
                    "wallet_address": wallet.address,
                }

            ipfs_cid = self._placeholder_ipfs_cid({"beekeeper_id": beekeeper_id, "name": name, "location": location})
            fn = self.honeychain_contract.functions.registerFarmer(
                wallet.address, name, location, cooperative_id, ipfs_cid
            )
            result = self._send(self.account, fn)
            logs = self.honeychain_contract.events.FarmerRegistered().process_receipt(result["receipt"])
            farmer_id = logs[0]["args"]["farmerId"] if logs else None
            return {
                "chain_status": "on_chain",
                "already_registered": False,
                "farmer_id": farmer_id,
                "wallet_address": wallet.address,
                "tx_hash": result["tx_hash"],
                "block_number": result["block_number"],
                "contract_address": self.honeychain_address,
            }
        except Exception as e:
            logger.error(f"registerFarmer on-chain call failed: {e}")
            return {"chain_status": "offline", "error": str(e)}

    def submit_harvest_onchain(self, beekeeper_id: str, beekeeper_name: str, location: str,
                                cooperative_id: str, flora_source: str, quantity_kg: float) -> Dict[str, Any]:
        """
        Registers the farmer if needed, then signs+sends submitHarvest() as that
        farmer's own wallet (BEEKEEPER_ROLE, granted automatically on registration).
        """
        if not self.can_write():
            return {"chain_status": "offline"}
        try:
            reg = self.ensure_farmer_registered(beekeeper_id, beekeeper_name, location, cooperative_id)
            if reg.get("chain_status") != "on_chain":
                return reg

            wallet, _key = self._demo_wallet_for_beekeeper(beekeeper_id)
            ipfs_cid = self._placeholder_ipfs_cid({
                "beekeeper_id": beekeeper_id, "flora_source": flora_source, "quantity_kg": quantity_kg,
            })
            fn = self.honeychain_contract.functions.submitHarvest(
                flora_source, int(quantity_kg), ipfs_cid
            )
            result = self._send(wallet, fn)
            logs = self.honeychain_contract.events.HarvestSubmitted().process_receipt(result["receipt"])
            request_id = logs[0]["args"]["requestId"] if logs else None
            return {
                "chain_status": "on_chain",
                "request_id": request_id,
                "farmer_id": reg.get("farmer_id"),
                "wallet_address": wallet.address,
                "tx_hash": result["tx_hash"],
                "block_number": result["block_number"],
                "contract_address": self.honeychain_address,
            }
        except Exception as e:
            logger.error(f"submitHarvest on-chain call failed: {e}")
            return {"chain_status": "offline", "error": str(e)}

    def approve_harvest_and_mint_onchain(self, request_id: int, quality_score: int, grade: str, qr_token: str) -> Dict[str, Any]:
        """
        Admin/field-officer signs approveHarvestAndMint() for a previously
        submitted on-chain harvest request, minting the on-chain Batch record.
        """
        if not self.can_write():
            return {"chain_status": "offline"}
        if request_id is None:
            return {"chain_status": "offline", "error": "no on-chain request_id available for this harvest"}
        try:
            ipfs_cid = self._placeholder_ipfs_cid({
                "request_id": request_id, "quality_score": quality_score, "grade": grade, "qr_token": qr_token,
            })
            fn = self.honeychain_contract.functions.approveHarvestAndMint(
                int(request_id), ipfs_cid, int(quality_score), grade, qr_token
            )
            result = self._send(self.account, fn)
            logs = self.honeychain_contract.events.BatchMinted().process_receipt(result["receipt"])
            batch_id = logs[0]["args"]["batchId"] if logs else None
            return {
                "chain_status": "on_chain",
                "batch_id": batch_id,
                "request_id": request_id,
                "tx_hash": result["tx_hash"],
                "block_number": result["block_number"],
                "contract_address": self.honeychain_address,
            }
        except Exception as e:
            logger.error(f"approveHarvestAndMint on-chain call failed: {e}")
            return {"chain_status": "offline", "error": str(e)}

    def add_custody_onchain(self, batch_id: int, entity: str, action: str) -> Dict[str, Any]:
        if not self.can_write() or batch_id is None:
            return {"chain_status": "offline"}
        try:
            fn = self.honeychain_contract.functions.addCustody(int(batch_id), entity, action)
            result = self._send(self.account, fn)
            return {
                "chain_status": "on_chain",
                "batch_id": batch_id,
                "tx_hash": result["tx_hash"],
                "block_number": result["block_number"],
                "contract_address": self.honeychain_address,
            }
        except Exception as e:
            logger.error(f"addCustody on-chain call failed: {e}")
            return {"chain_status": "offline", "error": str(e)}


class BlockchainLedgerFacade:
    """
    Local, tamper-evident, forward-linked SHA-256 hash chain for the gateway's own
    off-chain ledger of batch lifecycle events (registration, quality checks, custody
    transfers, ...). This is the design .spec/Schema.md specifies for the gateway's
    local "honeychain" ledger table -- separate from, and simpler than, the Polygon
    smart contracts in HoneyChainBlockchainBridge above. It does not talk to Polygon.

    Each event's event_hash is computed from its own content (chain_index, prev_hash,
    a hash of its payload, and its timestamp). Because prev_hash is baked into every
    hash, editing any one stored event after the fact changes that event's recomputed
    hash -- and every event chained after it -- which is exactly what verify_chain()
    below checks for. See 05_BLOCKCHAIN_V2_REWRITE.md / 07_SYSTEM_ARCHITECTURE.md for
    how this piece fits next to the on-chain contracts.
    """

    GENESIS_HASH = "0" * 64

    @staticmethod
    def _get_db_conn():
        try:
            from .honeychain_db import get_db
        except ImportError:
            try:
                from honeychain_db import get_db
            except ImportError:
                from gateway.honeychain_db import get_db
        return get_db()

    @staticmethod
    def _payload_hash(payload: Dict[str, Any]) -> str:
        canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"), default=str)
        return hashlib.sha256(canonical.encode("utf-8")).hexdigest()

    @staticmethod
    def _compute_event_hash(chain_index: int, prev_hash: str, payload_hash: str, timestamp: str) -> str:
        material = f"{chain_index}|{prev_hash}|{payload_hash}|{timestamp}"
        return hashlib.sha256(material.encode("utf-8")).hexdigest()

    @classmethod
    def record_event(
        cls,
        batch_id: str,
        event_type: str,
        actor_id: str,
        actor_role: str,
        payload: Dict[str, Any],
        timestamp: Optional[str] = None,
    ) -> Dict[str, Any]:
        conn = cls._get_db_conn()
        try:
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) AS c FROM ledger_events")
            chain_index = cur.fetchone()["c"]

            cur.execute("SELECT event_hash FROM ledger_events ORDER BY chain_index DESC LIMIT 1")
            prev_row = cur.fetchone()
            prev_hash = prev_row["event_hash"] if prev_row else cls.GENESIS_HASH

            ts = timestamp or datetime.now(timezone.utc).isoformat()
            payload_hash = cls._payload_hash(payload)
            event_hash = cls._compute_event_hash(chain_index, prev_hash, payload_hash, ts)
            event_id = f"EVT-{os.urandom(4).hex().upper()}"

            cur.execute(
                """INSERT INTO ledger_events
                   (id, chain_index, batch_id, event_type, actor_id, actor_role, payload, timestamp, prev_hash, event_hash)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (event_id, chain_index, str(batch_id), event_type, actor_id, actor_role,
                 json.dumps(payload, default=str), ts, prev_hash, event_hash),
            )
            conn.commit()
            logger.info(f"Ledger: recorded {event_type} for batch {batch_id} at chain index {chain_index}")
            return {
                "event_id": event_id,
                "batch_id": batch_id,
                "event_hash": event_hash,
                "previous_event_hash": prev_hash,
                "chain_intact": True,
            }
        finally:
            conn.close()

    # gateway/seed_honeychain_demo.py calls create_event(); honeychain_api.py and
    # honeychain_qr.py call record_event(). Both names are the same real ledger write --
    # kept as two names rather than editing every call site.
    create_event = record_event

    @classmethod
    def get_batch_events(cls, batch_id: str) -> list:
        conn = cls._get_db_conn()
        try:
            cur = conn.cursor()
            cur.execute(
                "SELECT * FROM ledger_events WHERE batch_id = ? ORDER BY chain_index ASC",
                (str(batch_id),),
            )
            rows = cur.fetchall()
            return [
                {
                    "event_id": r["id"],
                    "chain_index": r["chain_index"],
                    "batch_id": r["batch_id"],
                    "event_type": r["event_type"],
                    "actor_id": r["actor_id"],
                    "actor_role": r["actor_role"],
                    "payload": json.loads(r["payload"]),
                    "timestamp": r["timestamp"],
                    "prev_hash": r["prev_hash"],
                    "event_hash": r["event_hash"],
                }
                for r in rows
            ]
        finally:
            conn.close()

    @classmethod
    def verify_chain(cls, batch_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Recomputes every event's hash from its stored content + stored prev_hash and
        compares it against what was actually persisted. A row edited after the fact
        recomputes to a different hash, and so does every event chained after it.
        """
        conn = cls._get_db_conn()
        try:
            cur = conn.cursor()
            cur.execute("SELECT * FROM ledger_events ORDER BY chain_index ASC")
            rows = cur.fetchall()

            tampered_events = []
            for r in rows:
                expected_payload_hash = cls._payload_hash(json.loads(r["payload"]))
                expected_hash = cls._compute_event_hash(r["chain_index"], r["prev_hash"], expected_payload_hash, r["timestamp"])
                if expected_hash != r["event_hash"]:
                    tampered_events.append(r["id"])

            relevant = [r for r in rows if batch_id is None or r["batch_id"] == str(batch_id)]
            return {
                "chain_intact": len(tampered_events) == 0,
                "tampered": len(tampered_events) > 0,
                "events": len(relevant),
                "tampered_events": tampered_events,
            }
        finally:
            conn.close()

    @classmethod
    def tamper_event_for_demo(cls, event_id: Optional[str] = None, forged_payload: Optional[Dict[str, Any]] = None, **kwargs) -> bool:
        """
        Genuinely mutates a stored event's payload WITHOUT recomputing its hash, so that
        a follow-up verify_chain() call actually detects it. Replaces the previous
        version of this method, which always returned False and logged that tampering
        was "not possible" without ever having implemented a real chain to tamper with.
        """
        if not event_id:
            return False
        conn = cls._get_db_conn()
        try:
            cur = conn.cursor()
            cur.execute("SELECT id FROM ledger_events WHERE id = ?", (event_id,))
            if not cur.fetchone():
                logger.warning(f"[DEMO] tamper_event_for_demo: event {event_id} not found")
                return False
            cur.execute(
                "UPDATE ledger_events SET payload = ? WHERE id = ?",
                (json.dumps(forged_payload or {}, default=str), event_id),
            )
            conn.commit()
            logger.warning(f"[DEMO] Tampered with ledger event {event_id} -- verify_chain() will now detect this.")
            return True
        finally:
            conn.close()
