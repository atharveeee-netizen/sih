/**
 * HONEY CHAIN — Centralized API Client & Demonstration Engine
 * SIH 2026 Problem Statement ID: 26021 (Ministry of MSME / KVIC)
 *
 * Implements strict environment isolation:
 * - Production: uses NEXT_PUBLIC_API_BASE_URL if configured
 * - Development: falls back to http://localhost:8000
 * - Offline / GitHub Pages static export: falls back to deterministic demo fixtures
 *   and explicitly tags responses with is_demo_mode: true
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://localhost:8000");

// ============================================================================
// DETERMINISTIC DEMONSTRATION FIXTURES (OFFLINE / GITHUB PAGES FALLBACK)
// ============================================================================

export const DEMO_KVIC_STATS = {
  clusters_active: 3,
  registered_beekeepers: 5,
  total_monitored_hives: 12,
  healthy_colonies: 11,
  at_risk_colonies: 1,
  total_harvested_honey_kg: 107.5,
  total_honey_batches: 2,
  verified_market_batches: 2,
  traceability_compliance_pct: 100.0,
  suspicious_counterfeit_alerts: 1,
  is_demo_mode: true,
};

export const DEMO_CLUSTERS = [
  {
    id: "cluster-nilgiris",
    name: "Nilgiris Mountain Forest Cluster",
    state: "Tamil Nadu",
    district: "Nilgiris",
    pincode: "643001",
    contact_officer: "Dr. S. Sundaram",
    officer_phone: "+91 94432 00101",
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "cluster-gir",
    name: "Gir Forest Flora Apiculture Cluster",
    state: "Gujarat",
    district: "Junagadh",
    pincode: "362150",
    contact_officer: "Er. K. Vala",
    officer_phone: "+91 99245 00202",
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "cluster-kashmir",
    name: "Kashmir Valley Acacia Cluster",
    state: "Jammu & Kashmir",
    district: "Pulwama",
    pincode: "192301",
    contact_officer: "Dr. M. Lone",
    officer_phone: "+91 94190 00303",
    created_at: "2026-08-01T00:00:00Z",
  },
];

export const DEMO_BEEKEEPERS = [
  {
    id: "BEE-KVIC-001",
    cluster_id: "cluster-nilgiris",
    name: "Ramanathan Pillai",
    registration_no: "KVIC-REG-TN-4102",
    phone: "+91 94432 18491",
    aadhaar_masked: "XXXX-XXXX-8912",
    bank_linked: 1,
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "BEE-KVIC-002",
    cluster_id: "cluster-nilgiris",
    name: "Kavitha Murugan",
    registration_no: "KVIC-REG-TN-4189",
    phone: "+91 98421 90123",
    aadhaar_masked: "XXXX-XXXX-4531",
    bank_linked: 1,
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "BEE-KVIC-003",
    cluster_id: "cluster-gir",
    name: "Bhavesh Patel",
    registration_no: "KVIC-REG-GJ-8821",
    phone: "+91 99245 61720",
    aadhaar_masked: "XXXX-XXXX-3319",
    bank_linked: 1,
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "BEE-KVIC-004",
    cluster_id: "cluster-gir",
    name: "Dharmesh Ahir",
    registration_no: "KVIC-REG-GJ-8854",
    phone: "+91 97230 44910",
    aadhaar_masked: "XXXX-XXXX-7742",
    bank_linked: 1,
    created_at: "2026-08-01T00:00:00Z",
  },
  {
    id: "BEE-KVIC-005",
    cluster_id: "cluster-kashmir",
    name: "Ghulam Nabi Lone",
    registration_no: "KVIC-REG-JK-1044",
    phone: "+91 94190 28311",
    aadhaar_masked: "XXXX-XXXX-9905",
    bank_linked: 1,
    created_at: "2026-08-01T00:00:00Z",
  },
];

export const DEMO_HIVES = [
  {
    hive_id: 1,
    name: "Shola Sentinel 01 (Queen A3)",
    apiary_id: "apiary-nilgiris-01",
    beekeeper_id: "BEE-KVIC-001",
    beekeeper_name: "Ramanathan Pillai",
    apiary_name: "Shola Ridge Apiary Alpha",
    cluster_name: "Nilgiris Mountain Forest Cluster",
    status: "HEALTHY",
    last_health_score: 98.5,
    tare_weight_kg: 22.5,
    current_weight_kg: 34.2,
    brood_temp_c: 34.8,
    humidity_pct: 61.2,
    co2_ppm: 780,
    acoustic_hz: 245.0,
    battery_pct: 92,
    packet_count: 1420,
    firmware_packet_bytes: 40,
    anomaly_status: "NORMAL",
  },
  {
    hive_id: 2,
    name: "Shola Sentinel 02",
    apiary_id: "apiary-nilgiris-01",
    beekeeper_id: "BEE-KVIC-001",
    beekeeper_name: "Ramanathan Pillai",
    apiary_name: "Shola Ridge Apiary Alpha",
    cluster_name: "Nilgiris Mountain Forest Cluster",
    status: "HEALTHY",
    last_health_score: 96.0,
    tare_weight_kg: 21.0,
    current_weight_kg: 31.8,
    brood_temp_c: 34.6,
    humidity_pct: 62.0,
    co2_ppm: 810,
    acoustic_hz: 238.0,
    battery_pct: 88,
    packet_count: 1390,
    firmware_packet_bytes: 40,
    anomaly_status: "NORMAL",
  },
  {
    hive_id: 3,
    name: "Blue Mountain Sentinel 03",
    apiary_id: "apiary-nilgiris-02",
    beekeeper_id: "BEE-KVIC-002",
    beekeeper_name: "Kavitha Murugan",
    apiary_name: "Blue Mountain High Apiary",
    cluster_name: "Nilgiris Mountain Forest Cluster",
    status: "HEALTHY",
    last_health_score: 97.2,
    tare_weight_kg: 22.0,
    current_weight_kg: 32.5,
    brood_temp_c: 34.9,
    humidity_pct: 59.8,
    co2_ppm: 740,
    acoustic_hz: 242.0,
    battery_pct: 95,
    packet_count: 1405,
    firmware_packet_bytes: 40,
    anomaly_status: "NORMAL",
  },
  {
    hive_id: 6,
    name: "Somnath Sentinel 06",
    apiary_id: "apiary-gir-01",
    beekeeper_id: "BEE-KVIC-003",
    beekeeper_name: "Bhavesh Patel",
    apiary_name: "Somnath Border Apiary",
    cluster_name: "Gir Forest Flora Apiculture Cluster",
    status: "HEALTHY",
    last_health_score: 94.5,
    tare_weight_kg: 23.0,
    current_weight_kg: 36.4,
    brood_temp_c: 35.1,
    humidity_pct: 58.2,
    co2_ppm: 820,
    acoustic_hz: 250.0,
    battery_pct: 84,
    packet_count: 1340,
    firmware_packet_bytes: 40,
    anomaly_status: "NORMAL",
  },
  {
    hive_id: 10,
    name: "Pampore Saffron Sentinel 10",
    apiary_id: "apiary-kashmir-01",
    beekeeper_id: "BEE-KVIC-005",
    beekeeper_name: "Ghulam Nabi Lone",
    apiary_name: "Pampore Saffron & Acacia Apiary",
    cluster_name: "Kashmir Valley Acacia Cluster",
    status: "ATTENTION",
    last_health_score: 74.0,
    tare_weight_kg: 22.5,
    current_weight_kg: 24.1,
    brood_temp_c: 32.8,
    humidity_pct: 72.4,
    co2_ppm: 1150,
    acoustic_hz: 420.0,
    battery_pct: 79,
    packet_count: 1210,
    firmware_packet_bytes: 40,
    anomaly_status: "POSSIBLE_QUEENLESS_RISK",
  },
];

export const DEMO_BATCHES = [
  {
    id: "HC-BATCH-2026-NIL-001",
    batch_code: "BATCH-2026-NIL-001",
    cluster_id: "cluster-nilgiris",
    cluster_name: "Nilgiris Mountain Forest Cluster",
    beekeeper_name: "Ramanathan Pillai",
    floral_source: "Nilgiris High-Altitude Wild Flora",
    weight_kg: 45.0,
    status: "PACKAGED",
    curing_days: 21,
    created_at: "2026-08-15T10:00:00Z",
    packages_issued: 90,
  },
  {
    id: "HC-BATCH-2026-GIR-002",
    batch_code: "BATCH-2026-GIR-002",
    cluster_id: "cluster-gir",
    cluster_name: "Gir Forest Flora Apiculture Cluster",
    beekeeper_name: "Bhavesh Patel",
    floral_source: "Saurashtra Jamun & Forest Mustard",
    weight_kg: 62.5,
    status: "QUALITY_VERIFIED",
    curing_days: 21,
    created_at: "2026-08-25T11:30:00Z",
    packages_issued: 0,
  },
];

export const DEMO_TIMELINES: Record<string, any> = {
  "HC-BATCH-2026-NIL-001": {
    batch_id: "HC-BATCH-2026-NIL-001",
    batch_code: "BATCH-2026-NIL-001",
    status: "PACKAGED",
    chain_intact: true,
    total_events: 5,
    events: [
      {
        event_id: "evt-01-harvest",
        event_type: "BATCH_CREATED",
        actor_id: "BEE-KVIC-001",
        actor_role: "BEEKEEPER",
        timestamp: "2026-08-15T10:00:00Z",
        event_hash: "a4f8e12d6c9b3a0f7e4d2c1b8a9f0e3d5c7b2a1f8e4d2c1b8a9f0e3d5c7b2a1f",
        previous_event_hash: "GENESIS-BLOCK-0000000000000000000000000000000000000000000000000000000000000000",
        payload: {
          weight_kg: 45.0,
          floral_source: "Nilgiris High-Altitude Wild Flora",
          cluster: "cluster-nilgiris",
          field_moisture_pct: 17.6,
        },
      },
      {
        event_id: "evt-02-qa",
        event_type: "QUALITY_VERIFIED",
        actor_id: "LAB-KVIC-PUNE-01",
        actor_role: "QUALITY_LAB",
        timestamp: "2026-08-18T14:30:00Z",
        event_hash: "b7c2d91f4a8e0f3d6c1b9a2e5f8d0c3b7a1f4e8d2c0b9a3f6e1d5c8b2a4f0e7d",
        previous_event_hash: "a4f8e12d6c9b3a0f7e4d2c1b8a9f0e3d5c7b2a1f8e4d2c1b8a9f0e3d5c7b2a1f",
        payload: {
          lab: "KVIC Honey Testing & Quality Analysis Center, Pune",
          moisture_pct: 17.1,
          hmf_mg_kg: 11.2,
          diastase_number: 14.8,
          status: "PASS",
          adulteration: "PURE_AUTHENTIC",
          verification_level: "RECORDED_LAB_CERTIFICATE",
        },
      },
      {
        event_id: "evt-03-proc",
        event_type: "PROCESSING_COMPLETED",
        actor_id: "PROC-NIL-01",
        actor_role: "PROCESSOR",
        timestamp: "2026-08-20T09:15:00Z",
        event_hash: "c3e5a7b9d1f0e2d4c6b8a0f2e4d6c8b0a2f4e6d8c0b2a4f6e8d0c2b4a6f8e0d2",
        previous_event_hash: "b7c2d91f4a8e0f3d6c1b9a2e5f8d0c3b7a1f4e8d2c0b9a3f6e1d5c8b2a4f0e7d",
        payload: {
          facility: "Nilgiris Tribal Apiculture Processing Co-operative",
          filtering_temp_c: 38.5,
          settling_hours: 48.0,
        },
      },
      {
        event_id: "evt-04-pkg",
        event_type: "PACKAGED",
        actor_id: "OP-NIL-42",
        actor_role: "PROCESSOR",
        timestamp: "2026-08-22T16:00:00Z",
        event_hash: "d9f1a3b5c7e0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2",
        previous_event_hash: "c3e5a7b9d1f0e2d4c6b8a0f2e4d6c8b0a2f4e6d8c0b2a4f6e8d0c2b4a6f8e0d2",
        payload: {
          lot_number: "LOT-2026-NIL-500G",
          jar_size_g: 500,
          total_units: 90,
        },
      },
      {
        event_id: "evt-05-qr",
        event_type: "QR_ISSUED",
        actor_id: "KVIC-TRACE-SYSTEM",
        actor_role: "SYSTEM",
        timestamp: "2026-08-22T16:05:00Z",
        event_hash: "e1f3a5c7d9b0e2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2",
        previous_event_hash: "d9f1a3b5c7e0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2",
        payload: {
          sample_package_code: "HC-PKG-A7F93E12",
          total_issued: 90,
        },
      },
    ],
  },
};

export const DEMO_VERIFICATIONS: Record<string, any> = {
  "HC-PKG-A7F93E12": {
    verified: true,
    status: "VERIFIED",
    anomaly_flag: "NORMAL",
    message: "Authentic KVIC Honey. Genuine seal verified from recorded provenance.",
    package_code: "HC-PKG-A7F93E12",
    scan_count: 1,
    is_demo_mode: true,
    provenance: {
      package: {
        package_code: "HC-PKG-A7F93E12",
        jar_size_g: 500,
        lot_number: "LOT-2026-NIL-500G",
        packaged_at: "2026-08-22T16:00:00Z",
        expiry_date: "2028-08-22",
        facility_location: "Nilgiris Packaging Facility, Coonoor",
      },
      batch: {
        batch_code: "BATCH-2026-NIL-001",
        weight_kg: 45.0,
        floral_source: "Nilgiris High-Altitude Wild Flora",
        curing_days: 21,
      },
      origin: {
        cluster_name: "Nilgiris Mountain Forest Cluster",
        state: "Tamil Nadu",
        district: "Nilgiris",
        beekeeper_name: "Ramanathan Pillai",
        beekeeper_reg: "KVIC-REG-TN-4102",
        apiary_name: "Shola Ridge Apiary Alpha",
        elevation_m: 1850.0,
        primary_flora: "Nilgiris Wild Multifloral & Eucalyptus",
      },
      harvest: {
        harvest_date: "2026-08-15",
        field_moisture_pct: 17.6,
        floral_source: "Nilgiris High-Altitude Wild Flora",
      },
      quality: {
        lab_name: "KVIC Honey Testing & Quality Analysis Center, Pune",
        tested_at: "2026-08-18T14:30:00Z",
        moisture_pct: 17.1,
        hmf_mg_kg: 11.2,
        diastase_number: 14.8,
        electrical_conductivity: 0.52,
        adulteration_result: "PURE_AUTHENTIC",
        status: "PASS",
        verification_level: "RECORDED_LAB_CERTIFICATE",
        certificate_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      },
      processing: {
        facility_name: "Nilgiris Tribal Apiculture Processing Co-operative",
        filtering_temp_c: 38.5,
        settling_hours: 48.0,
        status: "COMPLETED",
      },
      ledger: {
        verified: true,
        chain_intact: true,
        total_events: 5,
        tampered: false,
      },
    },
  },
  "HC-PKG-B8C24D91": {
    verified: false,
    status: "SUSPICIOUS",
    anomaly_flag: "EXCESSIVE_SCANS",
    message:
      "WARNING: Multiple successive scans detected across distinct network endpoints. Potential label clone or counterfeit reuse.",
    package_code: "HC-PKG-B8C24D91",
    scan_count: 6,
    is_demo_mode: true,
    provenance: null,
  },
};

export const DEMO_MARKET_ORDERS = [
  {
    id: "ord-nil-01",
    batch_id: "HC-BATCH-2026-NIL-001",
    batch_code: "BATCH-2026-NIL-001",
    cluster_name: "Nilgiris Mountain Forest Cluster",
    floral_source: "Nilgiris High-Altitude Wild Flora",
    seller_name: "Nilgiris Tribal Apiculture Co-operative",
    buyer_name: "KVIC Central Khadi Gramodyog Bhavan, New Delhi",
    quantity_kg: 45.0,
    price_per_kg: 750.0,
    total_amount: 33750.0,
    status: "DISPATCHED",
    created_at: "2026-08-26T12:00:00Z",
  },
  {
    id: "ord-gir-02",
    batch_id: "HC-BATCH-2026-GIR-002",
    batch_code: "BATCH-2026-GIR-002",
    cluster_name: "Gir Forest Flora Apiculture Cluster",
    floral_source: "Saurashtra Jamun & Forest Mustard",
    seller_name: "Gir Bio-Reserve Apiculture Society",
    buyer_name: "Gujarat Agro Industries Corporation",
    quantity_kg: 62.5,
    price_per_kg: 680.0,
    total_amount: 42500.0,
    status: "LISTED",
    created_at: "2026-08-28T09:30:00Z",
  },
];

// ============================================================================
// CORE API REQUEST WRAPPER WITH DEMO FALLBACK
// ============================================================================

async function apiFetch<T>(endpoint: string, options?: RequestInit, fallbackData?: T): Promise<{ data: T; isDemoMode: boolean }> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    const json = await res.json();
    return { data: json, isDemoMode: false };
  } catch (err) {
    if (fallbackData !== undefined) {
      console.warn(`[API] Unreachable (${url}). Serving deterministic demo fixture.`, err);
      return { data: fallbackData, isDemoMode: true };
    }
    throw err;
  }
}

// ============================================================================
// TYPED API FUNCTIONS
// ============================================================================

export async function getKvicStats() {
  return apiFetch("/api/v1/stats/kvic", {}, DEMO_KVIC_STATS);
}

export async function getClusters() {
  return apiFetch("/api/v1/clusters", {}, DEMO_CLUSTERS);
}

export async function getBeekeepers() {
  return apiFetch("/api/v1/beekeepers", {}, DEMO_BEEKEEPERS);
}

export async function getHives() {
  return apiFetch("/api/v1/hives", {}, DEMO_HIVES);
}

export async function getHiveForecast(hiveId: number) {
  const fallback = {
    hive_id: hiveId,
    forecast_type: "PROTOTYPE_REGRESSION_HEURISTIC",
    description: "Regression heuristic based on continuous comb load-cell dynamics (HX711)",
    next_7d_projected_gain_kg: 1.45,
    estimated_days_to_harvest: 14,
    recommended_action: "MAINTAIN_MONITORING",
    is_field_validated: false,
    confidence_level: "PROTOTYPE_SIMULATION",
  };
  return apiFetch(`/api/v1/productivity/forecast/${hiveId}`, {}, fallback);
}

export async function getBatches() {
  return apiFetch("/api/v1/batches", {}, DEMO_BATCHES);
}

export async function getBatchTimeline(batchId: string) {
  const fallback = DEMO_TIMELINES[batchId] || DEMO_TIMELINES["HC-BATCH-2026-NIL-001"];
  return apiFetch(`/api/v1/batches/${batchId}/timeline`, {}, fallback);
}

export async function verifyPackage(packageCode: string) {
  const fallback = DEMO_VERIFICATIONS[packageCode] || {
    verified: true,
    status: "VERIFIED",
    anomaly_flag: "NORMAL",
    message: "Authentic KVIC Honey. Registered package token.",
    package_code: packageCode,
    scan_count: 1,
    is_demo_mode: true,
    provenance: DEMO_VERIFICATIONS["HC-PKG-A7F93E12"].provenance,
  };
  return apiFetch(`/api/v1/verify/${packageCode}`, {}, fallback);
}

export async function scanPackage(packageCode: string, body?: any) {
  return apiFetch(`/api/v1/verify/${packageCode}/scan`, {
    method: "POST",
    body: JSON.stringify(body || {}),
  }, DEMO_VERIFICATIONS[packageCode] || DEMO_VERIFICATIONS["HC-PKG-A7F93E12"]);
}

export async function createBatchQuality(batchId: string, payload: any) {
  return apiFetch(`/api/v1/batches/${batchId}/quality`, {
    method: "POST",
    body: JSON.stringify(payload),
  }, { success: true, message: "Demo Quality Test Recorded", batch_id: batchId });
}

export async function createBatchProcessing(batchId: string, payload: any) {
  return apiFetch(`/api/v1/batches/${batchId}/processing`, {
    method: "POST",
    body: JSON.stringify(payload),
  }, { success: true, message: "Demo Processing Event Recorded", batch_id: batchId });
}

export async function createBatchPackage(batchId: string, payload: any) {
  return apiFetch(`/api/v1/batches/${batchId}/package`, {
    method: "POST",
    body: JSON.stringify(payload),
  }, { success: true, message: "Demo Packaging Lot & QRs Issued", batch_id: batchId });
}

export async function createHarvest(payload: any) {
  return apiFetch("/api/v1/harvests", {
    method: "POST",
    body: JSON.stringify(payload),
  }, { success: true, message: "Demo Harvest Recorded", harvest_id: "harv-demo-01" });
}

export async function getMarketOrders() {
  return apiFetch("/api/v1/market/orders", {}, DEMO_MARKET_ORDERS);
}

export async function createMarketOrder(payload: any) {
  return apiFetch("/api/v1/market/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  }, { success: true, message: "Demo Market Order Created", order_id: "ord-demo-new" });
}

export async function triggerTamperDemo(batchId: string, eventId: string, tamperedWeight: number) {
  return apiFetch("/api/v1/demo/tamper", {
    method: "POST",
    body: JSON.stringify({
      batch_id: batchId,
      event_id: eventId,
      tampered_field: "weight_kg",
      tampered_value: tamperedWeight,
    }),
  }, {
    tamper_executed: true,
    batch_id: batchId,
    tampered_event_id: eventId,
    chain_intact: false,
    tamper_detected: true,
    message: "CRITICAL: SHA-256 hash mismatch detected! Ledger integrity compromised.",
  });
}
