"""
BEEVIL KNIEVEL — BLOCKCHAIN INTEGRATION CLIENT (Linux / Raspberry Pi CM4)
========================================================================
Handles secure publishing of IoT honey batches and AI diagnostics hashes
to the EVM-compatible HoneyChain Smart Contract.
"""

import os
import sys
import json
import hashlib
from typing import Dict, Any, Optional
from eth_account import Account
try:
    from web3 import Web3
    WEB3_AVAILABLE = True
except ImportError:
    WEB3_AVAILABLE = False

# Smart Contract ABI definitions (for HoneyBatchTraceability)
CONTRACT_ABI = [
    {
        "inputs": [
            {"internalType": "string", "name": "_batchId", "type": "string"},
            {"internalType": "string", "name": "_producerId", "type": "string"},
            {"internalType": "string", "name": "_hiveLocation", "type": "string"},
            {"internalType": "uint256", "name": "_harvestDate", "type": "uint256"},
            {"internalType": "bytes32", "name": "_qualityMetricsHash", "type": "bytes32"},
            {"internalType": "bytes32", "name": "_aiDiagnosticsHash", "type": "bytes32"}
        ],
        "name": "createBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "_batchId", "type": "string"}
        ],
        "name": "getBatch",
        "outputs": [
            {"internalType": "string", "name": "batchId", "type": "string"},
            {"internalType": "string", "name": "producerId", "type": "string"},
            {"internalType": "string", "name": "hiveLocation", "type": "string"},
            {"internalType": "uint256", "name": "harvestDate", "type": "uint256"},
            {"internalType": "bytes32", "name": "qualityMetricsHash", "type": "bytes32"},
            {"internalType": "bytes32", "name": "aiDiagnosticsHash", "type": "bytes32"},
            {"internalType": "address", "name": "currentOwner", "type": "address"},
            {"internalType": "bool", "name": "isAuthentic", "type": "bool"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class HoneyChainClient:
    def __init__(
        self,
        rpc_url: str = "http://127.0.0.1:8545",
        contract_address: Optional[str] = None,
        private_key: Optional[str] = None
    ):
        self.rpc_url = rpc_url
        self.contract_address = contract_address
        self.private_key = private_key or os.getenv("HONEY_CHAIN_PRIVATE_KEY")
        
        self.w3 = None
        self.contract = None
        self.account = None
        
        if WEB3_AVAILABLE:
            try:
                self.w3 = Web3(Web3.HTTPProvider(rpc_url))
                if self.w3.is_connected() and contract_address:
                    self.contract = self.w3.eth.contract(
                        address=Web3.to_checksum_address(contract_address),
                        abi=CONTRACT_ABI
                    )
                if self.private_key:
                    self.account = Account.from_key(self.private_key)
            except Exception as e:
                print(f"[Blockchain] Error initializing Web3 connection: {e}")

    @staticmethod
    def compute_ai_diagnostics_hash(ai_result: Dict[str, Any]) -> bytes:
        """
        Computes keccak256 hash of AI diagnostics outputs to store immutably.
        Ensures strict data integrity of the on-device Edge inference.
        """
        # Clean and sort diagnostic keys for determinism
        cleaned_data = {
            "diagnosis": ai_result.get("diagnosis", "UNKNOWN"),
            "confidence": float(ai_result.get("confidence", 0.0)),
            "inference_ms": float(ai_result.get("inference_ms", 0.0))
        }
        serialized = json.dumps(cleaned_data, sort_keys=True).encode('utf-8')
        
        if WEB3_AVAILABLE:
            return Web3.keccak(serialized)
        else:
            # Fallback to standard sha256 if web3 library is missing
            return hashlib.sha256(serialized).digest()

    @staticmethod
    def compute_quality_hash(metrics: Dict[str, Any]) -> bytes:
        """
        Computes keccak256 hash of laboratory quality metrics.
        (e.g., moisture %, HMF content, pollen count).
        """
        serialized = json.dumps(metrics, sort_keys=True).encode('utf-8')
        if WEB3_AVAILABLE:
            return Web3.keccak(serialized)
        else:
            return hashlib.sha256(serialized).digest()

    def log_honey_batch(
        self,
        batch_id: str,
        producer_id: str,
        hive_location: str,
        harvest_date_timestamp: int,
        quality_metrics: Dict[str, Any],
        ai_diagnostics: Dict[str, Any]
    ) -> Optional[str]:
        """
        Registers a new honey batch to the smart contract using gateway signing.
        """
        print(f"[Blockchain] Registering Batch {batch_id} on-chain...")
        
        quality_hash = self.compute_quality_hash(quality_metrics)
        ai_hash = self.compute_ai_diagnostics_hash(ai_diagnostics)
        
        if not WEB3_AVAILABLE or not self.w3 or not self.contract or not self.account:
            print("[Blockchain] Web3 client offline or private key missing. Running in dry-run mode.")
            print(f"  Batch ID: {batch_id}")
            print(f"  Producer ID: {producer_id}")
            print(f"  Hive Location: {hive_location}")
            print(f"  Quality Metrics Hash: 0x{quality_hash.hex()}")
            print(f"  AI Diagnostics Hash: 0x{ai_hash.hex()}")
            return "0x_MOCK_TX_HASH_DRY_RUN_"

        try:
            # Check gateway account balance
            sender_address = self.account.address
            balance = self.w3.eth.get_balance(sender_address)
            if balance == 0:
                print(f"[Blockchain] Error: Gateway account {sender_address} has zero balance.")
                return None

            # Build transaction
            nonce = self.w3.eth.get_transaction_count(sender_address)
            gas_estimate = self.contract.functions.createBatch(
                batch_id,
                producer_id,
                hive_location,
                harvest_date_timestamp,
                quality_hash,
                ai_hash
            ).estimate_gas({"from": sender_address})

            tx = self.contract.functions.createBatch(
                batch_id,
                producer_id,
                hive_location,
                harvest_date_timestamp,
                quality_hash,
                ai_hash
            ).build_transaction({
                "from": sender_address,
                "gas": int(gas_estimate * 1.2), # Add 20% safety margin
                "gasPrice": self.w3.eth.gas_price,
                "nonce": nonce
            })

            # Sign transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx, private_key=self.private_key)
            
            # Send transaction
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            print(f"[Blockchain] Transaction submitted! Hash: {self.w3.to_hex(tx_hash)}")
            
            # Wait for block confirmation
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
            if receipt.status == 1:
                print(f"[Blockchain] Successfully logged batch {batch_id} to block #{receipt.blockNumber}!")
                return self.w3.to_hex(tx_hash)
            else:
                print(f"[Blockchain] Transaction failed for batch {batch_id}.")
                return None

        except Exception as e:
            print(f"[Blockchain] Error writing batch: {e}")
            return None

    def query_honey_batch(self, batch_id: str) -> Optional[Dict[str, Any]]:
        """
        Queries batch metadata from blockchain for lookup verification.
        """
        if not WEB3_AVAILABLE or not self.w3 or not self.contract:
            print("[Blockchain] Web3 connection unavailable. Mocking lookup response.")
            return {
                "batchId": batch_id,
                "producerId": "PROD-MOCK-BEE",
                "hiveLocation": "Sector Mock-Row 1",
                "harvestDate": 1782297600,
                "qualityMetricsHash": "0x" + "a" * 64,
                "aiDiagnosticsHash": "0x" + "b" * 64,
                "currentOwner": "0x0000000000000000000000000000000000000000",
                "isAuthentic": True
            }

        try:
            res = self.contract.functions.getBatch(batch_id).call()
            return {
                "batchId": res[0],
                "producerId": res[1],
                "hiveLocation": res[2],
                "harvestDate": res[3],
                "qualityMetricsHash": "0x" + res[4].hex(),
                "aiDiagnosticsHash": "0x" + res[5].hex(),
                "currentOwner": res[6],
                "isAuthentic": res[7]
            }
        except Exception as e:
            print(f"[Blockchain] Batch lookup failed: {e}")
            return None

# Self-test demonstration
if __name__ == "__main__":
    print("--- HoneyChain IoT Gateway Blockchain Integration Test ---")
    
    # Test dataset
    mock_quality = {
        "moisture_percent": 17.2,
        "hmf_mg_kg": 12.5,
        "pollen_density_grains_g": 8500
    }
    mock_ai = {
        "diagnosis": "HEALTHY_NORMAL",
        "confidence": 0.985,
        "inference_ms": 8.2
    }
    
    client = HoneyChainClient()
    tx_hash = client.log_honey_batch(
        batch_id="TEST-BATCH-001",
        producer_id="PROD-BEEVIL-01",
        hive_location="Sector D-Row 2",
        harvest_date_timestamp=1782297600,
        quality_metrics=mock_quality,
        ai_diagnostics=mock_ai
    )
    
    print(f"Resulting transaction hash: {tx_hash}")
