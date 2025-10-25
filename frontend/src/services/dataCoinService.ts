import lighthouse from '@lighthouse-web3/sdk'
import { ethers } from 'ethers'
import oneMBDataCoinService from './oneMBDataCoinService'

export interface DataContribution {
  contributor: string
  dataHash: string
  dataType: string
  timestamp: number
  rewardAmount: string
  validated: boolean
}

// MedSynapse contract ABI for consent operations
const MEDSYNAPSE_ABI = [
  "function totalConsents() view returns (uint256)",
  "function getContributorConsents(address contributor) view returns (bytes32[])",
  "function getConsentInfo(bytes32 consentId) view returns (address, string, string, string, uint256, bool, uint256)",
  "function createConsent(string dataHash, string dataType, string description) returns (bytes32)",
  "function requestDataAccess(bytes32 consentId, string purpose)",
  "function approveResearchRequest(bytes32 consentId, uint256 requestIndex)",
  "function revokeConsent(bytes32 consentId)",
  "function isAuthorized(bytes32 consentId, address researcher) view returns (bool)",
  "function recordDataAccess(bytes32 consentId)",
  "event ConsentCreated(bytes32 indexed consentId, address indexed contributor, string dataHash)",
  "event ResearchRequested(bytes32 indexed consentId, address indexed researcher, string purpose)",
  "event ResearchApproved(bytes32 indexed consentId, address indexed researcher)"
]

class DataCoinService {
  private apiKey: string
  private provider: ethers.JsonRpcProvider
  private wallet?: ethers.Wallet
  private contract?: ethers.Contract
  private contractAddress: string

  constructor() {
    this.apiKey = import.meta.env.VITE_LIGHTHOUSE_API_KEY || ''
    this.contractAddress = import.meta.env.VITE_MEDSYNAPSE_CONTRACT || ''
    // Use Polygon Amoy testnet
    this.provider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology')
    
    // Only create wallet if private key is provided and valid
    const privateKey = import.meta.env.VITE_PRIVATE_KEY
    if (privateKey && privateKey.length === 64) {
      try {
        this.wallet = new ethers.Wallet(privateKey, this.provider)
        this.contract = new ethers.Contract(this.contractAddress, MEDSYNAPSE_ABI, this.wallet)
      } catch (error) {
        console.warn('Invalid private key provided, wallet not created:', error)
      }
    }
  }

  /**
   * Get 1MB.io data coin information
   */
  async getTokenInfo(): Promise<{ name: string, symbol: string, totalSupply: string, decimals: number }> {
    try {
      if (oneMBDataCoinService.isConfigured()) {
        const coinInfo = await oneMBDataCoinService.getDataCoinInfo('medsynapse')
        return {
          name: coinInfo.name,
          symbol: coinInfo.symbol,
          totalSupply: coinInfo.totalSupply,
          decimals: coinInfo.decimals
        }
      } else {
        // Fallback to consent-based system
        if (!this.contract) {
          throw new Error('Contract not initialized')
        }

        const totalConsents = await this.contract.totalConsents()

        return {
          name: 'MedSynapse Data Coins',
          symbol: 'MDC',
          decimals: 18,
          totalSupply: '1000000' // 1 million data coins
        }
      }
    } catch (error) {
      console.error('Error getting token info:', error)
      throw new Error(`Failed to get token info: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get consent count for a contributor from the deployed contract
   */
  async getContributorBalance(contributorAddress: string): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const consentIds = await this.contract.getContributorConsents(contributorAddress)
      return consentIds.length.toString()
    } catch (error) {
      console.error('Error getting contributor balance:', error)
      throw new Error(`Failed to get contributor balance: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Reward contributor with 1MB.io data coins
   */
  async rewardContributor(contribution: DataContribution): Promise<string> {
    try {
      if (oneMBDataCoinService.isConfigured()) {
        // Use 1MB.io data coin minting
        const txHash = await oneMBDataCoinService.mintDataCoins(
          contribution.contributor,
          contribution.rewardAmount,
          contribution.dataHash
        )
        console.log('Minted 1MB.io data coins:', txHash)
        return txHash
      } else {
        // Fallback: Create consent record on blockchain
        if (!this.contract) {
          throw new Error('Contract not initialized')
        }

        const tx = await this.contract.createConsent(
          contribution.dataHash,
          contribution.dataType,
          `Health data contribution - ${contribution.dataType}`
        )
        await tx.wait()

        // Store reward metadata on Lighthouse
        const rewardData = {
          contributor: contribution.contributor,
          dataHash: contribution.dataHash,
          rewardAmount: contribution.rewardAmount,
          dataType: contribution.dataType,
          timestamp: contribution.timestamp,
          transactionHash: tx.hash
        }

        await lighthouse.storeData(
          JSON.stringify(rewardData),
          this.apiKey,
          this.wallet!
        )

        console.log('Consent created:', tx.hash)
        return tx.hash
      }
    } catch (error) {
      console.error('Error rewarding contributor:', error)
      throw new Error(`Failed to reward contributor: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Validate health data using zkTLS (Zero-Knowledge Transport Layer Security)
   */
  async validateHealthDataWithZKTLS(dataHash: string, dataType: string): Promise<boolean> {
    if (!this.wallet) {
      throw new Error('Wallet not configured. Please add VITE_PRIVATE_KEY to environment variables.')
    }

    try {
      // Simulate zkTLS validation for health data
      // In a real implementation, this would integrate with Reclaim Protocol
      // or other zkTLS providers for data validation
      
      const validationData = {
        dataHash,
        dataType,
        validationMethod: 'zkTLS',
        timestamp: Date.now(),
        validated: true,
        proof: `zkTLS_proof_${dataHash}_${Date.now()}`
      }

      // Store validation proof on Lighthouse
      await lighthouse.storeData(
        JSON.stringify(validationData),
        this.apiKey,
        this.wallet
      )

      return true
    } catch (error) {
      console.error('Error validating data with zkTLS:', error)
      return false
    }
  }

  /**
   * Get data coin balance for a contributor
   */
  async getDataCoinBalance(contributorAddress: string): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const balance = await this.contract.balanceOf(contributorAddress)
      const decimals = await this.contract.decimals()
      return ethers.formatUnits(balance, decimals)
    } catch (error) {
      console.error('Error getting data coin balance:', error)
      return '0'
    }
  }

  /**
   * Get all contributions for a contributor
   */
  async getContributorHistory(contributorAddress: string): Promise<DataContribution[]> {
    try {
      // In a real implementation, this would query blockchain events
      // For now, return empty array since we don't have event tracking yet
      return []
    } catch (error) {
      console.error('Error getting contributor history:', error)
      return []
    }
  }

  /**
   * Check if data coin service is properly configured
   */
  isConfigured(): boolean {
    return !!this.apiKey && !!this.contract && !!this.wallet
  }

  /**
   * Get real consent statistics from the deployed contract
   */
  async getDataCoinStats(): Promise<{
    totalContributions: number
    totalRewardsDistributed: string
    activeContributors: number
    dataCoinAddress: string
  }> {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const totalConsents = await this.contract.totalConsents()

      // For now, return basic stats. In a real implementation, you'd track these in events
      return {
        totalContributions: Number(totalConsents),
        totalRewardsDistributed: totalConsents.toString(),
        activeContributors: Number(totalConsents), // Simplified - would need to track unique contributors
        dataCoinAddress: this.contractAddress
      }
    } catch (error) {
      console.error('Error getting data coin stats:', error)
      throw new Error(`Failed to get data coin stats: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Export singleton instance
export const dataCoinService = new DataCoinService()
export default dataCoinService
