#!/usr/bin/env python3
"""
HoneyChain Merkle Tree & Cryptographic Proof Builder
Problem Statement 26021 — Ministry of MSME, Coordination Section
Team: Beevil Knievel

Standardized on sorted-pair keccak256 matching HoneyProvenance.sol (Tier 3).
Includes zero-dependency Pure-Python Keccak-256 implementation with pycryptodome fallback.
"""

from typing import List, Dict, Any, Tuple

# Pure Python Keccak-256 implementation (zero-dependency for edge / gateway environments)
def _pure_keccak256(data: bytes) -> bytes:
    RC = [
        0x0000000000000001, 0x0000000000008082, 0x800000000000808A, 0x8000000080008000,
        0x000000000000808B, 0x0000000080000001, 0x8000000080008081, 0x8000000000008009,
        0x000000000000008A, 0x0000000000000088, 0x0000000080008009, 0x000000008000000A,
        0x000000008000808B, 0x800000000000008B, 0x8000000000008089, 0x8000000000008003,
        0x8000000000008002, 0x8000000000000080, 0x000000000000800A, 0x800000008000000A,
        0x8000000080008081, 0x8000000000008080, 0x0000000080000001, 0x8000000080008008
    ]
    ROTC = [
        [0, 36, 3, 41, 18],
        [1, 44, 10, 45, 2],
        [62, 6, 43, 15, 61],
        [28, 55, 25, 21, 56],
        [27, 20, 39, 8, 14]
    ]

    rate_bytes = 1088 // 8  # 136 bytes
    padlen = rate_bytes - (len(data) % rate_bytes)
    if padlen == 1:
        padded = data + b'\x81'
    else:
        padded = data + b'\x01' + b'\x00' * (padlen - 2) + b'\x80'

    state = [[0] * 5 for _ in range(5)]

    def _rol(val, shift):
        return ((val << shift) | (val >> (64 - shift))) & 0xFFFFFFFFFFFFFFFF

    for block_start in range(0, len(padded), rate_bytes):
        block = padded[block_start:block_start + rate_bytes]
        for i in range(rate_bytes // 8):
            x = i % 5
            y = i // 5
            val = int.from_bytes(block[i * 8:(i + 1) * 8], byteorder='little')
            state[x][y] ^= val

        # Keccak-f[1600] (24 rounds)
        for round_idx in range(24):
            # Theta
            C = [state[x][0] ^ state[x][1] ^ state[x][2] ^ state[x][3] ^ state[x][4] for x in range(5)]
            D = [C[(x + 4) % 5] ^ _rol(C[(x + 1) % 5], 1) for x in range(5)]
            for x in range(5):
                for y in range(5):
                    state[x][y] ^= D[x]

            # Rho & Pi
            B = [[0] * 5 for _ in range(5)]
            for x in range(5):
                for y in range(5):
                    B[y][(2 * x + 3 * y) % 5] = _rol(state[x][y], ROTC[x][y])

            # Chi
            for x in range(5):
                for y in range(5):
                    state[x][y] = (B[x][y] ^ ((~B[(x + 1) % 5][y]) & B[(x + 2) % 5][y])) & 0xFFFFFFFFFFFFFFFF

            # Iota
            state[0][0] ^= RC[round_idx]

    out = bytearray()
    for i in range(4):
        x = i % 5
        y = i // 5
        out += state[x][y].to_bytes(8, byteorder='little')
    return bytes(out)

try:
    from Crypto.Hash import keccak
    def keccak256(data: bytes) -> bytes:
        k = keccak.new(digest_bits=256)
        k.update(data)
        return k.digest()
except ImportError:
    keccak256 = _pure_keccak256

def keccak256_hex(data: bytes) -> str:
    """Returns '0x' prefixed 64-char hex string."""
    return "0x" + keccak256(data).hex()

def hash_pair(left: bytes, right: bytes) -> bytes:
    """
    Computes sorted-pair keccak256 hash:
    keccak256(min(L, R) || max(L, R))
    Guarantees deterministic parent hash matching Solidity verifyJar.
    """
    if int.from_bytes(left, byteorder='big') <= int.from_bytes(right, byteorder='big'):
        return keccak256(left + right)
    else:
        return keccak256(right + left)

def serialize_daily_telemetry_leaf(
    hive_id: int,
    timestamp: int,
    brood_temp_c_x100: int,
    humidity_pct_x100: int,
    voc_gas_kohm_x10: int,
    acoustic_health_flag: int = 1
) -> bytes:
    """
    Packs telemetry fields into bytes mimicking abi.encodePacked:
    uint16 hive_id
    uint256 timestamp
    int16   brood_temp_c_x100
    uint16  humidity_pct_x100
    uint16  voc_gas_kohm_x10
    uint8   acoustic_health_flag
    """
    packed = (
        hive_id.to_bytes(2, byteorder='big') +
        timestamp.to_bytes(32, byteorder='big') +
        brood_temp_c_x100.to_bytes(2, byteorder='big', signed=True) +
        humidity_pct_x100.to_bytes(2, byteorder='big') +
        voc_gas_kohm_x10.to_bytes(2, byteorder='big') +
        acoustic_health_flag.to_bytes(1, byteorder='big')
    )
    return keccak256(packed)

class HoneyMerkleTree:
    """
    Sorted-Pair Keccak256 Merkle Tree for Hive Curing & Harvest Telemetry.
    """
    def __init__(self, leaves: List[bytes]):
        if not leaves:
            raise ValueError("Leaves cannot be empty")
        self.raw_leaves = leaves
        self.layers: List[List[bytes]] = [leaves]
        self._build_tree()

    def _build_tree(self):
        current_layer = self.raw_leaves
        while len(current_layer) > 1:
            next_layer = []
            for i in range(0, len(current_layer), 2):
                if i + 1 < len(current_layer):
                    parent = hash_pair(current_layer[i], current_layer[i + 1])
                else:
                    # Odd leaf: duplicate / pair with self
                    parent = hash_pair(current_layer[i], current_layer[i])
                next_layer.append(parent)
            self.layers.append(next_layer)
            current_layer = next_layer

    @property
    def root(self) -> bytes:
        return self.layers[-1][0]

    @property
    def root_hex(self) -> str:
        return "0x" + self.root.hex()

    def get_proof(self, index: int) -> List[str]:
        """
        Generates array of sibling hex hashes for verifying leaf at `index`.
        """
        if index < 0 or index >= len(self.raw_leaves):
            raise IndexError("Leaf index out of bounds")

        proof = []
        current_idx = index
        for layer in self.layers[:-1]:
            is_right_sibling = (current_idx % 2 == 1)
            sibling_idx = current_idx - 1 if is_right_sibling else current_idx + 1
            
            if sibling_idx < len(layer):
                proof.append("0x" + layer[sibling_idx].hex())
            else:
                # Odd leaf paired with itself
                proof.append("0x" + layer[current_idx].hex())

            current_idx //= 2
        return proof

    @staticmethod
    def verify_proof(leaf: bytes, proof: List[str], root_hex: str) -> bool:
        """
        Off-chain verification matching Solidity verifyJar logic.
        """
        computed = leaf
        root_bytes = bytes.fromhex(root_hex[2:] if root_hex.startswith("0x") else root_hex)

        for p_hex in proof:
            p_bytes = bytes.fromhex(p_hex[2:] if p_hex.startswith("0x") else p_hex)
            computed = hash_pair(computed, p_bytes)

        return computed == root_bytes


def build_curing_batch_merkle_tree(daily_telemetry_records: List[Dict[str, Any]]) -> Tuple[HoneyMerkleTree, List[bytes]]:
    """
    Builds a Merkle tree from daily hive telemetry records across the curing window.
    """
    leaves = []
    for rec in daily_telemetry_records:
        temp_val = rec.get("brood_core_temp_c", rec.get("brood_temp_c", 34.8))
        hum_val = rec.get("humidity_pct", 58.0)
        voc_val = rec.get("voc_gas_kohm", 45.0)

        leaf = serialize_daily_telemetry_leaf(
            hive_id=rec["hive_id"],
            timestamp=rec["timestamp"],
            brood_temp_c_x100=int(temp_val * 100),
            humidity_pct_x100=int(hum_val * 100),
            voc_gas_kohm_x10=int(voc_val * 10),
            acoustic_health_flag=rec.get("acoustic_health_flag", 1)
        )
        leaves.append(leaf)

    tree = HoneyMerkleTree(leaves)
    return tree, leaves
