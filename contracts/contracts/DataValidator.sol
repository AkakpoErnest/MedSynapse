// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DataValidator {
    
    mapping(string => bool) public supportedDataTypes;
    
    constructor() {
        supportedDataTypes["lab_results"] = true;
        supportedDataTypes["wearable_data"] = true;
        supportedDataTypes["survey_data"] = true;
        supportedDataTypes["imaging_data"] = true;
        supportedDataTypes["genetic_data"] = true;
    }
    
    function isValidDataType(string memory _dataType) external view returns (bool) {
        return supportedDataTypes[_dataType];
    }
    
    function addSupportedDataType(string memory _dataType) external {
        // In a real implementation, this would be restricted to admin
        supportedDataTypes[_dataType] = true;
    }
    
    function validateDataHash(string memory _hash) external pure returns (bool) {
        bytes memory hashBytes = bytes(_hash);
        return hashBytes.length >= 32 && hashBytes.length <= 64;
    }
}
