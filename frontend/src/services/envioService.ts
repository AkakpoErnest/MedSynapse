import { GraphQLClient } from 'graphql-request'
import { ENVIO_CONFIG, MEDSYNAPSE_QUERIES, MEDSYNAPSE_SUBSCRIPTIONS } from './envio'

export interface ConsentRecord {
  id: string
  contributor: string
  dataType: string
  description: string
  timestamp: string
  isActive: boolean
  accessCount: number
  authorizedResearchers: Array<{
    researcher: string
    approvedAt: string
  }>
}

export interface ResearchRequest {
  id: string
  datasetId: string
  researcher: string
  purpose: string
  timestamp: string
  status: string
  price: string
  consentRecord?: {
    id: string
    dataType: string
    description: string
  }
}

export interface DataAccessRecord {
  id: string
  consentId: string
  researcher: string
  timestamp: string
  dataHash: string
  purpose: string
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
    first: number = 20,
    skip: number = 0
  ): Promise<ConsentRecord[]> {
    try {
      const variables = { contributor, first, skip }
      const response = await this.client.request(MEDSYNAPSE_QUERIES.getContributorConsents, variables)
      return response.consentRecords || []
    } catch (error) {
      console.error('Error fetching contributor consents:', error)
      throw new Error('Failed to fetch contributor consents')
    }
  }

  async getResearchRequests(
    first: number = 20,
    skip: number = 0
  ): Promise<ResearchRequest[]> {
    try {
      const variables = { first, skip }
      const response = await this.client.request(MEDSYNAPSE_QUERIES.getResearchRequests, variables)
      return response.researchRequests || []
    } catch (error) {
      console.error('Error fetching research requests:', error)
      throw new Error('Failed to fetch research requests')
    }
  }

  async getDataAccessRecords(
    consentId: string,
    first: number = 20,
    skip: number = 0
  ): Promise<DataAccessRecord[]> {
    try {
      const variables = { consentId, first, skip }
      const response = await this.client.request(MEDSYNAPSE_QUERIES.getDataAccessRecords, variables)
      return response.dataAccessRecords || []
    } catch (error) {
      console.error('Error fetching data access records:', error)
      throw new Error('Failed to fetch data access records')
    }
  }

  async getAnalytics(): Promise<Analytics> {
    try {
      const response = await this.client.request(MEDSYNAPSE_QUERIES.getAnalytics)
      
      const consents = response.consentRecords || []
      const requests = response.researchRequests || []
      
      const analytics: Analytics = {
        totalConsents: consents.length,
        activeConsents: consents.filter((c: any) => c.isActive).length,
        totalRequests: requests.length,
        pendingRequests: requests.filter((r: any) => r.status === 'pending').length,
        totalAccess: consents.reduce((sum: number, c: any) => sum + (c.accessCount || 0), 0),
        averagePrice: requests.length > 0 
          ? requests.reduce((sum: number, r: any) => sum + parseFloat(r.price || '0'), 0) / requests.length 
          : 0,
        dataTypes: consents.reduce((acc: Record<string, number>, c: any) => {
          acc[c.dataType] = (acc[c.dataType] || 0) + 1
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
          const requestTimestamp = new Date(latest.timestamp).getTime()
          
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
