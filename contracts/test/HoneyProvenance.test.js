const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HoneyProvenance — Problem Statement 26021 Smart Contract Suite", function () {
  let HoneyProvenance;
  let contract;
  let admin, oracle1, oracle2, oracle3, nonOracle, beekeeper1;

  // Helper to compute sorted pair keccak256
  function hashPair(a, b) {
    const aBig = BigInt(a);
    const bBig = BigInt(b);
    if (aBig <= bBig) {
      return ethers.solidityPackedKeccak256(["bytes32", "bytes32"], [a, b]);
    } else {
      return ethers.solidityPackedKeccak256(["bytes32", "bytes32"], [b, a]);
    }
  }

  // Helper to build 4-leaf sorted Merkle Tree
  function buildMerkleTree(leaves) {
    const layer1_0 = hashPair(leaves[0], leaves[1]);
    const layer1_1 = hashPair(leaves[2], leaves[3]);
    const root = hashPair(layer1_0, layer1_1);
    return {
      root,
      getProof: (index) => {
        if (index === 0) return [leaves[1], layer1_1];
        if (index === 1) return [leaves[0], layer1_1];
        if (index === 2) return [leaves[3], layer1_0];
        if (index === 3) return [leaves[2], layer1_0];
        throw new Error("Invalid leaf index");
      },
    };
  }

  beforeEach(async function () {
    [admin, oracle1, oracle2, oracle3, nonOracle, beekeeper1] = await ethers.getSigners();
    HoneyProvenance = await ethers.getContractFactory("HoneyProvenance");
    contract = await HoneyProvenance.deploy();
    await contract.waitForDeployment();

    // Register 3 Oracles
    await contract.connect(admin).registerOracle(oracle1.address);
    await contract.connect(admin).registerOracle(oracle2.address);
    await contract.connect(admin).registerOracle(oracle3.address);

    // Register Hive 42 to beekeeper1
    await contract.connect(admin).registerHive(42, beekeeper1.address);
  });

  describe("Access Control & Registration", function () {
    it("Admin can register oracles and hives", async function () {
      expect(await contract.isOracle(oracle1.address)).to.be.true;
      expect(await contract.oracleCount()).to.equal(3);
      expect(await contract.hiveOwners(42)).to.equal(beekeeper1.address);
    });

    it("Non-admin cannot register oracles or hives", async function () {
      await expect(
        contract.connect(nonOracle).registerOracle(nonOracle.address)
      ).to.be.revertedWith("Not admin");

      await expect(
        contract.connect(nonOracle).registerHive(101, nonOracle.address)
      ).to.be.revertedWith("Not admin");
    });

    it("Cannot double register existing hive", async function () {
      await expect(
        contract.connect(admin).registerHive(42, beekeeper1.address)
      ).to.be.revertedWith("Hive already registered");
    });
  });

  describe("Batch Proposal & Multi-Oracle Attestation", function () {
    const dummyRoot = ethers.keccak256(ethers.toUtf8Bytes("telemetry-merkle-root-batch-1"));
    const ipfsUri = "ipfs://QmHoneyChainBatch1Metadata";

    it("Oracle can propose a batch with self-declared moisture", async function () {
      const tx = await contract
        .connect(oracle1)
        .proposeBatch(42, dummyRoot, 1740, true, ipfsUri);

      await expect(tx)
        .to.emit(contract, "BatchProposed")
        .withArgs(1, 42, dummyRoot);

      const batch = await contract.getBatch(1);
      expect(batch.hiveId).to.equal(42);
      expect(batch.apiaryOwner).to.equal(beekeeper1.address);
      expect(batch.attestationCount).to.equal(1);
      expect(await contract.isFinalized(1)).to.be.false;
    });

    it("Enforces 2-of-3 multi-oracle quorum for finalization", async function () {
      // Oracle 1 proposes
      await contract.connect(oracle1).proposeBatch(42, dummyRoot, 1740, true, ipfsUri);
      expect(await contract.isFinalized(1)).to.be.false;

      // Oracle 2 attests -> meets quorum (2 of 3)
      const attestTx = await contract.connect(oracle2).attestBatch(1);
      await expect(attestTx)
        .to.emit(contract, "BatchFinalized")
        .withArgs(1, 42, dummyRoot, ipfsUri);

      expect(await contract.isFinalized(1)).to.be.true;
    });

    it("Prevents double attestation by the same oracle", async function () {
      await contract.connect(oracle1).proposeBatch(42, dummyRoot, 1740, true, ipfsUri);

      await expect(
        contract.connect(oracle1).attestBatch(1)
      ).to.be.revertedWith("Already attested");
    });

    it("Rejects proposals for unregistered hives", async function () {
      await expect(
        contract.connect(oracle1).proposeBatch(999, dummyRoot, 1740, true, ipfsUri)
      ).to.be.revertedWith("Hive not registered");
    });

    it("Rejects excessive moisture if not self-declared", async function () {
      // 1950 ppm = 19.5% moisture (> 18.5% threshold)
      await expect(
        contract.connect(oracle1).proposeBatch(42, dummyRoot, 1950, false, ipfsUri)
      ).to.be.revertedWith("Moisture too high: honey not naturally capped");
    });
  });

  describe("End-to-End Cryptographic Merkle Verification (verifyJar)", function () {
    it("Verifies valid jar leaf and rejects forged/tampered leaf", async function () {
      // Construct 4 daily telemetry summary leaves
      const leaf0 = ethers.solidityPackedKeccak256(
        ["uint16", "uint256", "int16", "uint16", "uint16"],
        [42, 1700000000, 3480, 5820, 450] // Day 1
      );
      const leaf1 = ethers.solidityPackedKeccak256(
        ["uint16", "uint256", "int16", "uint16", "uint16"],
        [42, 1700086400, 3485, 5790, 460] // Day 2
      );
      const leaf2 = ethers.solidityPackedKeccak256(
        ["uint16", "uint256", "int16", "uint16", "uint16"],
        [42, 1700172800, 3490, 5800, 455] // Day 3
      );
      const leaf3 = ethers.solidityPackedKeccak256(
        ["uint16", "uint256", "int16", "uint16", "uint16"],
        [42, 1700259200, 3482, 5810, 452] // Day 4 (Harvest Day)
      );

      const tree = buildMerkleTree([leaf0, leaf1, leaf2, leaf3]);
      const ipfsUri = "ipfs://QmValidHoneyBatch";

      // Propose and finalize batch
      await contract.connect(oracle1).proposeBatch(42, tree.root, 1740, true, ipfsUri);
      await contract.connect(oracle2).attestBatch(1);

      // Verify Leaf 0 (Day 1)
      const proof0 = tree.getProof(0);
      const result0 = await contract.verifyJar(1, leaf0, proof0);
      expect(result0.isValid).to.be.true;
      expect(result0.finalized).to.be.true;
      expect(result0.hiveId).to.equal(42);
      expect(result0.moisturePpm).to.equal(1740);

      // Verify Leaf 3 (Harvest Day)
      const proof3 = tree.getProof(3);
      const result3 = await contract.verifyJar(1, leaf3, proof3);
      expect(result3.isValid).to.be.true;

      // Tampered leaf test
      const tamperedLeaf = ethers.solidityPackedKeccak256(
        ["uint16", "uint256", "int16"],
        [42, 1700000000, 9999] // Fake high temperature
      );
      const fakeResult = await contract.verifyJar(1, tamperedLeaf, proof0);
      expect(fakeResult.isValid).to.be.false;
    });
  });
});
