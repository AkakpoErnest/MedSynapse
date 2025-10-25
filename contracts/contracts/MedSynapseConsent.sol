// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IMedSynapseToken {
    function rewardContributor(address contributor, string memory dataHash) external;
}

contract MedSynapseConsent is Ownable, ReentrancyGuard {
    
    struct ConsentRecord {
        address contributor;
        string dataHash; // Lighthouse file hash
        string dataType; // e.g., "lab_results", "wearable_data"
        string description; // Human readable description
        uint256 timestamp;
        bool isActive;
        uint256 accessCount; // Track how many times accessed
        mapping(address => bool) authorizedResearchers;
    }
    
    struct ResearchRequest {
        address researcher;
        string purpose;
        uint256 requestedAt;
        bool approved;
        uint256 expiresAt;
    }
    
    mapping(bytes32 => ConsentRecord) public consents;
    mapping(address => bytes32[]) public contributorConsents;
    mapping(bytes32 => ResearchRequest[]) public researchRequests;
    
    uint256 public totalConsents;
    uint256 public feePercentage = 5; // 5% fee for platform
    
    // Token integration
    IMedSynapseToken public medSynapseToken;
    bool public tokenRewardsEnabled = true;
    
    event ConsentCreated(bytes32 indexed consentId, address indexed contributor, string dataHash);
    event ConsentRevoked(bytes32 indexed consentId, address indexed contributor);
    event ResearchRequested(bytes32 indexed consentId, address indexed researcher, string purpose);
    event ResearchApproved(bytes32 indexed consentId, address indexed researcher);
    event TokenRewardDistributed(address indexed contributor, uint256 amount);
    
    constructor() {
        // Initialize with some default settings
    }
    
    function createConsent(
        string memory _dataHash,
        string memory _dataType,
        string memory _description
    ) external returns (bytes32) {
        require(bytes(_dataHash).length > 0, "Data hash cannot be empty");
        require(bytes(_dataType).length > 0, "Data type cannot be empty");
        
        bytes32 consentId = keccak256(abi.encodePacked(
            msg.sender,
            _dataHash,
            _dataType,
            block.timestamp
        ));
        
        ConsentRecord storage consent = consents[consentId];
        consent.contributor = msg.sender;
        consent.dataHash = _dataHash;
        consent.dataType = _dataType;
        consent.description = _description;
        consent.timestamp = block.timestamp;
        consent.isActive = true;
        consent.accessCount = 0;
        
        contributorConsents[msg.sender].push(consentId);
        totalConsents++;
        
        // Reward contributor with MedSynapse tokens
        if (tokenRewardsEnabled && address(medSynapseToken) != address(0)) {
            try medSynapseToken.rewardContributor(msg.sender, _dataHash) {
                emit TokenRewardDistributed(msg.sender, 10 * 10**18); // 10 MED tokens
            } catch {
                // Continue even if token reward fails
            }
        }
        
        emit ConsentCreated(consentId, msg.sender, _dataHash);
        return consentId;
    }
    
    function requestDataAccess(
        bytes32 _consentId,
        string memory _purpose
    ) external {
        require(consents[_consentId].isActive, "Consent not active");
        require(consents[_consentId].contributor != address(0), "Invalid consent");
        
        ResearchRequest memory request = ResearchRequest({
            researcher: msg.sender,
            purpose: _purpose,
            requestedAt: block.timestamp,
            approved: false,
            expiresAt: block.timestamp + 30 days // 30 day expiry
        });
        
        researchRequests[_consentId].push(request);
        
        emit ResearchRequested(_consentId, msg.sender, _purpose);
    }
    
    function approveResearchRequest(
        bytes32 _consentId,
        uint256 _requestIndex
    ) external {
        ConsentRecord storage consent = consents[_consentId];
        require(consent.contributor == msg.sender, "Only contributor can approve");
        require(consent.isActive, "Consent not active");
        
        ResearchRequest storage request = researchRequests[_consentId][_requestIndex];
        require(!request.approved, "Already approved");
        require(request.expiresAt > block.timestamp, "Request expired");
        
        request.approved = true;
        consent.authorizedResearchers[request.researcher] = true;
        
        emit ResearchApproved(_consentId, request.researcher);
    }
    
    function revokeConsent(bytes32 _consentId) external {
        ConsentRecord storage consent = consents[_consentId];
        require(consent.contributor == msg.sender, "Only contributor can revoke");
        
        consent.isActive = false;
        
        emit ConsentRevoked(_consentId, msg.sender);
    }
    
    function isAuthorized(bytes32 _consentId, address _researcher) external view returns (bool) {
        ConsentRecord storage consent = consents[_consentId];
        return consent.isActive && consent.authorizedResearchers[_researcher];
    }
    
    function getConsentInfo(bytes32 _consentId) external view returns (
        address contributor,
        string memory dataHash,
        string memory dataType,
        string memory description,
        uint256 timestamp,
        bool isActive,
        uint256 accessCount
    ) {
        ConsentRecord storage consent = consents[_consentId];
        return (
            consent.contributor,
            consent.dataHash,
            consent.dataType,
            consent.description,
            consent.timestamp,
            consent.isActive,
            consent.accessCount
        );
    }
    
    function recordDataAccess(bytes32 _consentId) external {
        ConsentRecord storage consent = consents[_consentId];
        require(consent.isActive, "Consent not active");
        require(consent.authorizedResearchers[msg.sender], "Not authorized");
        
        consent.accessCount++;
    }
    
    function getContributorConsents(address _contributor) external view returns (bytes32[] memory) {
        return contributorConsents[_contributor];
    }
    
    function getResearchRequests(bytes32 _consentId) external view returns (ResearchRequest[] memory) {
        return researchRequests[_consentId];
    }
    
    // Admin functions
    function setFeePercentage(uint256 _newFee) external onlyOwner {
        require(_newFee <= 10, "Fee too high"); // Max 10%
        feePercentage = _newFee;
    }
    
    function setMedSynapseToken(address _tokenAddress) external onlyOwner {
        medSynapseToken = IMedSynapseToken(_tokenAddress);
    }
    
    function setTokenRewardsEnabled(bool _enabled) external onlyOwner {
        tokenRewardsEnabled = _enabled;
    }
    
    function getTokenAddress() external view returns (address) {
        return address(medSynapseToken);
    }
}
