import { openDB, IDBPDatabase } from 'idb';
import { HiveStatus, RiskFlag, CallbackRequest, ActionLog, Farmer, FieldOfficer } from '../types';

const DB_NAME = 'HoneyChainFarmerDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('farmer')) {
          db.createObjectStore('farmer', { keyPath: 'farmerId' });
        }
        if (!db.objectStoreNames.contains('fieldOfficer')) {
          db.createObjectStore('fieldOfficer', { keyPath: 'fieldOfficerId' });
        }
        if (!db.objectStoreNames.contains('hives')) {
          db.createObjectStore('hives', { keyPath: 'hiveId' });
        }
        if (!db.objectStoreNames.contains('outbox_callbacks')) {
          db.createObjectStore('outbox_callbacks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('outbox_actions')) {
          db.createObjectStore('outbox_actions', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveCachedFarmer(farmer: Farmer) {
  const db = await getDB();
  if (!db) return;
  await db.put('farmer', farmer);
}

export async function getCachedFarmer(): Promise<Farmer | null> {
  const db = await getDB();
  if (!db) return null;
  const list = await db.getAll('farmer');
  return list[0] || null;
}

export async function saveCachedFieldOfficer(officer: FieldOfficer) {
  const db = await getDB();
  if (!db) return;
  await db.put('fieldOfficer', officer);
}

export async function getCachedFieldOfficer(): Promise<FieldOfficer | null> {
  const db = await getDB();
  if (!db) return null;
  const list = await db.getAll('fieldOfficer');
  return list[0] || null;
}

export async function saveCachedHives(hives: HiveStatus[]) {
  const db = await getDB();
  if (!db) return;
  const tx = db.transaction('hives', 'readwrite');
  await tx.objectStore('hives').clear();
  for (const hive of hives) {
    await tx.objectStore('hives').put(hive);
  }
  await tx.done;
}

export async function getCachedHives(): Promise<HiveStatus[]> {
  const db = await getDB();
  if (!db) return [];
  return await db.getAll('hives');
}

export async function queueCallbackRequest(req: CallbackRequest) {
  const db = await getDB();
  if (!db) return;
  await db.put('outbox_callbacks', req);
}

export async function getPendingCallbackRequests(): Promise<CallbackRequest[]> {
  const db = await getDB();
  if (!db) return [];
  return await db.getAll('outbox_callbacks');
}

export async function removePendingCallbackRequest(id: string) {
  const db = await getDB();
  if (!db) return;
  await db.delete('outbox_callbacks', id);
}

export async function queueActionLog(action: ActionLog) {
  const db = await getDB();
  if (!db) return;
  await db.put('outbox_actions', action);
}

export async function getPendingActionLogs(): Promise<ActionLog[]> {
  const db = await getDB();
  if (!db) return [];
  return await db.getAll('outbox_actions');
}

export async function removePendingActionLog(id: string) {
  const db = await getDB();
  if (!db) return;
  await db.delete('outbox_actions', id);
}
