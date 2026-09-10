/**
 * Server-side (no browser wallet) HoneyChain contract calls.
 *
 * This file exists so the mint flow can send REAL transactions to
 * HoneyChain.sol without ever asking a Field Officer to connect MetaMask —
 * every write here is signed with a private key held on the server, exactly
 * like `gateway/blockchain_bridge.py` already does for the Python gateway.
 * Never import this from a client component; it must only ever run in an
 * API route / server context, since it holds private keys.
 */
import { ethers } from "ethers";
import crypto from "crypto";
import { HONEYCHAIN_ABI, HONEYCHAIN_CONTRACT_ADDRESS, HONEYCHAIN_QR_CONTRACT_ADDRESS, POLYGON_AMOY_RPC } from "./constants";

// Hardhat's well-known, publicly-documented local-node test accounts
// (index 0-19). LOCAL-DEV FALLBACK ONLY -- used when BLOCKCHAIN_ADMIN_PRIVATE_KEY
// / FARMER_WALLET_SEED aren't set in the environment, i.e. when running
// against a local `npx hardhat node`. These keys are printed by Hardhat
// itself and are public knowledge -- never fund these addresses on a real
// network (Amoy or otherwise). On Amoy, getOfficerWallet()/getFarmerWallet()
// below use real private keys from env instead of this list.
const HARDHAT_WELL_KNOWN_KEYS = [
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
  "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6",
  "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a",
  "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba",
  "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
  "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356",
  "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97",
  "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6",
  "0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897",
  "0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82",
  "0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1",
  "0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd",
  "0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa",
  "0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61",
  "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0",
  "0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd",
  "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
  "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e",
];

// Extends the shared read-path ABI with the one auto-generated public
// mapping getter it doesn't declare. Kept local to this file rather than
// edited into constants.ts, since that file is also used client-side.
const SERVER_ABI = [
  ...HONEYCHAIN_ABI,
  "function beekeeperToFarmerId(address) view returns (uint256)",
];

function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(POLYGON_AMOY_RPC);
}

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

/**
 * Holds ADMIN_ROLE + FIELD_OFFICER_ROLE (granted at contract construction to
 * whichever key deployed it). Real deployments (Amoy) set
 * BLOCKCHAIN_ADMIN_PRIVATE_KEY to the actual deployer key in .env; local
 * Hardhat dev falls back to Hardhat's account #0, which is the deployer
 * deploy_local.js used.
 */
function getOfficerWallet(provider: ethers.JsonRpcProvider): ethers.Wallet {
  const key = process.env.BLOCKCHAIN_ADMIN_PRIVATE_KEY || HARDHAT_WELL_KNOWN_KEYS[0];
  return new ethers.Wallet(key, provider);
}

/**
 * One deterministic wallet per Postgres farmer id.
 *
 * When FARMER_WALLET_SEED is set (real deployments), the wallet's private
 * key is derived as keccak256(seed + farmerId) -- a value nobody outside
 * this server can predict, safe to hold real (test) funds on a public
 * network. This is what lets a demo "farmer" have a real on-chain identity
 * without the field officer or judges ever handling a private key.
 *
 * When FARMER_WALLET_SEED is unset (local Hardhat dev), falls back to the
 * old scheme of cycling through Hardhat's public well-known test keys
 * (indices 1-19) -- fine locally, never safe on a real network, which is
 * exactly why the seed-based path exists.
 */
function getFarmerWallet(farmerId: number, provider: ethers.JsonRpcProvider): ethers.Wallet {
  const seed = process.env.FARMER_WALLET_SEED;
  if (seed) {
    const derivedKey = ethers.keccak256(ethers.toUtf8Bytes(`${seed}:farmer:${farmerId}`));
    return new ethers.Wallet(derivedKey, provider);
  }
  const idx = 1 + (Math.abs(farmerId) % (HARDHAT_WELL_KNOWN_KEYS.length - 1));
  return new ethers.Wallet(HARDHAT_WELL_KNOWN_KEYS[idx], provider);
}

