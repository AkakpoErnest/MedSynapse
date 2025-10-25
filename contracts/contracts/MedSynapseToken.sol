// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title MedSynapseToken
 * @dev ERC-20 token for MedSynapse platform rewards
 * Contributors earn MedSynapse tokens for sharing health data
 * Researchers can use tokens to access data or pay for premium features
 */
contract MedSynapseToken is ERC20, Ownable, Pausable {
    
    // Token configuration
    uint256 public constant INITIAL_SUPPLY = 1000000 * 10**18; // 1 million tokens
    uint256 public constant REWARD_PER_CONTRIBUTION = 10 * 10**18; // 10 tokens per contribution
    
    // Platform contracts
    address public medSynapseConsentContract;
    
    // Reward tracking
    mapping(address => uint256) public contributionRewards;
    mapping(address => uint256) public lastRewardTime;
    
    // Events
    event ContributionRewarded(address indexed contributor, uint256 amount, string dataHash);
    event TokensBurned(address indexed account, uint256 amount);
    event PlatformContractUpdated(address indexed oldContract, address indexed newContract);
    
    constructor() ERC20("MedSynapse Token", "MED") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Set the MedSynapse consent contract address
     * @param _consentContract Address of the consent management contract
     */
    function setConsentContract(address _consentContract) external onlyOwner {
        address oldContract = medSynapseConsentContract;
        medSynapseConsentContract = _consentContract;
        emit PlatformContractUpdated(oldContract, _consentContract);
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
        lastRewardTime[contributor] = block.timestamp;
        
        emit ContributionRewarded(contributor, REWARD_PER_CONTRIBUTION, dataHash);
    }
    
    /**
     * @dev Burn tokens (for premium features, data access, etc.)
     * @param amount Amount of tokens to burn
     */
    function burnTokens(uint256 amount) external {
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    /**
     * @dev Transfer tokens with additional checks
     * @param to Recipient address
     * @param amount Amount to transfer
     */
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }
    
    /**
     * @dev Transfer tokens from one account to another
     * @param from Sender address
     * @param to Recipient address
     * @param amount Amount to transfer
     */
    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }
    
    /**
     * @dev Get total rewards earned by a contributor
     * @param contributor Address of the contributor
     * @return Total rewards earned
     */
    function getTotalRewards(address contributor) external view returns (uint256) {
        return contributionRewards[contributor];
    }
    
    /**
     * @dev Get contributor statistics
     * @param contributor Address of the contributor
     * @return balance Current token balance
     * @return totalRewards Total rewards earned
     * @return lastReward Timestamp of last reward
     */
    function getContributorStats(address contributor) external view returns (
        uint256 balance,
        uint256 totalRewards,
        uint256 lastReward
    ) {
        return (
            balanceOf(contributor),
            contributionRewards[contributor],
            lastRewardTime[contributor]
        );
    }
    
    /**
     * @dev Emergency pause function
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause function
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Mint additional tokens (for platform growth)
     * @param to Address to mint tokens to
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
