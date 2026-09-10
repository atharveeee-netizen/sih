const hre = require("hardhat");

async function main() {
  const [deployer, beekeeper1, officer1, supervisor1] = await hre.ethers.getSigners();
  
  console.log("Deploying HoneyChain contracts with deployer:", deployer.address);
  
  // 1. Deploy HoneyChain
  const HoneyChain = await hre.ethers.getContractFactory("HoneyChain");
  const honeyChain = await HoneyChain.deploy();
  await honeyChain.waitForDeployment();
  const honeyChainAddress = await honeyChain.getAddress();
  console.log("HoneyChain deployed to:", honeyChainAddress);
  
  // 2. Deploy HoneyChainQR (0 constructor arguments)
  const HoneyChainQR = await hre.ethers.getContractFactory("HoneyChainQR");
  const honeyChainQR = await HoneyChainQR.deploy();
  await honeyChainQR.waitForDeployment();
  const qrAddress = await honeyChainQR.getAddress();
  console.log("HoneyChainQR deployed to:", qrAddress);
  
  console.log("\n==========================================");
  console.log("--- SEEDING SIH 2026 DEMONSTRATION DATA ---");
  console.log("==========================================");
  
  // Setup Roles in HoneyChain
  const BEEKEEPER_ROLE = await honeyChain.BEEKEEPER_ROLE();
  const FIELD_OFFICER_ROLE = await honeyChain.FIELD_OFFICER_ROLE();
  const DISTRICT_SUPERVISOR_ROLE = await honeyChain.DISTRICT_SUPERVISOR_ROLE();

  await honeyChain.grantRole(BEEKEEPER_ROLE, beekeeper1.address);
  await honeyChain.grantRole(FIELD_OFFICER_ROLE, officer1.address);
  await honeyChain.grantRole(DISTRICT_SUPERVISOR_ROLE, supervisor1.address);
  console.log("✓ HoneyChain roles granted: Beekeeper, Field Officer, District Supervisor");

  // Setup Roles in HoneyChainQR
  const OPERATOR_ROLE = await honeyChainQR.OPERATOR_ROLE();
  const OFFICER_ROLE_QR = await honeyChainQR.OFFICER_ROLE();
  await honeyChainQR.grantRole(OPERATOR_ROLE, officer1.address);
  await honeyChainQR.grantRole(OFFICER_ROLE_QR, officer1.address);
  console.log("✓ HoneyChainQR roles granted to Field Officer");
  
  const VALID_PROFILE_CID = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
  const VALID_HARVEST_CID = "QmZtmD2qt8fJpq3rBsN1wcrzywZVCdH751bpPgr3pqCAvw";
  const VALID_LAB_CID     = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
  const qrToken           = "TT-2026-00001";

  // 1. Register Farmer
  console.log("\n[Step 1] Registering Farmer: Rajesh Kumar Verma (Muzaffarpur)...");
  const txRegister = await honeyChain.connect(officer1).registerFarmer(
      beekeeper1.address,
      "Rajesh Kumar Verma",
      "Muzaffarpur, Bihar (Shahi Litchi GI Cluster)",
      "KVIC-BR-2026-0042",
      VALID_PROFILE_CID
  );
  await txRegister.wait();
  console.log("✓ Farmer registered on-chain!");
  
  // 2. Beekeeper Submits Harvest
  console.log("\n[Step 2] Beekeeper submitting harvest (250 kg raw honey)...");
  const txHarvest = await honeyChain.connect(beekeeper1).submitHarvest(
      "Shahi Litchi Blossom",
      250, // 250 kg
      VALID_HARVEST_CID
  );
  await txHarvest.wait();
  console.log("✓ Harvest request #1 submitted to Field Officer queue!");
  
  // 3. Officer Approves and Mints Batch
  console.log("\n[Step 3] Field Officer approving quality lab test and minting Batch #1...");
  const txMint = await honeyChain.connect(officer1).approveHarvestAndMint(
      1, // requestId
      VALID_LAB_CID,
      95, // qualityScore: 95/100
      "FSSAI Grade A (Pure Authentic)",
      qrToken
  );
  await txMint.wait();
  console.log("✓ Batch #1 minted on blockchain with FSSAI Grade A verification!");
  
  // 4. Register QR in HoneyChainQR
  console.log("\n[Step 4] Registering TrueTag Anti-Counterfeiting Micro-QR Seal...");
  const batchId = 1;
  const txQR = await honeyChainQR.connect(officer1).registerQR(qrToken, batchId);
  await txQR.wait();
  console.log(`✓ QR Token '${qrToken}' securely registered and bound to Batch #1!`);

  // Record initial test scan
  console.log("\n[Step 5] Simulating consumer camera scan...");
  const txScan = await honeyChainQR.connect(officer1).recordScan(qrToken);
  await txScan.wait();
  const record = await honeyChainQR.qrRecords(qrToken);
  console.log(`✓ Scan count incremented: ${record.scanCount} scan(s) recorded. Authentic & Uncompromised.`);
  
  console.log("\n==========================================");
  console.log("🏆 SEED COMPLETE: Smart India Hackathon Demo Ready!");
  console.log("HoneyChain Contract:", honeyChainAddress);
  console.log("HoneyChainQR Contract:", qrAddress);
  console.log("Batch ID: 1 | Token: TT-2026-00001 | Status: AUTHENTIC");
  console.log("==========================================");
}

main().catch((error) => {
  console.error("Demo Seed Error:", error);
  process.exitCode = 1;
});
