// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title HoneyBatchTraceability
 * @dev Implements blockchain-based honey batch traceability, role-based access control,
 * and secure logging of IoT telemetry/AI diagnostics for the Beevil Knievel platform.
 */
contract HoneyBatchTraceability is AccessControl {
    // Define role constants
    bytes32 public constant GATEWAY_ROLE = keccak256("GATEWAY_ROLE");
    bytes32 public constant BEEKEEPER_ROLE = keccak256("BEEKEEPER_ROLE");
    bytes32 public constant LAB_ROLE = keccak256("LAB_ROLE");

    struct HoneyBatch {
        string batchId;
        string producerId;
        string hiveLocation;
        uint256 harvestDate;
        bytes32 qualityMetricsHash;
        bytes32 aiDiagnosticsHash;
        address currentOwner;
        bool isAuthentic;
        bool exists;
    }

    // Storage: Mapping from batchId string to HoneyBatch record
    mapping(string => HoneyBatch) private batches;

    // Events
    event BatchCreated(
        string batchId,
        string producerId,
        string hiveLocation,
        uint256 harvestDate,
        bytes32 qualityMetricsHash,
        bytes32 aiDiagnosticsHash,
        address currentOwner
    );

    event OwnershipTransferred(
        string indexed batchId,
        address indexed previousOwner,
        address indexed newOwner
    );

    event BatchVerified(
        string indexed batchId,
        address indexed verifier,
        bool isAuthentic
    );

    constructor() {
        // Set up admin role and grant all roles to deployer for initial setup/testing
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(BEEKEEPER_ROLE, msg.sender);
        _grantRole(GATEWAY_ROLE, msg.sender);
        _grantRole(LAB_ROLE, msg.sender);
    }

    /**
     * @dev Creates a new honey batch entry. Callable only by registered beekeepers or gateways.
     */
    function createBatch(
        string calldata _batchId,
        string calldata _producerId,
        string calldata _hiveLocation,
        uint256 _harvestDate,
        bytes32 _qualityMetricsHash,
        bytes32 _aiDiagnosticsHash
    ) external {
        // Check permissions: sender must be a beekeeper or an authorized gateway
        require(
            hasRole(BEEKEEPER_ROLE, msg.sender) || hasRole(GATEWAY_ROLE, msg.sender),
            "Traceability: Sender must be an authorized beekeeper or gateway"
        );
        require(bytes(_batchId).length > 0, "Traceability: Batch ID cannot be empty");
        require(!batches[_batchId].exists, "Traceability: Batch ID already exists");

        batches[_batchId] = HoneyBatch({
            batchId: _batchId,
            producerId: _producerId,
            hiveLocation: _hiveLocation,
            harvestDate: _harvestDate,
            qualityMetricsHash: _qualityMetricsHash,
            aiDiagnosticsHash: _aiDiagnosticsHash,
            currentOwner: msg.sender,
            isAuthentic: true, // Default to true on creation by authorized entity
            exists: true
        });

        emit BatchCreated(
            _batchId,
            _producerId,
            _hiveLocation,
            _harvestDate,
            _qualityMetricsHash,
            _aiDiagnosticsHash,
            msg.sender
        );
    }

    /**
     * @dev Transfers ownership of a honey batch. Callable only by the current batch owner.
     */
    function transferOwnership(string calldata _batchId, address _newOwner) external {
        require(batches[_batchId].exists, "Traceability: Batch does not exist");
        require(batches[_batchId].currentOwner == msg.sender, "Traceability: Sender is not the current owner");
        require(_newOwner != address(0), "Traceability: New owner cannot be zero address");

        address previousOwner = batches[_batchId].currentOwner;
        batches[_batchId].currentOwner = _newOwner;

        emit OwnershipTransferred(_batchId, previousOwner, _newOwner);
    }

    /**
     * @dev Toggles authenticity flag of a batch. Callable only by authorized laboratories.
     */
    function verifyBatch(string calldata _batchId, bool _isAuthentic) external {
        require(hasRole(LAB_ROLE, msg.sender), "Traceability: Sender must be an authorized lab");
        require(batches[_batchId].exists, "Traceability: Batch does not exist");

        batches[_batchId].isAuthentic = _isAuthentic;

        emit BatchVerified(_batchId, msg.sender, _isAuthentic);
    }

    /**
     * @dev Returns full metadata of a batch for QR lookup.
     */
    function getBatch(string calldata _batchId)
        external
        view
        returns (
            string memory batchId,
            string memory producerId,
            string memory hiveLocation,
            uint256 harvestDate,
            bytes32 qualityMetricsHash,
            bytes32 aiDiagnosticsHash,
            address currentOwner,
            bool isAuthentic
        )
    {
        require(batches[_batchId].exists, "Traceability: Batch does not exist");
        HoneyBatch memory batch = batches[_batchId];
        return (
            batch.batchId,
            batch.producerId,
            batch.hiveLocation,
            batch.harvestDate,
            batch.qualityMetricsHash,
            batch.aiDiagnosticsHash,
            batch.currentOwner,
            batch.isAuthentic
        );
    }
}
