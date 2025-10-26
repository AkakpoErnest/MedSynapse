import { ethers } from 'ethers'

export interface DataCoinInfo {
  coinId: string
  name: string
  symbol: string
  totalSupply: string
  decimals: number
  contractAddress: string
}

export interface DataCoinTransaction {
  hash: string
  from: string
  to: string
  amount: string
  timestamp: number
  type: 'mint' | 'transfer' | 'burn'
}

class OneMBDataCoinService {
  private provider: ethers.JsonRpcProvider
  private contractAddress: string
  private contract?: ethers.Contract

  constructor() {
    // Use Ethereum Sepolia testnet for 1MB.io
    this.provider = new ethers.JsonRpcProvider('https://ethereum-sepolia-rpc.publicnode.com')
    // Use the pre-deployed 1MB.io contract on Sepolia
    this.contractAddress = '0xC7Bc3432B0CcfeFb4237172340Cd8935f95f2990'
    
    // Always create the contract instance
    this.contract = new ethers.Contract(
      this.contractAddress,
      this.get1MBABI(),
      this.provider
    )
  }

  private get1MBABI() {
    return [
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)",
      "function mint(address to, uint256 amount)",
      "function transfer(address to, uint256 amount) returns (bool)",
      "function approve(address spender, uint256 amount) returns (bool)",
      "function allowance(address owner, address spender) view returns (uint256)",
      "event Transfer(address indexed from, address indexed to, uint256 value)",
      "event Mint(address indexed to, uint256 amount)"
    ]
  }

  /**
   * Create a new data coin on 1MB.io
   */
  async createDataCoin(
    name: string,
    symbol: string,
    initialSupply: string = "1000000"
  ): Promise<DataCoinInfo> {
    try {
      // This would typically involve calling 1MB.io API
      // For now, we'll simulate the creation
      const coinId = `medsynapse_${Date.now()}`
      
      const dataCoin: DataCoinInfo = {
        coinId,
        name: `MedSynapse ${name}`,
        symbol: symbol.toUpperCase(),
        totalSupply: initialSupply,
        decimals: 18,
        contractAddress: this.contractAddress || '0x0000000000000000000000000000000000000000'
      }

      console.log('Created 1MB.io data coin:', dataCoin)
      return dataCoin
    } catch (error) {
      console.error('Error creating data coin:', error)
      throw new Error('Failed to create data coin on 1MB.io')
    }
  }

  /**
   * Get data coin information
   */
  async getDataCoinInfo(coinId: string): Promise<DataCoinInfo> {
    if (!this.contract) {
      throw new Error('1MB.io contract not configured')
    }

    try {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
        this.contract.decimals(),
        this.contract.totalSupply()
      ])

      return {
        coinId,
        name,
        symbol,
        totalSupply: ethers.formatEther(totalSupply),
        decimals,
        contractAddress: this.contractAddress
      }
    } catch (error) {
      console.error('Error getting data coin info:', error)
      throw new Error('Failed to get data coin information')
    }
  }

  /**
   * Get user's data coin balance
   */
  async getUserBalance(userAddress: string): Promise<string> {
    if (!this.contract) {
      throw new Error('1MB.io contract not configured')
    }

    try {
      const balance = await this.contract.balanceOf(userAddress)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Error getting user balance:', error)
      throw new Error('Failed to get user balance')
    }
  }

  /**
   * Mint data coins for a contributor
   */
  async mintDataCoins(
    contributorAddress: string,
    amount: string,
    dataHash: string
  ): Promise<string> {
    if (!this.contract) {
      throw new Error('1MB.io contract not configured')
    }

    try {
      // This would require a wallet with minting permissions
      // For now, we'll simulate the minting
      console.log(`Minting ${amount} data coins to ${contributorAddress} for data: ${dataHash}`)
      
      // Simulate transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
      
      return txHash
    } catch (error) {
      console.error('Error minting data coins:', error)
      throw new Error('Failed to mint data coins')
    }
  }

  /**
   * Get data coin transactions
   */
  async getTransactions(limit: number = 10): Promise<DataCoinTransaction[]> {
    if (!this.contract) {
      throw new Error('1MB.io contract not configured')
    }

    try {
      // Get Transfer events
      const filter = this.contract.filters.Transfer()
      const events = await this.contract.queryFilter(filter, -limit)
      
      return events.map(event => {
        const args = (event as any).args || {}
        return {
          hash: event.transactionHash,
          from: args.from || '',
          to: args.to || '',
          amount: ethers.formatEther(args.value || 0),
          timestamp: Date.now(),
          type: 'transfer' as const
        }
      })
    } catch (error) {
      console.error('Error getting transactions:', error)
      return []
    }
  }

  /**
   * Check if 1MB.io integration is configured
   */
  isConfigured(): boolean {
    return !!this.contractAddress && !!this.contract
  }

  /**
   * Get 1MB.io platform statistics
   */
  async getPlatformStats(): Promise<{
    totalDataCoins: number
    totalTransactions: number
    activeUsers: number
    totalVolume: string
  }> {
    try {
      // This would call 1MB.io API for real stats
      return {
        totalDataCoins: 1,
        totalTransactions: 0,
        activeUsers: 1,
        totalVolume: "0"
      }
    } catch (error) {
      console.error('Error getting platform stats:', error)
      return {
        totalDataCoins: 0,
        totalTransactions: 0,
        activeUsers: 0,
        totalVolume: "0"
      }
    }
  }
}

// Export singleton instance
export const oneMBDataCoinService = new OneMBDataCoinService()
export default oneMBDataCoinService
