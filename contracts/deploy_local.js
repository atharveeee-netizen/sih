const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

const RPC_URL = "http://127.0.0.1:8545";
const ADMIN_PK = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat account #0

function loadArtifact(name) {
  const p = path.join(process.cwd(), "artifacts", "contracts", `${name}.sol`, `${name}.json`);
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const admin = new ethers.Wallet(ADMIN_PK, provider);
  console.log("Deployer:", admin.address);

  let nonce = await provider.getTransactionCount(admin.address, "latest");

  const HoneyChainArtifact = loadArtifact("HoneyChain");
  const HoneyChainFactory = new ethers.ContractFactory(HoneyChainArtifact.abi, HoneyChainArtifact.bytecode, admin);
  const honeyChain = await HoneyChainFactory.deploy({ nonce: nonce++ });
  await honeyChain.waitForDeployment();
  const honeyChainAddr = await honeyChain.getAddress();
  console.log("HoneyChain deployed:", honeyChainAddr);

  const HoneyChainQRArtifact = loadArtifact("HoneyChainQR");
  const ctorInputs = HoneyChainQRArtifact.abi.find(x => x.type === "constructor");
  console.log("HoneyChainQR constructor inputs:", JSON.stringify(ctorInputs ? ctorInputs.inputs : "none"));

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

  const out = {
    rpc_url: RPC_URL,
    admin_address: admin.address,
    admin_private_key: ADMIN_PK,
    honeychain_address: honeyChainAddr,
    honeychain_qr_address: honeyChainQRAddr,
  };
  fs.writeFileSync(path.join(process.cwd(), "local_deployment.json"), JSON.stringify(out, null, 2));
  console.log("Wrote local_deployment.json");
}

main().catch((e) => { console.error(e); process.exit(1); });
