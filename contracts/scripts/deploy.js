const { ethers } = require("hardhat");

async function main() {
  console.log("==================================================");
  console.log("🐝 Deploying HoneyProvenance DePIN Smart Contract");
  console.log("   Problem Statement 26021 — Ministry of MSME");
  console.log("==================================================");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  const HoneyProvenance = await ethers.getContractFactory("HoneyProvenance");
  const honeyProvenance = await HoneyProvenance.deploy();
  await honeyProvenance.waitForDeployment();

  const contractAddress = await honeyProvenance.getAddress();
  console.log("✅ HoneyProvenance deployed to:", contractAddress);

  // Initialize Demo Oracles & KVIC Apiary Hives
  console.log("\n📡 Registering Oracles and Test Hives...");
  const oracle1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const oracle2 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
  const oracle3 = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
  const beekeeper1 = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";

  await honeyProvenance.registerOracle(oracle1);
  console.log("✓ Registered Oracle 1:", oracle1);
  await honeyProvenance.registerOracle(oracle2);
  console.log("✓ Registered Oracle 2:", oracle2);
  await honeyProvenance.registerOracle(oracle3);
  console.log("✓ Registered Oracle 3:", oracle3);

  await honeyProvenance.registerHive(42, beekeeper1);
  console.log("✓ Registered Hive 42 -> Beekeeper:", beekeeper1);
  await honeyProvenance.registerHive(108, beekeeper1);
  console.log("✓ Registered Hive 108 -> Beekeeper:", beekeeper1);

  console.log("\n==================================================");
  console.log("🚀 Deployment & Demo Setup Complete!");
  console.log("Contract Address:", contractAddress);
  console.log("==================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
