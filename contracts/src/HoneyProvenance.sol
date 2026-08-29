// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HoneyProvenance
 * @notice Multi-oracle DePIN provenance registry for certified honey batches
 * @dev Problem Statement 26021 — Ministry of MSME, Coordination Section
 *      Team: Beevil Knievel
 */
contract HoneyProvenance {
    struct HarvestBatch {
        bytes32 merkleRoot;        // keccak256 root over daily telemetry sub-roots
        uint256 hiveId;
        uint256 timestamp;
        uint256 moisturePpm;       // self-declared until P2 refractometer sensor ships
        bool    moistureSelfDeclared;
        string  ipfsMetadataUri;
        address apiaryOwner;
        uint8   attestationCount;
    }

    // hiveId -> registered owner, set once at onboarding (replaces tx.origin)
    mapping(uint256 => address) public hiveOwners;

    // registered oracle/gateway signers and required threshold
    mapping(address => bool) public isOracle;
    uint8 public constant REQUIRED_ATTESTATIONS = 2;
    uint8 public oracleCount;

    mapping(uint256 => HarvestBatch) public batches;
    mapping(uint256 => mapping(address => bool)) public hasAttested;
    uint256 public totalBatches;

    event HiveRegistered(uint256 indexed hiveId, address indexed owner);
    event OracleRegistered(address indexed oracle);
    event BatchProposed(uint256 indexed batchId, uint256 indexed hiveId, bytes32 merkleRoot);
    event BatchFinalized(uint256 indexed batchId, uint256 indexed hiveId, bytes32 merkleRoot, string ipfsUri);

    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyOracle() {
        require(isOracle[msg.sender], "Not a registered oracle");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerOracle(address _oracle) external onlyAdmin {
        require(_oracle != address(0), "Invalid oracle address");
        require(!isOracle[_oracle], "Already registered");
        isOracle[_oracle] = true;
        oracleCount++;
        emit OracleRegistered(_oracle);
    }

    function registerHive(uint256 _hiveId, address _owner) external onlyAdmin {
        require(_owner != address(0), "Invalid owner address");
        require(hiveOwners[_hiveId] == address(0), "Hive already registered");
        hiveOwners[_hiveId] = _owner;
        emit HiveRegistered(_hiveId, _owner);
    }

    function proposeBatch(
        uint256 _hiveId,
        bytes32 _merkleRoot,
        uint256 _moisturePpm,
        bool _moistureSelfDeclared,
        string calldata _ipfsUri
    ) external onlyOracle returns (uint256 batchId) {
        require(hiveOwners[_hiveId] != address(0), "Hive not registered");
        require(
            _moistureSelfDeclared || _moisturePpm <= 1850,
            "Moisture too high: honey not naturally capped"
        );

        batchId = ++totalBatches;
        batches[batchId] = HarvestBatch({
            merkleRoot: _merkleRoot,
            hiveId: _hiveId,
            timestamp: block.timestamp,
            moisturePpm: _moisturePpm,
            moistureSelfDeclared: _moistureSelfDeclared,
            ipfsMetadataUri: _ipfsUri,
            apiaryOwner: hiveOwners[_hiveId],
            attestationCount: 1
        });
        hasAttested[batchId][msg.sender] = true;

        emit BatchProposed(batchId, _hiveId, _merkleRoot);
    }

    function attestBatch(uint256 _batchId) external onlyOracle {
        HarvestBatch storage batch = batches[_batchId];
        require(batch.timestamp != 0, "Batch does not exist");
        require(!hasAttested[_batchId][msg.sender], "Already attested");

        hasAttested[_batchId][msg.sender] = true;
        batch.attestationCount++;

        if (batch.attestationCount >= REQUIRED_ATTESTATIONS) {
            emit BatchFinalized(_batchId, batch.hiveId, batch.merkleRoot, batch.ipfsMetadataUri);
        }
    }

    function isFinalized(uint256 _batchId) public view returns (bool) {
        return batches[_batchId].attestationCount >= REQUIRED_ATTESTATIONS;
    }

    function getBatch(uint256 _batchId) external view returns (HarvestBatch memory) {
        require(batches[_batchId].timestamp != 0, "Batch does not exist");
        return batches[_batchId];
    }

    function verifyJar(
        uint256 _batchId,
        bytes32 _leafHash,
        bytes32[] calldata _merkleProof
    ) external view returns (
        bool isValid,
        bool finalized,
        uint256 hiveId,
        uint256 timestamp,
        uint256 moisturePpm,
        bool moistureSelfDeclared,
        string memory ipfsUri
    ) {
        HarvestBatch memory batch = batches[_batchId];
        require(batch.timestamp != 0, "Batch does not exist");

        bytes32 computedHash = _leafHash;
        for (uint256 i = 0; i < _merkleProof.length; i++) {
            bytes32 proofElement = _merkleProof[i];
            computedHash = computedHash <= proofElement
                ? keccak256(abi.encodePacked(computedHash, proofElement))
                : keccak256(abi.encodePacked(proofElement, computedHash));
        }

        isValid = (computedHash == batch.merkleRoot);
        finalized = (batch.attestationCount >= REQUIRED_ATTESTATIONS);
        return (
            isValid,
            finalized,
            batch.hiveId,
            batch.timestamp,
            batch.moisturePpm,
            batch.moistureSelfDeclared,
            batch.ipfsMetadataUri
        );
    }
}
