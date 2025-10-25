// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MedSynapseTokenSimple
 * @dev Simplified ERC-20 token for MedSynapse platform rewards
 * Uses minimal gas for deployment
 */
contract MedSynapseTokenSimple is ERC20, Ownable {
    
    // Token configuration
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1 million tokens
    uint256 public constant REWARD_PER_CONTRIBUTION = 10 * 10**18; // 10 tokens per contribution
    
    // Platform contracts
    address public medSynapseConsentContract;
    
    // Reward tracking
    mapping(address => uint256) public contributionRewards;
    
    // Events
    event ContributionRewarded(address indexed contributor, uint256 amount, string dataHash);
    
    constructor() ERC20("MedSynapse Token", "MED") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Set the MedSynapse consent contract address
     * @param _consentContract Address of the consent management contract
     */
    function setConsentContract(address _consentContract) external onlyOwner {
        medSynapseConsentContract = _consentContract;
    }
    
    /**
     * @dev Reward contributor with MedSynapse tokens
     * @param contributor Address of the contributor
     * @param dataHash Hash of the uploaded data
     */
    function rewardContributor(address contributor, string memory dataHash) external {
        require(msg.sender == medSynapseConsentContract, "Only consent contract can reward");
        require(contributor != address(0), "Invalid contributor address");
        
        // Mint tokens to contributor
        _mint(contributor, REWARD_PER_CONTRIBUTION);
        
        // Update tracking
        contributionRewards[contributor] += REWARD_PER_CONTRIBUTION;
        
        emit ContributionRewarded(contributor, REWARD_PER_CONTRIBUTION, dataHash);
    }
    
    /**
     * @dev Get total rewards earned by a contributor
     * @param contributor Address of the contributor
     * @return Total rewards earned
     */
    function getTotalRewards(address contributor) external view returns (uint256) {
        return contributionRewards[contributor];
    }
}
