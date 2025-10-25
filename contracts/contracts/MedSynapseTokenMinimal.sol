// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MedSynapseTokenMinimal
 * @dev Minimal ERC-20 token for MedSynapse - uses least gas possible
 */
contract MedSynapseTokenMinimal is ERC20 {
    
    address public consentContract;
    
    constructor() ERC20("MedSynapse Token", "MED") {
        _mint(msg.sender, 1000000 * 10**18); // 1M tokens
    }
    
    function setConsentContract(address _consent) external {
        consentContract = _consent;
    }
    
    function rewardContributor(address contributor, string memory) external {
        require(msg.sender == consentContract, "Unauthorized");
        _mint(contributor, 10 * 10**18); // 10 MED
    }
}
