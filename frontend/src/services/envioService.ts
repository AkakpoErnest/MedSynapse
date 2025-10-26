import { GraphQLClient } from 'graphql-request'
import { ENVIO_CONFIG, MEDSYNAPSE_QUERIES, MEDSYNAPSE_SUBSCRIPTIONS } from '../config/envio'

export interface ConsentRecord {
  id: string
  consentId: string
  contributor: string
  dataHash: string
  dataType?: string
  description?: string
  timestamp?: number
  isActive?: boolean
  accessCount?: number
}

export interface ResearchRequest {
  id: string
  consentId: string
  researcher: string
  purpose: string
  timestamp?: number
  status?: string
  price?: string
  consentRecord?: {
    description?: string
    dataType?: string
  }
}

export interface DataAccessRecord {
  id: string
  consentId: string
  researcher: string
}

export interface Analytics {
  totalConsents: number
  activeConsents: number
  totalRequests: number
  pendingRequests: number
  totalAccess: number
  averagePrice: number
  dataTypes: Record<string, number>
}

class EnvioService {
  private client: GraphQLClient
  private subscriptionClient: GraphQLClient

  constructor() {
    this.client = new GraphQLClient(ENVIO_CONFIG.endpoint, {
      headers: {
        'Authorization': `Bearer ${ENVIO_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
    
    // For subscriptions, we'll use the same client but handle differently
    this.subscriptionClient = new GraphQLClient(ENVIO_CONFIG.endpoint, {
      headers: {
        'Authorization': `Bearer ${ENVIO_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
  }

  // Query Methods
  async getContributorConsents(
    contributor: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<ConsentRecord[]> {
    try {
      console.log('EnvioService: Fetching consents for contributor:', contributor)
      console.log('EnvioService: Using endpoint:', ENVIO_CONFIG.endpoint)
      
      const variables = { contributor, limit, offset }
      console.log('EnvioService: Query variables:', variables)
      
      const response = await this.client.request(MEDSYNAPSE_QUERIES.getContributorConsents, variables)
      console.log('EnvioService: Raw response:', response)
      
      const consents = response.MedSynapseConsent_ConsentCreated || []
      console.log('EnvioService: Processed consents:', consents)
      
      return consents
    } catch (error) {
      console.error('EnvioService: Error fetching contributor consents:', error)
      console.error('EnvioService: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        endpoint: ENVIO_CONFIG.endpoint,
        contributor
      })
      throw new Error(`Failed to fetch contributor consents: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async getAvailableConsents(
    limit: number = 20,
    offset: number = 0
  ): Promise<ConsentRecord[]> {
    try {
      const variables = { limit, offset }
      const response = await this.client.request(MEDSYNAPSE_QUERIES.getAvailableConsents, variables)
      return response.MedSynapseConsent_ConsentCreated || []
    } catch (error) {
      console.error('Error fetching available consents:', error)
      throw new Error('Failed to fetch available consents')
    }
  }

  async getResearchRequests(
    limit: number = 20,
    offset: number = 0
  ): Promise<ResearchRequest[]> {
    try {
      const variables = { limit, offset }
      const response = await this.client.request(MEDSYNAPSE_QUERIES.getResearchRequests, variables)
      return response.MedSynapseConsent_ResearchRequested || []
    } catch (error) {
      console.error('Error fetching research requests:', error)
      throw new Error('Failed to fetch research requests')
    }
  }

  async getDataAccessRecords(
    consentId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<DataAccessRecord[]> {
    try {
      const variables = { consentId, limit, offset }
      const response = await this.client.request(MEDSYNAPSE_QUERIES.getDataAccessRecords, variables)
      return response.MedSynapseConsent_ResearchApproved || []
    } catch (error) {
      console.error('Error fetching data access records:', error)
      throw new Error('Failed to fetch data access records')
    }
  }

  async getResearchApprovals(researcherAddress: string): Promise<any[]> {
    try {
      const variables = { researcher: researcherAddress }
      const response = await this.client.request(MEDSYNAPSE_QUERIES.getResearchApprovals, variables)
      return response.MedSynapseConsent_ResearchApproved || []
    } catch (error) {
      console.error('Error fetching research approvals:', error)
      return []
    }
  }

  async getAnalytics(): Promise<Analytics> {
    try {
      const response = await this.client.request(MEDSYNAPSE_QUERIES.getAnalytics)
      
      const consents = response.MedSynapseConsent_ConsentCreated || []
      const requests = response.MedSynapseConsent_ResearchRequested || []
      const approvals = response.MedSynapseConsent_ResearchApproved || []
      
      const analytics: Analytics = {
        totalConsents: consents.length,
        activeConsents: consents.length, // All consents are active until revoked
        totalRequests: requests.length,
        pendingRequests: requests.length, // All requests are pending until approved
        totalAccess: approvals.length,
        averagePrice: 0, // Price not tracked in current schema
        dataTypes: consents.reduce((acc: Record<string, number>, c: any) => {
          // Extract data type from dataHash or use a default
          const dataType = 'Health Data' // Default since we don't have dataType field
          acc[dataType] = (acc[dataType] || 0) + 1
          return acc
        }, {})
      }
      
      return analytics
    } catch (error) {
      console.error('Error fetching analytics:', error)
      throw new Error('Failed to fetch analytics')
    }
  }

  // Subscription Methods (using polling for now, can be upgraded to WebSocket)
  subscribeToNewConsents(
    contributor: string,
    callback: (consent: ConsentRecord) => void,
    interval: number = 5000
  ): () => void {
    let lastTimestamp = Date.now()
    
    const poll = async () => {
      try {
        const consents = await this.getContributorConsents(contributor, 1, 0)
        if (consents.length > 0) {
          const latest = consents[0]
          const consentTimestamp = new Date(latest.timestamp).getTime()
          
          if (consentTimestamp > lastTimestamp) {
            callback(latest)
            lastTimestamp = consentTimestamp
          }
        }
      } catch (error) {
        console.error('Error in consent subscription:', error)
      }
    }
    
    const intervalId = setInterval(poll, interval)
    
    // Return cleanup function
    return () => clearInterval(intervalId)
  }

  subscribeToNewRequests(
    callback: (request: ResearchRequest) => void,
    interval: number = 5000
  ): () => void {
    let lastTimestamp = Date.now()
    
    const poll = async () => {
      try {
        const requests = await this.getResearchRequests(1, 0)
        if (requests.length > 0) {
          const latest = requests[0]
          const requestTimestamp = latest.timestamp ? new Date(latest.timestamp).getTime() : Date.now()
          
          if (requestTimestamp > lastTimestamp) {
            callback(latest)
            lastTimestamp = requestTimestamp
          }
        }
      } catch (error) {
        console.error('Error in request subscription:', error)
      }
    }
    
    const intervalId = setInterval(poll, interval)
    
    // Return cleanup function
    return () => clearInterval(intervalId)
  }

  // Utility Methods
  async testConnection(): Promise<boolean> {
    try {
      await this.client.request('{ __schema { types { name } } }')
      return true
    } catch (error) {
      console.error('Envio connection test failed:', error)
      return false
    }
  }

  getNetworkInfo() {
    return ENVIO_CONFIG.networks
  }

  getContractAddresses() {
    return ENVIO_CONFIG.contracts
  }
}

// Export singleton instance
export const envioService = new EnvioService()
export default envioService