// A farmer wallet never gets its own faucet trip -- the officer wallet tops
// it up automatically the first time it needs gas. Amounts are deliberately
// small: Amoy gas is cheap, and the officer wallet's own faucet balance has
// to cover every farmer's top-up plus its own transactions in the same demo.
const FARMER_MIN_BALANCE_WEI = ethers.parseEther("0.004");
const FARMER_TOPUP_WEI = ethers.parseEther("0.01");

/**
 * Ensures a farmer wallet can afford to sign its own transaction, without
 * that farmer ever needing a faucet or a funded wallet of their own. Checks
 * the balance first and only sends a top-up transaction (from the officer
 * wallet, which the faucet funded once) when actually needed -- a no-op on
 * local Hardhat, where farmer wallets already start with a huge genesis
 * balance.
 */
async function ensureFarmerFunded(
  farmerWallet: ethers.Wallet,
  officer: ethers.Wallet,
  provider: ethers.JsonRpcProvider
): Promise<void> {
  const balance = await provider.getBalance(farmerWallet.address);
  if (balance >= FARMER_MIN_BALANCE_WEI) return;
  const topUpTx = await officer.sendTransaction({
    to: farmerWallet.address,
    value: FARMER_TOPUP_WEI,
  });
  await withTimeout(topUpTx.wait(), 30000, "Farmer gas top-up confirmation");
}

/**
 * HoneyChain.sol requires every "IPFS CID" field to be >=44 bytes and
 * nothing in this repo actually pins metadata to IPFS. Same approach
 * gateway/blockchain_bridge.py uses: a deterministic, content-addressed
 * placeholder. Same real inputs always produce the same value; it will not
 * resolve on IPFS. Real pinning is future work, not this.
 */
function placeholderCid(content: string): string {
  return "Qm" + crypto.createHash("sha256").update(content).digest("hex");
}

export interface OnChainMintResult {
  txHash: string;
  blockNumber: number;
  requestId: number;
  batchId: number;
  farmerWallet: string;
  officerWallet: string;
  farmerRegisteredNow: boolean;
}

export interface OnChainMintParams {
  farmerId: number;
  farmerName: string;
  farmerLocation: string;
  farmerCooperativeId: string;
  botanicalFlora: string;
  quantityKg: number;
  qualityScore: number;
  grade: string;
  qrToken: string;
}

/**
 * Real, server-signed on-chain mint -- no browser wallet involved anywhere.
 * Registers the farmer's deterministic wallet on first use, tops it up with
 * gas if needed (farmers never pay their own fees), submits the harvest as
 * that farmer, then approves + mints as the Field Officer account: the same
 * three-step workflow HoneyChain.sol enforces, run back-to-back as three
 * real transactions against whatever NEXT_PUBLIC_RPC_URL /
 * NEXT_PUBLIC_CONTRACT_ADDRESS currently point at (local Hardhat or Polygon
 * Amoy). Throws on any failure -- unreachable RPC, a revert, a bad env var
 * -- so callers should catch and fall back to the existing off-chain-only
 * behavior rather than let a mint 500.
 */
