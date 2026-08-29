const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HoneyBatchTraceability", function () {
  let HoneyBatchTraceability;
  let contract;
  let owner;
  let beekeeper;
  let gateway;
  let lab;
  let distributor;
  let unauthorizedUser;

  // Roles hashes
  const GATEWAY_ROLE = ethers.id("GATEWAY_ROLE");
  const BEEKEEPER_ROLE = ethers.id("BEEKEEPER_ROLE");
  const LAB_ROLE = ethers.id("LAB_ROLE");

  beforeEach(async function () {
    [owner, beekeeper, gateway, lab, distributor, unauthorizedUser] = await ethers.getSigners();

    HoneyBatchTraceability = await ethers.getContractFactory("HoneyBatchTraceability");
    contract = await HoneyBatchTraceability.deploy();
    await contract.waitForDeployment();

    // Set up roles
    await contract.grantRole(BEEKEEPER_ROLE, beekeeper.address);
    await contract.grantRole(GATEWAY_ROLE, gateway.address);
    await contract.grantRole(LAB_ROLE, lab.address);
  });

  describe("Role & Initialization", function () {
    it("Should assign admin and all roles to deployer owner", async function () {
      const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
      expect(await contract.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await contract.hasRole(BEEKEEPER_ROLE, owner.address)).to.be.true;
      expect(await contract.hasRole(GATEWAY_ROLE, owner.address)).to.be.true;
      expect(await contract.hasRole(LAB_ROLE, owner.address)).to.be.true;
    });

    it("Should correctly assign granted roles", async function () {
      expect(await contract.hasRole(BEEKEEPER_ROLE, beekeeper.address)).to.be.true;
      expect(await contract.hasRole(GATEWAY_ROLE, gateway.address)).to.be.true;
      expect(await contract.hasRole(LAB_ROLE, lab.address)).to.be.true;
      expect(await contract.hasRole(BEEKEEPER_ROLE, unauthorizedUser.address)).to.be.false;
    });
  });

  describe("Batch Creation", function () {
    const batchId = "BATCH-2026-001";
    const producerId = "PROD-BEE-42";
    const hiveLocation = "Sector A-Row 3";
    const harvestDate = Math.floor(Date.now() / 1000);
    const qualityHash = ethers.keccak256(ethers.toUtf8Bytes("quality-metrics-pollen-moisture"));
    const aiHash = ethers.keccak256(ethers.toUtf8Bytes("ai-pathology-healthy"));

    it("Should allow beekeeper to create a batch", async function () {
      await expect(
        contract.connect(beekeeper).createBatch(
          batchId,
          producerId,
          hiveLocation,
          harvestDate,
          qualityHash,
          aiHash
        )
      )
        .to.emit(contract, "BatchCreated")
        .withArgs(batchId, producerId, hiveLocation, harvestDate, qualityHash, aiHash, beekeeper.address);

      const batch = await contract.getBatch(batchId);
      expect(batch.batchId).to.equal(batchId);
      expect(batch.producerId).to.equal(producerId);
      expect(batch.hiveLocation).to.equal(hiveLocation);
      expect(batch.harvestDate).to.equal(harvestDate);
      expect(batch.qualityMetricsHash).to.equal(qualityHash);
      expect(batch.aiDiagnosticsHash).to.equal(aiHash);
      expect(batch.currentOwner).to.equal(beekeeper.address);
      expect(batch.isAuthentic).to.be.true;
    });

    it("Should allow gateway to create a batch", async function () {
      await expect(
        contract.connect(gateway).createBatch(
          batchId,
          producerId,
          hiveLocation,
          harvestDate,
          qualityHash,
          aiHash
        )
      ).to.emit(contract, "BatchCreated");

      const batch = await contract.getBatch(batchId);
      expect(batch.currentOwner).to.equal(gateway.address);
    });

    it("Should prevent unauthorized users from creating a batch", async function () {
      await expect(
        contract.connect(unauthorizedUser).createBatch(
          batchId,
          producerId,
          hiveLocation,
          harvestDate,
          qualityHash,
          aiHash
        )
      ).to.be.revertedWith("Traceability: Sender must be an authorized beekeeper or gateway");
    });

    it("Should reject empty batch ID", async function () {
      await expect(
        contract.connect(beekeeper).createBatch(
          "",
          producerId,
          hiveLocation,
          harvestDate,
          qualityHash,
          aiHash
        )
      ).to.be.revertedWith("Traceability: Batch ID cannot be empty");
    });

    it("Should prevent duplicate batch IDs", async function () {
      await contract.connect(beekeeper).createBatch(
        batchId,
        producerId,
        hiveLocation,
        harvestDate,
        qualityHash,
        aiHash
      );

      await expect(
        contract.connect(beekeeper).createBatch(
          batchId,
          producerId,
          hiveLocation,
          harvestDate,
          qualityHash,
          aiHash
        )
      ).to.be.revertedWith("Traceability: Batch ID already exists");
    });
  });

  describe("Ownership Transfer", function () {
    const batchId = "BATCH-TRANSFER-001";

    beforeEach(async function () {
      await contract.connect(beekeeper).createBatch(
        batchId,
        "PROD-1",
        "Field A",
        Math.floor(Date.now() / 1000),
        ethers.ZeroHash,
        ethers.ZeroHash
      );
    });

    it("Should allow current owner to transfer ownership to distributor", async function () {
      await expect(
        contract.connect(beekeeper).transferOwnership(batchId, distributor.address)
      )
        .to.emit(contract, "OwnershipTransferred")
        .withArgs(batchId, beekeeper.address, distributor.address);

      const batch = await contract.getBatch(batchId);
      expect(batch.currentOwner).to.equal(distributor.address);
    });

    it("Should prevent non-owner from transferring ownership", async function () {
      await expect(
        contract.connect(unauthorizedUser).transferOwnership(batchId, distributor.address)
      ).to.be.revertedWith("Traceability: Sender is not the current owner");
    });

    it("Should reject transfer to zero address", async function () {
      await expect(
        contract.connect(beekeeper).transferOwnership(batchId, ethers.ZeroAddress)
      ).to.be.revertedWith("Traceability: New owner cannot be zero address");
    });
  });

  describe("Lab Verification", function () {
    const batchId = "BATCH-LAB-001";

    beforeEach(async function () {
      await contract.connect(beekeeper).createBatch(
        batchId,
        "PROD-1",
        "Field A",
        Math.floor(Date.now() / 1000),
        ethers.ZeroHash,
        ethers.ZeroHash
      );
    });

    it("Should allow certified lab to verify authenticity", async function () {
      await expect(
        contract.connect(lab).verifyBatch(batchId, false)
      )
        .to.emit(contract, "BatchVerified")
        .withArgs(batchId, lab.address, false);

      const batch = await contract.getBatch(batchId);
      expect(batch.isAuthentic).to.be.false;
    });

    it("Should prevent non-lab role from verifying batch", async function () {
      await expect(
        contract.connect(beekeeper).verifyBatch(batchId, true)
      ).to.be.revertedWith("Traceability: Sender must be an authorized lab");
    });
  });
});
