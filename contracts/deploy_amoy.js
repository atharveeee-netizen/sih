/**
 * Deploys HoneyChain.sol + HoneyChainQR.sol to the real Polygon Amoy
 * testnet (chain id 80002). Same deploy logic as deploy_local.js, but
 * the RPC URL and deployer private key come from contracts/.env instead
 * of being hardcoded -- this script is meant to be run against a real
 * network, so a real (throwaway, testnet-only) key is required.
 *
 * Usage:
 *   cd contracts
 *   node deploy_amoy.js
 *
 * Needs contracts/.env with:
 *   PRIVATE_KEY=<deployer key, no quotes, WITH 0x prefix>
 *   POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology   (optional, this is the default)
 *
 * Writes amoy_deployment.json with the deployed addresses -- copy those
 * into frontend/.env as NEXT_PUBLIC_CONTRACT_ADDRESS / NEXT_PUBLIC_QR_CONTRACT_ADDRESS.
 */
require("dotenv").config();
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const RPC_URL = process.env.POLYGON_AMOY_RPC || "https://rpc-amoy.polygon.technology";
const ADMIN_PK = process.env.PRIVATE_KEY;

if (!ADMIN_PK) {
  console.error("Missing PRIVATE_KEY in contracts/.env -- refusing to deploy with no key.");
  process.exit(1);
}

function loadArtifact(name) {
  const p = path.join(process.cwd(), "artifacts", "contracts", `${name}.sol`, `${name}.json`);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const admin = new ethers.Wallet(ADMIN_PK, provider);
  console.log("Deploying to Polygon Amoy via", RPC_URL);
  console.log("Deployer:", admin.address);

  const balance = await provider.getBalance(admin.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "POL");
  if (balance === BigInt(0)) {
    console.error("Deployer wallet has 0 POL -- fund it from https://faucet.polygon.technology first.");
    process.exit(1);
  }

  let nonce = await provider.getTransactionCount(admin.address, "latest");

  const HoneyChainArtifact = loadArtifact("HoneyChain");
  const HoneyChainFactory = new ethers.ContractFactory(HoneyChainArtifact.abi, HoneyChainArtifact.bytecode, admin);
  const honeyChain = await HoneyChainFactory.deploy({ nonce: nonce++ });
  await honeyChain.waitForDeployment();
  const honeyChainAddr = await honeyChain.getAddress();
  console.log("HoneyChain deployed:", honeyChainAddr);
  console.log("  -> https://amoy.polygonscan.com/address/" + honeyChainAddr);

  const HoneyChainQRArtifact = loadArtifact("HoneyChainQR");
  const ctorInputs = HoneyChainQRArtifact.abi.find(x => x.type === "constructor");

  const HoneyChainQRFactory = new ethers.ContractFactory(HoneyChainQRArtifact.abi, HoneyChainQRArtifact.bytecode, admin);
  let honeyChainQR;
  if (!ctorInputs || ctorInputs.inputs.length === 0) {
    honeyChainQR = await HoneyChainQRFactory.deploy({ nonce: nonce++ });
  } else {
    honeyChainQR = await HoneyChainQRFactory.deploy(honeyChainAddr, { nonce: nonce++ });
  }
  await honeyChainQR.waitForDeployment();
  const honeyChainQRAddr = await honeyChainQR.getAddress();
  console.log("HoneyChainQR deployed:", honeyChainQRAddr);
  console.log("  -> https://amoy.polygonscan.com/address/" + honeyChainQRAddr);

  const out = {
    network: "amoy",
    chain_id: 80002,
    rpc_url: RPC_URL,
    admin_address: admin.address,
    honeychain_address: honeyChainAddr,
    honeychain_qr_address: honeyChainQRAddr,
    deployed_at: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(process.cwd(), "amoy_deployment.json"), JSON.stringify(out, null, 2));
  console.log("\nWrote amoy_deployment.json");
  console.log("\nNext: copy these into frontend/.env --");
  console.log("NEXT_PUBLIC_RPC_URL=" + RPC_URL);
  console.log("NEXT_PUBLIC_CONTRACT_ADDRESS=" + honeyChainAddr);
  console.log("NEXT_PUBLIC_QR_CONTRACT_ADDRESS=" + honeyChainQRAddr);
}

main().catch((e) => { console.error(e); process.exit(1); });