export async function mintBatchOnChain(params: OnChainMintParams): Promise<OnChainMintResult> {
  const provider = getProvider();
  // Fail fast (5s) instead of hanging the whole mint request when nothing's
  // listening on the configured RPC URL.
  await withTimeout(provider.getBlockNumber(), 5000, "Chain RPC connectivity check");

  const officer = getOfficerWallet(provider);
  const farmerWallet = getFarmerWallet(params.farmerId, provider);

  const officerContract = new ethers.Contract(HONEYCHAIN_CONTRACT_ADDRESS, SERVER_ABI, officer);
  const farmerContract = new ethers.Contract(HONEYCHAIN_CONTRACT_ADDRESS, SERVER_ABI, farmerWallet);

  // Step 0: register this farmer's wallet on-chain the first time it's used.
  let farmerRegisteredNow = false;
  const existingFarmerId: bigint = await officerContract.beekeeperToFarmerId(farmerWallet.address);
  if (existingFarmerId === BigInt(0)) {
    const profileHash = placeholderCid(`farmer:${params.farmerId}:${params.farmerName}`);
    const registerTx = await officerContract.registerFarmer(
      farmerWallet.address,
      params.farmerName,
      params.farmerLocation || "Unspecified",
      params.farmerCooperativeId || "KVIC-UNASSIGNED",
      profileHash
    );
    await withTimeout(registerTx.wait(), 30000, "registerFarmer confirmation");
    farmerRegisteredNow = true;
  }

  // Farmer never pays their own gas -- top up from the officer wallet before
  // asking the farmer wallet to sign anything.
  await ensureFarmerFunded(farmerWallet, officer, provider);

  // Step 1: the farmer submits the harvest (their own wallet signs this,
  // since submitHarvest() is BEEKEEPER_ROLE-gated to msg.sender).
  const harvestCid = placeholderCid(`harvest:${params.farmerId}:${params.qrToken}:${Date.now()}`);
  const quantity = Math.max(1, Math.round(params.quantityKg || 1));
  const requestId: bigint = await farmerContract.submitHarvest.staticCall(
    params.botanicalFlora || "Monofloral Flora",
    quantity,
    harvestCid
  );
  const submitTx = await farmerContract.submitHarvest(
    params.botanicalFlora || "Monofloral Flora",
    quantity,
    harvestCid
  );
  await withTimeout(submitTx.wait(), 30000, "submitHarvest confirmation");

  // Step 2: the Field Officer approves + mints. qrToken here MUST be the
  // exact same token the caller is about to persist to Postgres, so
  // on-chain and off-chain records stay linked for the verify page.
  const metadataCid = placeholderCid(`batch:${params.qrToken}:${params.qualityScore}:${params.grade}`);
  const clampedScore = Math.min(100, Math.max(0, Math.round(params.qualityScore)));
  const batchId: bigint = await officerContract.approveHarvestAndMint.staticCall(
    requestId,
    metadataCid,
    clampedScore,
    params.grade || "Grade A (Standard Pure Honey)",
    params.qrToken
  );
  const mintTx = await officerContract.approveHarvestAndMint(
    requestId,
    metadataCid,
    clampedScore,
    params.grade || "Grade A (Standard Pure Honey)",
    params.qrToken
  );
  const mintReceipt = await withTimeout<ethers.ContractTransactionReceipt | null>(
    mintTx.wait(),
    30000,
    "approveHarvestAndMint confirmation"
  );
  if (!mintReceipt) {
    throw new Error("approveHarvestAndMint transaction did not return a receipt");
  }

  return {
    txHash: mintReceipt.hash,
    blockNumber: mintReceipt.blockNumber,
    requestId: Number(requestId),
    batchId: Number(batchId),
    farmerWallet: farmerWallet.address,
    officerWallet: officer.address,
    farmerRegisteredNow,
  };
}


// ─────────────────────────────────────────────────────────────────────────
// HoneyChainQR.sol -- commit-reveal QR registration (anti-counterfeiting)
// ─────────────────────────────────────────────────────────────────────────
//
// A separate contract, its own AccessControl instance (OFFICER_ROLE /
// OPERATOR_ROLE), both granted to whoever deployed it. Since that's the
// same officer wallet used above, one wallet can run this entire two-step
// flow -- no farmer wallet involved here.
const HONEYCHAIN_QR_ABI = [
  "function commitQRSeed(uint256 batchId, bytes32 seedHash)",
  "function registerQRWithCommitment(string qrToken, uint256 batchId, bytes32 revealedSeed, bytes officerSignature)",
  "function qrExists(string) view returns (bool)",
];

