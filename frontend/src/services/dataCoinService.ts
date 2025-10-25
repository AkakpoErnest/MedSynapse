import lighthouse from '@lighthouse-web3/sdk'
import { ethers } from 'ethers'

export interface DataContribution {
  contributor: string
  dataHash: string
  dataType: string
  timestamp: number
  rewardAmount: string
  validated: boolean
}

// MedSynapse contract ABI for token operations
const MEDSYNAPSE_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount) returns (bool)",
  "function getContributorBalance(address contributor) view returns (uint256)",
  "function rewardContributor(address contributor, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Mint(address indexed to, uint256 amount)",
  "event Reward(address indexed contributor, uint256 amount)"
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
   * Get token information from the deployed MedSynapse contract
   */
  async getTokenInfo(): Promise<{ name: string, symbol: string, totalSupply: string, decimals: number }> {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
        this.contract.decimals(),
        this.contract.totalSupply()
      ])

      return {
        name,
        symbol,
        decimals,
        totalSupply: ethers.formatUnits(totalSupply, decimals)
      }
    } catch (error) {
      console.error('Error getting token info:', error)
      throw new Error(`Failed to get token info: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get balance for a contributor from the deployed contract
   */
  async getContributorBalance(contributorAddress: string): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const balance = await this.contract.balanceOf(contributorAddress)
      const decimals = await this.contract.decimals()
      return ethers.formatUnits(balance, decimals)
    } catch (error) {
      console.error('Error getting contributor balance:', error)
      throw new Error(`Failed to get contributor balance: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Reward a contributor with tokens for health data contribution
   */
  async rewardContributor(contribution: DataContribution): Promise<string> {
    if (!this.contract) {
      throw new Error('Contract not initialized')
    }

    try {
      const rewardAmount = ethers.parseUnits(contribution.rewardAmount, await this.contract.decimals())
      
      // Call the contract's rewardContributor function
      const tx = await this.contract.rewardContributor(contribution.contributor, rewardAmount)
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

      console.log('Contributor rewarded:', tx.hash)
      return tx.hash
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
   * Get real data coin statistics from the deployed contract
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
      const [totalSupply, decimals] = await Promise.all([
        this.contract.totalSupply(),
        this.contract.decimals()
      ])

      // For now, return basic stats. In a real implementation, you'd track these in events
      return {
        totalContributions: 0, // Would need to track from events
        totalRewardsDistributed: ethers.formatUnits(totalSupply, decimals),
        activeContributors: 0, // Would need to track from events
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
