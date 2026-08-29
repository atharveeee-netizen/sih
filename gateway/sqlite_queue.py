#!/usr/bin/env python3
"""
HoneyChain Gateway Offline-First Transaction Queue & SQLite Manager
Problem Statement 26021 — Ministry of MSME, Coordination Section
Team: Beevil Knievel

Designed for rural KVIC apiary clusters with intermittent cellular/satellite connectivity.
Caches signed telemetry packets locally and performs opportunistic batch sync to RPC oracles.
"""

import sqlite3
import json
import time
from typing import List, Dict, Any, Optional
from pathlib import Path

class GatewayOfflineQueue:
    def __init__(self, db_path: str = "gateway_telemetry.db"):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            # Raw Telemetry Queue
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS telemetry_packets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    hive_id INTEGER NOT NULL,
                    timestamp INTEGER NOT NULL,
                    brood_temp REAL,
                    humidity REAL,
                    voc_gas REAL,
                    co2 INTEGER,
                    weight REAL,
                    fft_bands TEXT,
                    device_signature TEXT,
                    is_anomaly INTEGER DEFAULT 0,
                    synced_to_cloud INTEGER DEFAULT 0
                )
            """)

            # Daily Sub-Roots & Merkle Anchors
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS daily_merkle_roots (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    hive_id INTEGER NOT NULL,
                    date_string TEXT NOT NULL,
                    sub_root_hash TEXT NOT NULL,
                    packet_count INTEGER NOT NULL,
                    anchored_on_chain INTEGER DEFAULT 0
                )
            """)

            # Pending On-Chain Harvest Batches Queue
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS pending_harvest_txs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    batch_id INTEGER,
                    hive_id INTEGER NOT NULL,
                    merkle_root TEXT NOT NULL,
                    moisture_ppm INTEGER NOT NULL,
                    moisture_self_declared INTEGER NOT NULL,
                    ipfs_uri TEXT NOT NULL,
                    status TEXT DEFAULT 'QUEUED_OFFLINE',
                    attestation_count INTEGER DEFAULT 0,
                    created_at INTEGER NOT NULL,
                    updated_at INTEGER NOT NULL
                )
            """)
            conn.commit()

    def insert_telemetry_packet(self, data: Dict[str, Any], signature: str = "0xECDSA_DUMMY_SIG") -> int:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO telemetry_packets (
                    hive_id, timestamp, brood_temp, humidity, voc_gas,
                    co2, weight, fft_bands, device_signature, is_anomaly, synced_to_cloud
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            """, (
                data.get("hive_id", 42),
                data.get("timestamp", int(time.time())),
                data.get("brood_core_temp_c", 34.8),
                data.get("humidity_pct", 58.0),
                data.get("voc_gas_kohm", 45.0),
                data.get("co2_ppm", 620),
                data.get("weight_kg", 38.4),
                json.dumps(data.get("fft_energy_bands", [12, 18, 45, 80, 40, 20, 10, 5])),
                signature,
                1 if data.get("is_anomaly") else 0
            ))
            conn.commit()
            return cursor.lastrowid

    def queue_harvest_proposal(
        self,
        hive_id: int,
        merkle_root: str,
        moisture_ppm: int,
        moisture_self_declared: bool,
        ipfs_uri: str
    ) -> int:
        now = int(time.time())
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO pending_harvest_txs (
                    hive_id, merkle_root, moisture_ppm, moisture_self_declared,
                    ipfs_uri, status, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, 'QUEUED_OFFLINE', ?, ?)
            """, (
                hive_id,
                merkle_root,
                moisture_ppm,
                1 if moisture_self_declared else 0,
                ipfs_uri,
                now,
                now
            ))
            conn.commit()
            return cursor.lastrowid

    def get_unsynced_harvest_txs(self) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM pending_harvest_txs WHERE status = 'QUEUED_OFFLINE'")
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def mark_harvest_synced(self, tx_id: int, on_chain_batch_id: int):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE pending_harvest_txs
                SET status = 'FINALIZED_ON_CHAIN', batch_id = ?, updated_at = ?
                WHERE id = ?
            """, (on_chain_batch_id, int(time.time()), tx_id))
            conn.commit()

    def get_telemetry_for_hive(self, hive_id: int, limit: int = 100) -> List[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM telemetry_packets
                WHERE hive_id = ?
                ORDER BY timestamp DESC
                LIMIT ?
            """, (hive_id, limit))
            rows = cursor.fetchall()
            results = []
            for row in rows:
                d = dict(row)
                d["fft_energy_bands"] = json.loads(d["fft_bands"])
                results.append(d)
            return results