export interface OnChainQrResult {
  commitTxHash: string;
  registerTxHash: string;
  blockNumber: number;
  revealedSeed: string;
}

/**
 * Registers a QR token against a batch using HoneyChain.sol's commit-reveal
 * scheme, instead of the plain `registerQR()` shortcut: first commits a
 * hash of a random secret (`commitQRSeed`), then reveals that secret along
 * with an ECDSA signature over (qrToken, batchId, secret) to actually bind
 * the token (`registerQRWithCommitment`). This is what closes the
 * retroactive-QR-swap hole the plain version doesn't -- the commitment is
 * locked in before the QR token this call binds it to is even revealed.
 *
 * batchId here must be the ON-CHAIN HoneyChain.sol batch id (the value
 * mintBatchOnChain() returned), not necessarily the Postgres row id -- the
 * two share a counter only when every mint on this chain goes through this
 * same server path.
 *
 * Callers should NOT await this before responding to the Field Officer --
 * it's meant to run after the mint response is already on its way back to
 * their screen. See the fire-and-forget call site in
 * app/api/batches/route.ts.
 */
export async function registerQrOnChain(params: {
  batchId: number;
  qrToken: string;
}): Promise<OnChainQrResult> {
  const provider = getProvider();
  await withTimeout(provider.getBlockNumber(), 5000, "Chain RPC connectivity check");

  const officer = getOfficerWallet(provider);
  const qrContract = new ethers.Contract(HONEYCHAIN_QR_CONTRACT_ADDRESS, HONEYCHAIN_QR_ABI, officer);

  // Step 1: commit to a random secret without revealing it yet.
  const revealedSeed = ethers.hexlify(ethers.randomBytes(32));
  const seedHash = ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["bytes32"], [revealedSeed]));
  // Both transactions below are sent back to back by the same officer wallet.
  // ethers briefly caches getTransactionCount, so letting it auto-fill the
  // nonce makes the second transaction reuse the first one's nonce and revert
  // with NONCE_EXPIRED -- the commit lands but the binding never does. Track
  // the nonce explicitly, as contracts/deploy_amoy.js does across its two
  // deployments.
  let qrNonce = await provider.getTransactionCount(officer.address, "latest");
  const commitTx = await qrContract.commitQRSeed(params.batchId, seedHash, { nonce: qrNonce++ });
  const commitReceipt = await withTimeout<ethers.ContractTransactionReceipt | null>(
    commitTx.wait(),
    30000,
    "commitQRSeed confirmation"
  );
  if (!commitReceipt) throw new Error("commitQRSeed transaction did not return a receipt");

  // Step 2: reveal the secret, sign over the exact QR token being bound,
  // and register -- matching HoneyChainQR.sol's _recoverSigner(), which
  // expects a standard EIP-191 personal-sign digest over
  // keccak256(abi.encodePacked(qrToken, batchId, revealedSeed)).
  const messageHash = ethers.solidityPackedKeccak256(
    ["string", "uint256", "bytes32"],
    [params.qrToken, params.batchId, revealedSeed]
  );
  const officerSignature = await officer.signMessage(ethers.getBytes(messageHash));
  const registerTx = await qrContract.registerQRWithCommitment(
    params.qrToken,
    params.batchId,
    revealedSeed,
    officerSignature,
    { nonce: qrNonce++ }
  );
  const registerReceipt = await withTimeout<ethers.ContractTransactionReceipt | null>(
    registerTx.wait(),
    30000,
    "registerQRWithCommitment confirmation"
  );
  if (!registerReceipt) throw new Error("registerQRWithCommitment transaction did not return a receipt");

  return {
    commitTxHash: commitReceipt.hash,
    registerTxHash: registerReceipt.hash,
    blockNumber: registerReceipt.blockNumber,
    revealedSeed,
  };
}
