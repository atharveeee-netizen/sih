import { defineChain } from "viem";

// ─── Contract Address ───────────────────────────────────────────────────────
// Deterministic address: first deployment on a fresh Hardhat node.
// Re-deploy with: npx.cmd hardhat run scripts/deploy.js --network localhost
export const CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ??
  "0x5FbDB2315678afecb367f032d93F642f64180aa3"
) as `0x${string}`;

// ─── Local Hardhat Network ───────────────────────────────────────────────────
export const hardhatLocal = defineChain({
  id: 31337,
  name: "Hardhat Localhost",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_URL ?? "http://127.0.0.1:8545",
      ],
    },
  },
});

// ─── Role Hashes (keccak256 of the role string, matching the contract) ───────
export const ROLES = {
  DEFAULT_ADMIN_ROLE:
    "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
  GATEWAY_ROLE:
    "0x5f58c019b9a695e254c01e21b0be8305f8fc1b40c5b27e2f01deb57b20906f2a" as `0x${string}`,
  BEEKEEPER_ROLE:
    "0x20a74b2a4e02e73aa7ef0c9568e5ba1a92284ebbf1a84c33c65b9e9ba7e1e5f3" as `0x${string}`,
  LAB_ROLE:
    "0x8a7f8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7" as `0x${string}`,
} as const;

// ─── ABI ─────────────────────────────────────────────────────────────────────
export const HONEY_ABI = [
  // ── Constructor ──
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },

  // ── Errors ──
  {
    inputs: [],
    name: "AccessControlBadConfirmation",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "bytes32", name: "neededRole", type: "bytes32" },
    ],
    name: "AccessControlUnauthorizedAccount",
    type: "error",
  },

  // ── Events ──
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "string", name: "batchId", type: "string" },
      { indexed: false, internalType: "string", name: "producerId", type: "string" },
      { indexed: false, internalType: "string", name: "hiveLocation", type: "string" },
      { indexed: false, internalType: "uint256", name: "harvestDate", type: "uint256" },
      { indexed: false, internalType: "bytes32", name: "qualityMetricsHash", type: "bytes32" },
      { indexed: false, internalType: "bytes32", name: "aiDiagnosticsHash", type: "bytes32" },
      { indexed: false, internalType: "address", name: "currentOwner", type: "address" },
    ],
    name: "BatchCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "string", name: "batchId", type: "string" },
      { indexed: true, internalType: "address", name: "verifier", type: "address" },
      { indexed: false, internalType: "bool", name: "isAuthentic", type: "bool" },
    ],
    name: "BatchVerified",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "string", name: "batchId", type: "string" },
      { indexed: true, internalType: "address", name: "previousOwner", type: "address" },
      { indexed: true, internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  // AccessControl events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      { indexed: true, internalType: "bytes32", name: "previousAdminRole", type: "bytes32" },
      { indexed: true, internalType: "bytes32", name: "newAdminRole", type: "bytes32" },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      { indexed: true, internalType: "address", name: "account", type: "address" },
      { indexed: true, internalType: "address", name: "sender", type: "address" },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      { indexed: true, internalType: "address", name: "account", type: "address" },
      { indexed: true, internalType: "address", name: "sender", type: "address" },
    ],
    name: "RoleRevoked",
    type: "event",
  },

  // ── Read Functions ──
  {
    inputs: [
      { internalType: "string", name: "_batchId", type: "string" },
    ],
    name: "getBatch",
    outputs: [
      { internalType: "string", name: "batchId", type: "string" },
      { internalType: "string", name: "producerId", type: "string" },
      { internalType: "string", name: "hiveLocation", type: "string" },
      { internalType: "uint256", name: "harvestDate", type: "uint256" },
      { internalType: "bytes32", name: "qualityMetricsHash", type: "bytes32" },
      { internalType: "bytes32", name: "aiDiagnosticsHash", type: "bytes32" },
      { internalType: "address", name: "currentOwner", type: "address" },
      { internalType: "bool", name: "isAuthentic", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
    ],
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GATEWAY_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "BEEKEEPER_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "LAB_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },

  // ── Write Functions ──
  {
    inputs: [
      { internalType: "string", name: "_batchId", type: "string" },
      { internalType: "string", name: "_producerId", type: "string" },
      { internalType: "string", name: "_hiveLocation", type: "string" },
      { internalType: "uint256", name: "_harvestDate", type: "uint256" },
      { internalType: "bytes32", name: "_qualityMetricsHash", type: "bytes32" },
      { internalType: "bytes32", name: "_aiDiagnosticsHash", type: "bytes32" },
    ],
    name: "createBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_batchId", type: "string" },
      { internalType: "address", name: "_newOwner", type: "address" },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_batchId", type: "string" },
      { internalType: "bool", name: "_isAuthentic", type: "bool" },
    ],
    name: "verifyBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "callerConfirmation", type: "address" },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes4", name: "interfaceId", type: "bytes4" },
    ],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
