/**
 * HoneyChain Mock Data and Verified Batches
 * Problem Statement 26021 — Ministry of MSME, Coordination Section
 * Team: Beevil Knievel
 */

export interface HarvestBatchData {
  batchId: number;
  hiveId: number;
  apiaryLocation: string;
  clusterName: string;
  curingPeriodDays: number;
  timestamp: string;
  merkleRoot: string;
  leafHashDay1: string;
  leafHashHarvestDay: string;
  proofDay1: string[];
  proofHarvestDay: string[];
  moisturePct: number;
  moistureSelfDeclared: boolean;
  contractAddress: string;
  ipfsUri: string;
  attestations: {
    oracleAddress: string;
    nodeType: string;
    timestamp: string;
    verified: boolean;
  }[];
  telemetrySummary: {
    avgBroodTempC: number;
    avgHumidityPct: number;
    netWeightGainKg: number;
    readingCount: number;
  };
  aiHealthSummary: {
    colonyStatus: string;
    diseaseEvents: number;
    swarmRiskFlags: number;
    swarmRiskMaxScore: number;
    acousticHealthScore: number;
    notes: string;
    timelineEvents: {
      day: number;
      event: string;
      severity: "info" | "warning" | "success";
      description: string;
    }[];
  };
}

export const SAMPLE_BATCHES: Record<number, HarvestBatchData> = {
  1: {
    batchId: 1,
    hiveId: 42,
    apiaryLocation: "Yard Alpha, Coorg KVIC Cluster (12.3375° N, 75.8069° E)",
    clusterName: "KVIC Karnataka Beekeeping Federation",
    curingPeriodDays: 21,
    timestamp: "2026-08-28T14:30:00Z",
    merkleRoot: "0x7f4e92a18b56012c49d84e3650221379e49c7199fa68e2195f128e4692751f0b",
    leafHashDay1: "0x3a91bc7d4328905b184f479a0237190f845a7826372849bca7821635810294c1",
    leafHashHarvestDay: "0x98127394c8e19283749102938475019283740192837401928374019283740192",
    proofDay1: [
      "0x4b8192a019283746591827364501928374650192837465019283746501928374",
      "0x1928374650192837465019283746501928374650192837465019283746501928"
    ],
    proofHarvestDay: [
      "0x8374650192837465019283746501928374650192837465019283746501928374",
      "0x1928374650192837465019283746501928374650192837465019283746501928"
    ],
    moisturePct: 17.4,
    moistureSelfDeclared: true,
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    ipfsUri: "ipfs://QmHoneyChainBatch1MetadataCoorgCluster",
    attestations: [
      {
        oracleAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        nodeType: "Raspberry Pi CM4 LoRa Gateway #1",
        timestamp: "2026-08-28 14:31:02 UTC",
        verified: true
      },
      {
        oracleAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        nodeType: "KVIC Regional Co-Signer Node #2",
        timestamp: "2026-08-28 14:31:45 UTC",
        verified: true
      }
    ],
    telemetrySummary: {
      avgBroodTempC: 34.82,
      avgHumidityPct: 58.4,
      netWeightGainKg: 38.4,
      readingCount: 504
    },
    aiHealthSummary: {
      colonyStatus: "CERTIFIED_ORGANIC_HEALTHY",
      diseaseEvents: 0,
      swarmRiskFlags: 1,
      swarmRiskMaxScore: 0.31,
      acousticHealthScore: 98.5,
      notes: "Optimal brood homeostasis maintained throughout 21 days. Mild cold-stress flag on Day 4 resolved autonomously by Day 6. Zero Varroa or foulbrood events detected.",
      timelineEvents: [
        {
          day: 1,
          event: "Curing Phase Initiated",
          severity: "info",
          description: "Super frames loaded; hive core temperature stabilized at 34.78°C."
        },
        {
          day: 4,
          event: "Cold Front Weather Event",
          severity: "warning",
          description: "Ambient drop to 14°C triggered thermoregulation clustering; brood core maintained at 33.9°C."
        },
        {
          day: 6,
          event: "Thermal Homeostasis Restored",
          severity: "success",
          description: "Core brood stabilized back to 34.85°C. Foraging flight volume resumed at peak efficiency."
        },
        {
          day: 18,
          event: "Peak Nectar Capping",
          severity: "success",
          description: "Weight gain reached +36.2 kg; acoustic wing fanning indicates natural dehydration capping."
        },
        {
          day: 21,
          event: "Harvest Verification & Sealing",
          severity: "success",
          description: "Beekeeper confirmed extraction; 2-of-3 multi-oracle quorum signed on-chain."
        }
      ]
    }
  }
};
