/**
 * HoneyChain Verified Provenance Batches
 * Problem Statement 26021 — Ministry of MSME, Coordination Section
 * Team: Beevil Knievel
 * 
 * Mathematically verified sorted-pair Keccak-256 Merkle trees matching HoneyProvenance.sol
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
    merkleRoot: "0x088c70f33437f4a22e6c4287684ad151fd76befecdca9ca0ac0cc7f997112136",
    leafHashDay1: "0x1ce768ff6a0b1cfc2ae308831f2b47eebfcc91e23874ea143bfaf72325ec0ba3",
    leafHashHarvestDay: "0xc75425c09be1f4a31fd3572910808a2e7b51395fb05bc77f765ce36a77c2331f",
    proofDay1: [
      "0xaaac5d639e7fe0fcb95c79daed53ff282010cd2b1f0e8630fe5efadaefbc9fa5",
      "0x24ccfe565874f14196632d9db08f2c298d0a4276ec2754aafffc0ef95d2a85b7",
      "0x32b168002b5516eb86dce92589575d59b638e190497b7c88ef3d63059273252e",
      "0xb0f1aafb9c7a809e1c7c0f1c359ed331451eb99bad4b44530908759f1143b4f5",
      "0x98b3c6eec9eac77aa76547e8e0e519f41b9d1dbbb8ea45e015035b5ebdc781e6"
    ],
    proofHarvestDay: [
      "0xc75425c09be1f4a31fd3572910808a2e7b51395fb05bc77f765ce36a77c2331f",
      "0xe1a38080c299067fe303153c47dce0f20b63edf3485759eaf7fe43fafe07736a",
      "0x0ea36f52035f9aaf1c68518608dc5f61cbfc73ad8c55b755c222894ed4a32a2b",
      "0x029c91b80d6c03ae9982819a119636d53b19e8b14f4a7919a75c619a13cad3a0",
      "0x65acce811e5788493715f76e79673a9d7658f4e2a78cc290eb4b06c19ad8d1fb"
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
  },
  2: {
    batchId: 2,
    hiveId: 108,
    apiaryLocation: "Ooty Ridge, Nilgiris Forest Cluster (11.4102° N, 76.6950° E)",
    clusterName: "Nilgiris Tribal Honey Cooperative & KVIC Tamil Nadu",
    curingPeriodDays: 24,
    timestamp: "2026-08-25T11:15:00Z",
    merkleRoot: "0xe787469400469fd19c550706f2241088f4a23504fbd375a72914e077f54aef99",
    leafHashDay1: "0x2de8d624d3a78a86f5a7d55b6d1562a8b5b26a625cb2ed155fa251445560fb0a",
    leafHashHarvestDay: "0x529a0df2d3797a0b01cf1e5dfff82e6158a92566df2c2c1012e07491e65779fe",
    proofDay1: [
      "0x7fa4924493765ac71dc3429e24eaeaa5199e88aed05ede7a71028b490a99dd5b",
      "0xa8e45d7452801a7c72ee44c5a9a11e0e3f02ef699e4b6c0c274c146b49a1fcf6",
      "0x8fa81566b7954694358ff919e3fc71e1312b88f98c42a2468d18edfd729dae6f",
      "0x315114b2a0a7c49d2ed998cb0caf891c16faf9d09af1b352c3ec22ca88ad6260",
      "0xe5b43d55675a60e90a59c9d82e6b55b5d00e3433aa5b4b0865a755e4e47f840e"
    ],
    proofHarvestDay: [
      "0x6dd05436178d89b36c51b5da92ac3dc61fc44bb21c0ed682fd7f512c017ea1a7",
      "0x429d0e6fce0004ec67b5348834615c3a91b305f44885622075ba160031d5bad3",
      "0x851cf5dbc9a4f2c8b8df849fd5757f58189c3456e2fd980034ae6a3ae854eec5",
      "0xa350ac8c2c16d3ba2a56cbaf2ad103f883629f3684e6ef591c3332ddca8a2995",
      "0x6836c616e6186547b00aadf1a5d948efdae8823960f19baf6cd6229f98d67832"
    ],
    moisturePct: 16.8,
    moistureSelfDeclared: false,
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    ipfsUri: "ipfs://QmHoneyChainBatch2MetadataNilgirisCluster",
    attestations: [
      {
        oracleAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        nodeType: "Raspberry Pi CM4 LoRa Gateway #3",
        timestamp: "2026-08-25 11:16:10 UTC",
        verified: true
      },
      {
        oracleAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        nodeType: "KVIC Regional Co-Signer Node #1",
        timestamp: "2026-08-25 11:17:02 UTC",
        verified: true
      }
    ],
    telemetrySummary: {
      avgBroodTempC: 34.91,
      avgHumidityPct: 56.2,
      netWeightGainKg: 42.1,
      readingCount: 576
    },
    aiHealthSummary: {
      colonyStatus: "CERTIFIED_WILD_ORGANIC",
      diseaseEvents: 0,
      swarmRiskFlags: 0,
      swarmRiskMaxScore: 0.18,
      acousticHealthScore: 99.2,
      notes: "Exceptional floral nectar surge with zero micro-pathologies. Continuous brood stability across entire altitude curing window.",
      timelineEvents: [
        {
          day: 1,
          event: "High-Altitude Super Ingress",
          severity: "info",
          description: "Stands established at 2,240m elevation; multi-flora nectar flow initiated."
        },
        {
          day: 12,
          event: "Eucalyptus Bloom Surge",
          severity: "success",
          description: "Massive +22.4 kg weight surge recorded; high acoustic buzzing efficiency."
        },
        {
          day: 24,
          event: "Batch Attestation Sealed",
          severity: "success",
          description: "Moisture stabilized at 16.8% via dual refractometer optical probe."
        }
      ]
    }
  },
  3: {
    batchId: 3,
    hiveId: 14,
    apiaryLocation: "Pampore Saffron & Acacia Belt (34.0200° N, 74.9300° E)",
    clusterName: "Kashmir Valley Apiculture Development Federation",
    curingPeriodDays: 20,
    timestamp: "2026-08-22T09:00:00Z",
    merkleRoot: "0x1570a5371654ae174f08810863ff21fc4bd476ef8569047ec3364fdd912c8b07",
    leafHashDay1: "0x2b066cda78409be5e61430d4d43e9e61715a45173eeee28ead46bcb4b204e291",
    leafHashHarvestDay: "0xd799a92ffbe86076bbf0ab44d58ec0b571b9e087768d0f292bdc2ddc65a73d88",
    proofDay1: [
      "0x6557bc67e4d4c91927d2ec901d4afd3c487a2d31b5be281fa7ce876bd903d01c",
      "0x3f7bc05545fc943beb8cb313d8132ee8363d36c7ff3d2df8110ecf438daae0f8",
      "0xf6812f138505dfc6f165f83cf37b36fc062a0d1e45b069a540623887bc404b3b",
      "0xee37c02c24aec5c776b0651c0afdcee2ace982ce7d4b066a2733c968b570ce01",
      "0x20daff9e063b893d6103ddc2e76049c8849bf3df4ce79b0946b7d786edf57c51"
    ],
    proofHarvestDay: [
      "0x27346aeab1bca60d5646542cb0f99d0aecb8606b53eca6d164ed20dad5645f2c",
      "0x2e0294f6d7976ab0257072c6bd7b14035b6858004d4247fb53cd68868f50972a",
      "0x3b6aea8bc3bbd1363d431200db22b467671984c6df93d593fb70ff89a1d614d6",
      "0x703f9f421e47a7ba8b86de77458b3325f54aa728906d003bf3c4c5394218cd4c",
      "0xc4adccd5c178e8d9fc36cad9b18eb53a0f599114648f98bfa25b96adb416e7ae"
    ],
    moisturePct: 17.1,
    moistureSelfDeclared: true,
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    ipfsUri: "ipfs://QmHoneyChainBatch3MetadataKashmirCluster",
    attestations: [
      {
        oracleAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        nodeType: "Raspberry Pi CM4 LoRa Gateway #2",
        timestamp: "2026-08-22 09:01:22 UTC",
        verified: true
      },
      {
        oracleAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        nodeType: "KVIC Regional Co-Signer Node #2",
        timestamp: "2026-08-22 09:02:15 UTC",
        verified: true
      }
    ],
    telemetrySummary: {
      avgBroodTempC: 34.75,
      avgHumidityPct: 54.8,
      netWeightGainKg: 35.8,
      readingCount: 480
    },
    aiHealthSummary: {
      colonyStatus: "CERTIFIED_ORGANIC_HEALTHY",
      diseaseEvents: 0,
      swarmRiskFlags: 0,
      swarmRiskMaxScore: 0.14,
      acousticHealthScore: 97.8,
      notes: "Pure Robinia pseudoacacia (White Acacia) mono-floral harvest. Ultra-low turbidity and pristine moisture crystallization profile.",
      timelineEvents: [
        {
          day: 1,
          event: "Acacia Canopy Ingress",
          severity: "info",
          description: "Hives positioned under high acacia canopy; initial ambient temp 18°C."
        },
        {
          day: 10,
          event: "Mono-Floral Foraging Peak",
          severity: "success",
          description: "High flight velocity recorded; acoustic harmonic purity at 210 Hz queen-right frequency."
        },
        {
          day: 20,
          event: "Quorum Signed Harvest",
          severity: "success",
          description: "Harvest sealed with 17.1% field moisture self-declaration."
        }
      ]
    }
  }
};
