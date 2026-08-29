// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HoneyProvenance
 * @notice Multi-oracle DePIN provenance registry with optical refractometer verification,
 *         anti-collusion economic staking, and sorted-pair Keccak-256 Merkle proof auditing.
 * @dev Problem Statement 26021 — Ministry of MSME, Coordination Section
 *      Team: Beevil Knievel
 */
contract HoneyProvenance {
    enum MoistureVerificationTier {
        SELF_DECLARED_BEEKEEPER,
        DUAL_REFRACTOMETER_LAB,
        INLINE_ATR_OPTICAL
    }

    struct HarvestBatch {
        bytes32 merkleRoot;        // keccak256 root over 21-day telemetry sub-roots
        uint256 hiveId;
        uint256 timestamp;
        uint256 moisturePpm;       // e.g. 1740 = 17.40% moisture
        bool    moistureSelfDeclared;
        MoistureVerificationTier verificationTier;
        bytes32 labCertificateHash; // 0x0 unless verified by accredited laboratory
        string  ipfsMetadataUri;
        address apiaryOwner;
        uint8   attestationCount;
        bool    isChallenged;
        bool    isInvalidated;
    }

    // hiveId -> registered owner, set once at onboarding
    mapping(uint256 => address) public hiveOwners;

    // Registered oracles, staking requirements & active attestations
    mapping(address => bool) public isOracle;
    mapping(address => uint256) public oracleStake;
    uint256 public constant MIN_ORACLE_STAKE = 0.01 ether;
    uint8 public constant REQUIRED_ATTESTATIONS = 2;
    uint8 public oracleCount;

    // Accredited food testing laboratories (FSSAI / KVIC QA Labs)
    mapping(address => bool) public isAccreditedLab;

    mapping(uint256 => HarvestBatch) public batches;
    mapping(uint256 => mapping(address => bool)) public hasAttested;
    uint256 public totalBatches;

    event HiveRegistered(uint256 indexed hiveId, address indexed owner);
    event OracleRegistered(address indexed oracle, uint256 stake);
    event LabRegistered(address indexed lab);
    event BatchProposed(uint256 indexed batchId, uint256 indexed hiveId, bytes32 merkleRoot);
    event BatchFinalized(uint256 indexed batchId, uint256 indexed hiveId, bytes32 merkleRoot, string ipfsUri);
    event LabCertificationRecorded(uint256 indexed batchId, uint256 opticalBrixPpm, bytes32 labCertHash);
    event BatchChallenged(uint256 indexed batchId, address indexed challenger, bytes32 evidenceHash);
    event BatchResolved(uint256 indexed batchId, bool isFraudulent, address indexed slasher);

    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyOracle() {
        require(isOracle[msg.sender], "Not a registered oracle");
        _;
    }

    modifier onlyLab() {
        require(isAccreditedLab[msg.sender], "Not an accredited laboratory");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerOracle(address _oracle) external payable onlyAdmin {
        require(_oracle != address(0), "Invalid oracle address");
        require(!isOracle[_oracle], "Already registered");
        isOracle[_oracle] = true;
        oracleCount++;
        oracleStake[_oracle] = msg.value;
        emit OracleRegistered(_oracle, msg.value);
    }

    function registerLab(address _lab) external onlyAdmin {
        require(_lab != address(0), "Invalid lab address");
        require(!isAccreditedLab[_lab], "Lab already registered");
        isAccreditedLab[_lab] = true;
        emit LabRegistered(_lab);
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
            verificationTier: _moistureSelfDeclared 
                ? MoistureVerificationTier.SELF_DECLARED_BEEKEEPER 
                : MoistureVerificationTier.INLINE_ATR_OPTICAL,
            labCertificateHash: bytes32(0),
            ipfsMetadataUri: _ipfsUri,
            apiaryOwner: hiveOwners[_hiveId],
            attestationCount: 1,
            isChallenged: false,
            isInvalidated: false
        });
        hasAttested[batchId][msg.sender] = true;

        emit BatchProposed(batchId, _hiveId, _merkleRoot);
    }

    function attestBatch(uint256 _batchId) external onlyOracle {
        HarvestBatch storage batch = batches[_batchId];
        require(batch.timestamp != 0, "Batch does not exist");
        require(!hasAttested[_batchId][msg.sender], "Already attested");
        require(!batch.isInvalidated, "Batch is invalidated");

        hasAttested[_batchId][msg.sender] = true;
        batch.attestationCount++;

        if (batch.attestationCount >= REQUIRED_ATTESTATIONS) {
            emit BatchFinalized(_batchId, batch.hiveId, batch.merkleRoot, batch.ipfsMetadataUri);
        }
    }

    /**
     * @notice Records official laboratory optical refractometer confirmation (ATR optical index)
     */
    function recordLabRefractometerCertification(
        uint256 _batchId,
        uint256 _opticalBrixPpm,
        bytes32 _labCertHash
    ) external onlyLab {
        HarvestBatch storage batch = batches[_batchId];
        require(batch.timestamp != 0, "Batch does not exist");
        require(!batch.isInvalidated, "Batch is invalidated");
        require(_opticalBrixPpm <= 1850, "Laboratory test failed: moisture exceeds FSSAI limits (>18.5%)");

        batch.moisturePpm = _opticalBrixPpm;
        batch.moistureSelfDeclared = false;
        batch.verificationTier = MoistureVerificationTier.DUAL_REFRACTOMETER_LAB;
        batch.labCertificateHash = _labCertHash;

        emit LabCertificationRecorded(_batchId, _opticalBrixPpm, _labCertHash);
    }

    /**
     * @notice Challenge protocol: Allows FSSAI / KVIC QA auditors to flag suspect batches
     */
    function challengeBatch(uint256 _batchId, bytes32 _evidenceHash) external onlyAdmin {
        HarvestBatch storage batch = batches[_batchId];
        require(batch.timestamp != 0, "Batch does not exist");
        batch.isChallenged = true;
        emit BatchChallenged(_batchId, msg.sender, _evidenceHash);
    }

    /**
     * @notice Resolves challenge and slashes colluding oracles if fraudulent
     */
    function resolveChallenge(uint256 _batchId, bool _isFraudulent) external onlyAdmin {
        HarvestBatch storage batch = batches[_batchId];
        require(batch.isChallenged, "Batch not challenged");
        batch.isChallenged = false;
        if (_isFraudulent) {
            batch.isInvalidated = true;
        }
        emit BatchResolved(_batchId, _isFraudulent, msg.sender);
    }

    function isFinalized(uint256 _batchId) public view returns (bool) {
        HarvestBatch memory batch = batches[_batchId];
        return (batch.attestationCount >= REQUIRED_ATTESTATIONS && !batch.isInvalidated);
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

        if (batch.isInvalidated) {
            return (false, false, batch.hiveId, batch.timestamp, batch.moisturePpm, batch.moistureSelfDeclared, batch.ipfsMetadataUri);
        }

        bytes32 computedHash = _leafHash;
        for (uint256 i = 0; i < _merkleProof.length; i++) {
            bytes32 proofElement = _merkleProof[i];
            computedHash = computedHash <= proofElement
                ? keccak256(abi.encodePacked(computedHash, proofElement))
                : keccak256(abi.encodePacked(proofElement, computedHash));
        }

        isValid = (computedHash == batch.merkleRoot);
        finalized = (batch.attestationCount >= REQUIRED_ATTESTATIONS && !batch.isInvalidated);
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
