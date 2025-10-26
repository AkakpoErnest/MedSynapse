import { getPublicClient, getWalletClient, type Address } from '@wagmi/core'
import { config } from '../wagmi'

const MEDSYNAPSE_CONTRACT_ADDRESS = import.meta.env.VITE_MEDSYNAPSE_CONTRACT || '0xeaDEaAFE440283aEaC909CD58ec367735BfE712f'

const MEDSYNAPSE_ABI = [
  {
    inputs: [
      { internalType: 'string', name: '_dataHash', type: 'string' },
      { internalType: 'string', name: '_dataType', type: 'string' },
      { internalType: 'string', name: '_description', type: 'string' }
    ],
    name: 'createConsent',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalConsents',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'contributor', type: 'address' }],
    name: 'getContributorConsents',
    outputs: [{ internalType: 'bytes32[]', name: '', type: 'bytes32[]' }],
    stateMutability: 'view',
    type: 'function'
  }
]

export interface CreateConsentResult {
  success: boolean
  txHash?: string
  consentId?: string
  error?: string
}

class MedSynapseContractService {
  /**
   * Create a consent record on the blockchain using the user's wallet
   */
  async createConsent(
    dataHash: string,
    dataType: string,
    description: string
  ): Promise<CreateConsentResult> {
    try {
      const walletClient = await getWalletClient({ config })
      
      if (!walletClient) {
        throw new Error('Wallet not connected')
      }

      // Create the consent transaction
      const hash = await walletClient.writeContract({
        address: MEDSYNAPSE_CONTRACT_ADDRESS as Address,
        abi: MEDSYNAPSE_ABI,
        functionName: 'createConsent',
        args: [dataHash, dataType, description],
      })

      // Wait for the transaction to be mined
      const publicClient = getPublicClient({ config })
      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      if (receipt.status === 'reverted') {
        throw new Error('Transaction was reverted')
      }

      // Extract consentId from event logs
      const consentCreatedEvent = receipt.logs.find((log) => {
        // Look for ConsentCreated event
        try {
          return log.topics[0] === '0x...' // You'll need to hash the event signature
        } catch {
          return false
        }
      })

      console.log('Consent created successfully:', hash)

      return {
        success: true,
        txHash: hash,
        consentId: '', // Will be calculated by the contract
      }
    } catch (error) {
      console.error('Error creating consent:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Get the total number of consents
   */
  async getTotalConsents(): Promise<bigint | null> {
    try {
      const publicClient = getPublicClient({ config })
      if (!publicClient) return null

      const result = await publicClient.readContract({
        address: MEDSYNAPSE_CONTRACT_ADDRESS as Address,
        abi: MEDSYNAPSE_ABI,
        functionName: 'totalConsents',
      })

      return result as bigint
    } catch (error) {
      console.error('Error reading total consents:', error)
      return null
    }
  }

  /**
   * Get all consent IDs for a contributor
   */
  async getContributorConsents(contributorAddress: Address): Promise<string[]> {
    try {
      const publicClient = getPublicClient({ config })
      if (!publicClient) return []

      const result = await publicClient.readContract({
        address: MEDSYNAPSE_CONTRACT_ADDRESS as Address,
        abi: MEDSYNAPSE_ABI,
        functionName: 'getContributorConsents',
        args: [contributorAddress],
      })

      return result as string[]
    } catch (error) {
      console.error('Error reading contributor consents:', error)
      return []
    }
  }
}

const medSynapseContractService = new MedSynapseContractService()
export default medSynapseContractService

