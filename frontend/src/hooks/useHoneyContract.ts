"use client";

import { useCallback } from "react";
import {
  keccak256,
  toBytes,
  type PublicClient,
  type WalletClient,
  type Address,
  type Hash,
  type TransactionReceipt,
  parseEventLogs,
  isAddress,
} from "viem";
import { HONEY_ABI, CONTRACT_ADDRESS } from "@/lib/contract";

export interface HoneyBatch {
  batchId: string;
  producerId: string;
  hiveLocation: string;
  harvestDate: bigint;
  qualityMetricsHash: `0x${string}`;
  aiDiagnosticsHash: `0x${string}`;
  currentOwner: Address;
  isAuthentic: boolean;
}

export interface TxResult {
  txHash: Hash;
  receipt: TransactionReceipt;
}

export interface QualityParams {
  moisture: string;
  hmf: string;
  pollenCount: string;
}

export interface AiDiagParams {
  diagnosis: string;
  confidence: string;
}

function parseContractError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);

  if (msg.includes("User rejected") || msg.includes("4001")) {
    return "Transaction rejected in MetaMask.";
  }
  if (msg.includes("Batch ID already exists")) {
    return "This Batch ID is already registered on-chain.";
  }
  if (msg.includes("Batch does not exist")) {
    return "Batch not found on the blockchain.";
  }
  if (msg.includes("Sender is not the current owner")) {
    return "You are not the current owner of this batch.";
  }
  if (msg.includes("Sender must be an authorized lab")) {
    return "Your address does not have LAB_ROLE. Only certified labs can verify batches.";
  }
  if (msg.includes("Sender must be an authorized beekeeper or gateway")) {
    return "Your address does not have BEEKEEPER_ROLE or GATEWAY_ROLE.";
  }
  if (msg.includes("Batch ID cannot be empty")) {
    return "Batch ID cannot be empty.";
  }
  if (msg.includes("New owner cannot be zero address")) {
    return "New owner address cannot be the zero address.";
  }
  if (msg.includes("ECONNREFUSED") || msg.includes("Failed to fetch")) {
    return "Cannot reach the Hardhat node. Make sure `npx.cmd hardhat node` is running.";
  }

  return msg.length > 150 ? msg.substring(0, 150) + "..." : msg;
}

export function computeHash(data: object): `0x${string}` {
  return keccak256(toBytes(JSON.stringify(data)));
}

export interface UseHoneyContractOptions {
  publicClient: PublicClient | null;
  walletClient: WalletClient | null;
  account: Address | null;
}

export function useHoneyContract({
  publicClient,
  walletClient,
  account,
}: UseHoneyContractOptions) {
  const getBatch = useCallback(
    async (batchId: string): Promise<HoneyBatch> => {
      if (!publicClient) throw new Error("No RPC connection available.");
      try {
        const result = await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: HONEY_ABI,
          functionName: "getBatch",
          args: [batchId.trim().toUpperCase()],
        });
        const [
          onChainBatchId,
          producerId,
          hiveLocation,
          harvestDate,
          qualityMetricsHash,
          aiDiagnosticsHash,
          currentOwner,
          isAuthentic,
        ] = result as [
          string,
          string,
          string,
          bigint,
          `0x${string}`,
          `0x${string}`,
          Address,
          boolean
        ];

        return {
          batchId: onChainBatchId,
          producerId,
          hiveLocation,
          harvestDate,
          qualityMetricsHash,
          aiDiagnosticsHash,
          currentOwner,
          isAuthentic,
        };
      } catch (err) {
        throw new Error(parseContractError(err));
      }
    },
    [publicClient]
  );

  const createBatch = useCallback(
    async (
      batchId: string,
      producerId: string,
      hiveLocation: string,
      harvestDateUnix: bigint,
      qualityParams: QualityParams,
      aiParams: AiDiagParams
    ): Promise<TxResult> => {
      if (!walletClient || !account || !publicClient) {
        throw new Error("Wallet not connected.");
      }

      const qualityHash = computeHash(qualityParams);
      const aiHash = computeHash(aiParams);

      try {
        const txHash = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: HONEY_ABI,
          functionName: "createBatch",
          args: [
            batchId.trim().toUpperCase(),
            producerId || "PROD-ANONYMOUS",
            hiveLocation || "Unknown Apiary Location",
            harvestDateUnix,
            qualityHash,
            aiHash,
          ],
          account,
          chain: walletClient.chain,
        });

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
          confirmations: 1,
        });

        if (receipt.status === "reverted") {
          throw new Error("Transaction was reverted by the contract.");
        }

        return { txHash, receipt };
      } catch (err) {
        throw new Error(parseContractError(err));
      }
    },
    [walletClient, account, publicClient]
  );

  const transferOwnership = useCallback(
    async (batchId: string, newOwner: string): Promise<TxResult> => {
      if (!walletClient || !account || !publicClient) {
        throw new Error("Wallet not connected.");
      }
      if (!isAddress(newOwner)) {
        throw new Error("Invalid Ethereum address.");
      }

      try {
        const txHash = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: HONEY_ABI,
          functionName: "transferOwnership",
          args: [batchId.trim().toUpperCase(), newOwner as Address],
          account,
          chain: walletClient.chain,
        });

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
          confirmations: 1,
        });

        if (receipt.status === "reverted") {
          throw new Error("Transaction was reverted by the contract.");
        }

        const logs = parseEventLogs({
          abi: HONEY_ABI,
          logs: receipt.logs,
          eventName: "OwnershipTransferred",
        });
        void logs;

        return { txHash, receipt };
      } catch (err) {
        throw new Error(parseContractError(err));
      }
    },
    [walletClient, account, publicClient]
  );

  const verifyBatch = useCallback(
    async (batchId: string, isAuthentic: boolean): Promise<TxResult> => {
      if (!walletClient || !account || !publicClient) {
        throw new Error("Wallet not connected.");
      }

      try {
        const txHash = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: HONEY_ABI,
          functionName: "verifyBatch",
          args: [batchId.trim().toUpperCase(), isAuthentic],
          account,
          chain: walletClient.chain,
        });

        const receipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
          confirmations: 1,
        });

        if (receipt.status === "reverted") {
          throw new Error("Transaction was reverted by the contract.");
        }

        return { txHash, receipt };
      } catch (err) {
        throw new Error(parseContractError(err));
      }
    },
    [walletClient, account, publicClient]
  );

  return {
    getBatch,
    createBatch,
    transferOwnership,
    verifyBatch,
    computeHash,
  };
}
