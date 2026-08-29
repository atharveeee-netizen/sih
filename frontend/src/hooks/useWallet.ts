"use client";

import { useState, useEffect, useCallback } from "react";
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  type PublicClient,
  type WalletClient,
  type Address,
} from "viem";
import { hardhatLocal, HONEY_ABI, CONTRACT_ADDRESS } from "@/lib/contract";

export type WalletRole = "ADMIN" | "BEEKEEPER" | "GATEWAY" | "LAB" | "CONSUMER";

export interface WalletState {
  account: Address | null;
  role: WalletRole;
  isConnected: boolean;
  isConnecting: boolean;
  isWrongNetwork: boolean;
  chainId: number | null;
  publicClient: PublicClient | null;
  walletClient: WalletClient | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToHardhat: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

// Singleton public client for reads (does NOT require MetaMask)
let _publicClient: PublicClient | null = null;
function getPublicClient(): PublicClient {
  if (!_publicClient) {
    _publicClient = createPublicClient({
      chain: hardhatLocal,
      transport: http(
        process.env.NEXT_PUBLIC_RPC_URL ?? "http://127.0.0.1:8545"
      ),
    });
  }
  return _publicClient;
}

async function detectRole(
  publicClient: PublicClient,
  account: Address
): Promise<WalletRole> {
  try {
    const [adminRole, beekeeperRole, gatewayRole, labRole] = await Promise.all([
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: HONEY_ABI,
        functionName: "DEFAULT_ADMIN_ROLE",
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: HONEY_ABI,
        functionName: "BEEKEEPER_ROLE",
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: HONEY_ABI,
        functionName: "GATEWAY_ROLE",
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: HONEY_ABI,
        functionName: "LAB_ROLE",
      }),
    ]);

    const [isAdmin, isBeekeeper, isGateway, isLab] = await Promise.all([
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: HONEY_ABI,
        functionName: "hasRole",
        args: [adminRole, account],
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: HONEY_ABI,
        functionName: "hasRole",
        args: [beekeeperRole, account],
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: HONEY_ABI,
        functionName: "hasRole",
        args: [gatewayRole, account],
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: HONEY_ABI,
        functionName: "hasRole",
        args: [labRole, account],
      }),
    ]);

    if (isAdmin) return "ADMIN";
    if (isLab) return "LAB";
    if (isBeekeeper) return "BEEKEEPER";
    if (isGateway) return "GATEWAY";
    return "CONSUMER";
  } catch {
    return "CONSUMER";
  }
}

export function useWallet(): WalletState {
  const [account, setAccount] = useState<Address | null>(null);
  const [role, setRole] = useState<WalletRole>("CONSUMER");
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  const publicClient = getPublicClient();
  const isWrongNetwork = chainId !== null && chainId !== hardhatLocal.id;
  const isConnected = account !== null && !isWrongNetwork;

  const refreshRole = useCallback(
    async (addr?: Address) => {
      const target = addr ?? account;
      if (!target) return;
      try {
        const detected = await detectRole(publicClient, target);
        setRole(detected);
      } catch {
        setRole("CONSUMER");
      }
    },
    [account, publicClient]
  );

  useEffect(() => {
    if (account && !isWrongNetwork) {
      refreshRole(account);
    }
  }, [account, isWrongNetwork, refreshRole]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        setAccount(null);
        setRole("CONSUMER");
        setWalletClient(null);
      } else {
        const newAccount = accounts[0] as Address;
        setAccount(newAccount);
        const wc = createWalletClient({
          account: newAccount,
          chain: hardhatLocal,
          transport: custom(window.ethereum!),
        });
        setWalletClient(wc);
      }
    };

    const handleChainChanged = (...args: unknown[]) => {
      setChainId(parseInt(args[0] as string, 16));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    window.ethereum
      .request({ method: "eth_accounts" })
      .then((raw) => {
        const accounts = raw as string[];
        if (accounts.length > 0) {
          handleAccountsChanged(accounts);
        }
      })
      .catch(() => {});

    window.ethereum
      .request({ method: "eth_chainId" })
      .then((raw) => setChainId(parseInt(raw as string, 16)))
      .catch(() => {});

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    if (typeof window === "undefined" || !window.ethereum) {
      setError("MetaMask not found. Please install the MetaMask browser extension.");
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      const addr = accounts[0] as Address;
      const hexChainId = (await window.ethereum.request({
        method: "eth_chainId",
      })) as string;
      const detectedChain = parseInt(hexChainId, 16);
      setChainId(detectedChain);
      setAccount(addr);

      const wc = createWalletClient({
        account: addr,
        chain: hardhatLocal,
        transport: custom(window.ethereum),
      });
      setWalletClient(wc);

      if (detectedChain === hardhatLocal.id) {
        const detected = await detectRole(publicClient, addr);
        setRole(detected);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("4001")) {
        setError("Connection rejected. Please approve the MetaMask request.");
      } else {
        setError(`Connection failed: ${msg}`);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [publicClient]);

  const switchToHardhat = useCallback(async () => {
    if (!window.ethereum) return;
    setError(null);
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x7a69" }], // 31337 in hex
      });
    } catch (switchError: unknown) {
      const code = (switchError as { code?: number })?.code;
      if (code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x7a69",
                chainName: "Hardhat Localhost",
                nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
                rpcUrls: [
                  process.env.NEXT_PUBLIC_RPC_URL ?? "http://127.0.0.1:8545",
                ],
              },
            ],
          });
        } catch (addErr: unknown) {
          const msg = addErr instanceof Error ? addErr.message : String(addErr);
          setError(`Failed to add network: ${msg}`);
        }
      } else {
        const msg =
          switchError instanceof Error
            ? switchError.message
            : String(switchError);
        setError(`Failed to switch network: ${msg}`);
      }
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setRole("CONSUMER");
    setWalletClient(null);
    setChainId(null);
    setError(null);
  }, []);

  return {
    account,
    role,
    isConnected,
    isConnecting,
    isWrongNetwork,
    chainId,
    publicClient,
    walletClient,
    error,
    connect,
    disconnect,
    switchToHardhat,
    refreshRole,
  };
}
