import { GraphQLClient } from 'graphql-request'
import { ENVIO_CONFIG } from '../config/envio'

export interface AIInsight {
  id: string
  type: 'trend' | 'anomaly' | 'recommendation' | 'security'
  title: string
  description: string
  confidence: number
  timestamp: number
  actionable: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
}

export interface PredictiveAnalytics {
  dataDemandForecast: {
    next30Days: number
    next90Days: number
    trend: 'increasing' | 'decreasing' | 'stable'
  }
  contributorGrowth: {
    expectedNewContributors: number
    retentionRate: number
  }
  researchOpportunities: {
    highDemandDataTypes: string[]
    underservedAreas: string[]
  }
}

export interface SmartRecommendation {
  id: string
  type: 'dataset' | 'researcher' | 'contributor' | 'pricing'
  title: string
  description: string
  confidence: number
  actionUrl?: string
  metadata: any
}

class EnvioAIService {
  private client: GraphQLClient

  constructor() {
    this.client = new GraphQLClient(ENVIO_CONFIG.endpoint, {
      headers: {
        'Authorization': `Bearer ${ENVIO_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
        'X-Envio-AI': 'true' // Enable AI features
      },
    })
  }

  /**
   * Get AI-powered insights for the platform
   */
  async getAIInsights(limit: number = 10): Promise<AIInsight[]> {
    try {
      const query = `
        query GetAIInsights($limit: Int) {
          envioAI_insights(
            limit: $limit
            order_by: { timestamp: desc }
          ) {
            id
            type
            title
            description
            confidence
            timestamp
            actionable
            priority
          }
        }
      `

      const response = await this.client.request(query, { limit })
      return response.envioAI_insights || []
    } catch (error) {
      console.error('Error fetching AI insights:', error)
      // Return mock data for development
      return this.getMockInsights()
    }
  }

  /**
   * Get predictive analytics for the platform
   */
  async getPredictiveAnalytics(): Promise<PredictiveAnalytics> {
    try {
      const query = `
        query GetPredictiveAnalytics {
          envioAI_predictiveAnalytics {
            dataDemandForecast {
              next30Days
              next90Days
              trend
            }
            contributorGrowth {
              expectedNewContributors
              retentionRate
            }
            researchOpportunities {
              highDemandDataTypes
              underservedAreas
            }
          }
        }
      `

      const response = await this.client.request(query)
      return response.envioAI_predictiveAnalytics
    } catch (error) {
      console.error('Error fetching predictive analytics:', error)
      // Return mock data for development
      return this.getMockPredictiveAnalytics()
    }
  }

  /**
   * Get smart recommendations for a user
   */
  async getSmartRecommendations(userAddress: string, userRole: 'contributor' | 'researcher'): Promise<SmartRecommendation[]> {
    try {
      const query = `
        query GetSmartRecommendations($userAddress: String!, $userRole: String!) {
          envioAI_recommendations(
            where: { 
              userAddress: { _eq: $userAddress }
              userRole: { _eq: $userRole }
            }
            limit: 5
          ) {
            id
            type
            title
            description
            confidence
            actionUrl
            metadata
          }
        }
      `

      const response = await this.client.request(query, { userAddress, userRole })
      return response.envioAI_recommendations || []
    } catch (error) {
      console.error('Error fetching smart recommendations:', error)
      // Return mock data for development
      return this.getMockRecommendations(userRole)
    }
  }

  /**
   * Analyze data patterns and trends
   */
  async analyzeDataPatterns(timeRange: string = '30d'): Promise<any> {
    try {
      const query = `
        query AnalyzeDataPatterns($timeRange: String!) {
          envioAI_dataPatterns(timeRange: $timeRange) {
            uploadTrends {
              dailyUploads
              dataTypeDistribution
              contributorActivity
            }
            accessPatterns {
              mostAccessedDataTypes
              researcherBehavior
              peakAccessTimes
            }
            anomalies {
              suspiciousActivity
              unusualPatterns
              potentialIssues
            }
          }
        }
      `

      const response = await this.client.request(query, { timeRange })
      return response.envioAI_dataPatterns
    } catch (error) {
      console.error('Error analyzing data patterns:', error)
      return this.getMockDataPatterns()
    }
  }

  /**
   * Get security insights and threat detection
   */
  async getSecurityInsights(): Promise<any> {
    try {
      const query = `
        query GetSecurityInsights {
          envioAI_securityInsights {
            threatLevel
            suspiciousActivities {
              type
              description
              severity
              timestamp
            }
            complianceStatus {
              gdprCompliant
              hipaaCompliant
              issues
            }
            recommendations {
              action
              priority
              description
            }
          }
        }
      `

      const response = await this.client.request(query)
      return response.envioAI_securityInsights
    } catch (error) {
      console.error('Error fetching security insights:', error)
      return this.getMockSecurityInsights()
    }
  }

  // Mock data for development (when Envio AI isn't available)
  private getMockInsights(): AIInsight[] {
    return [
      {
        id: '1',
        type: 'trend',
        title: 'Increased Demand for Genetic Data',
        description: 'Genetic data uploads have increased by 45% in the last week. Consider promoting this data type to contributors.',
        confidence: 0.87,
        timestamp: Date.now(),
        actionable: true,
        priority: 'medium'
      },
      {
        id: '2',
        type: 'recommendation',
        title: 'Optimize Data Pricing',
        description: 'Current pricing model may be limiting researcher access. Consider dynamic pricing based on data rarity.',
        confidence: 0.92,
        timestamp: Date.now() - 3600000,
        actionable: true,
        priority: 'high'
      },
      {
        id: '3',
        type: 'security',
        title: 'Unusual Access Pattern Detected',
        description: 'Detected unusual access patterns from researcher 0x123... Consider reviewing access permissions.',
        confidence: 0.78,
        timestamp: Date.now() - 7200000,
        actionable: true,
        priority: 'critical'
      }
    ]
  }

  private getMockPredictiveAnalytics(): PredictiveAnalytics {
    return {
      dataDemandForecast: {
        next30Days: 150,
        next90Days: 450,
        trend: 'increasing'
      },
      contributorGrowth: {
        expectedNewContributors: 25,
        retentionRate: 0.78
      },
      researchOpportunities: {
        highDemandDataTypes: ['genetic_data', 'wearable_data', 'imaging_data'],
        underservedAreas: ['mental_health', 'pediatric_data', 'rare_diseases']
      }
    }
  }

  private getMockRecommendations(userRole: string): SmartRecommendation[] {
    if (userRole === 'contributor') {
      return [
        {
          id: '1',
          type: 'dataset',
          title: 'Upload Genetic Data',
          description: 'Genetic data is in high demand. You could earn 2x more tokens by uploading genetic test results.',
          confidence: 0.85,
          actionUrl: '/upload?type=genetic_data',
          metadata: { dataType: 'genetic_data', multiplier: 2 }
        },
        {
          id: '2',
          type: 'pricing',
          title: 'Optimize Your Pricing',
          description: 'Consider lowering your data access price by 20% to increase researcher interest.',
          confidence: 0.72,
          metadata: { suggestedDiscount: 0.2 }
        }
      ]
    } else {
      return [
        {
          id: '1',
          type: 'dataset',
          title: 'Access Wearable Data',
          description: 'Wearable device data is trending and could provide valuable insights for your research.',
          confidence: 0.88,
          actionUrl: '/researcher',
          metadata: { dataType: 'wearable_data', trend: 'increasing' }
        },
        {
          id: '2',
          type: 'researcher',
          title: 'Collaborate with Dr. Smith',
          description: 'Dr. Smith has similar research interests and complementary datasets.',
          confidence: 0.76,
          metadata: { researcherId: '0x456...', similarity: 0.89 }
        }
      ]
    }
  }

  private getMockDataPatterns(): any {
    return {
      uploadTrends: {
        dailyUploads: [12, 15, 18, 22, 19, 25, 28],
        dataTypeDistribution: {
          'lab_results': 35,
          'wearable_data': 28,
          'imaging_data': 20,
          'genetic_data': 12,
          'survey_data': 5
        },
        contributorActivity: {
          activeContributors: 45,
          newContributors: 8,
          retentionRate: 0.78
        }
      },
      accessPatterns: {
        mostAccessedDataTypes: ['wearable_data', 'lab_results', 'imaging_data'],
        researcherBehavior: {
          averageAccessTime: '2.5 hours',
          peakAccessHours: '9-11 AM, 2-4 PM',
          mostActiveResearchers: 12
        },
        peakAccessTimes: {
          monday: 45,
          tuesday: 52,
          wednesday: 48,
          thursday: 55,
          friday: 38,
          weekend: 15
        }
      },
      anomalies: {
        suspiciousActivity: 2,
        unusualPatterns: 1,
        potentialIssues: ['High access rate from single IP', 'Unusual data download pattern']
      }
    }
  }

  private getMockSecurityInsights(): any {
    return {
      threatLevel: 'low',
      suspiciousActivities: [
        {
          type: 'unusual_access',
          description: 'Multiple rapid access attempts from single researcher',
          severity: 'medium',
          timestamp: Date.now() - 1800000
        }
      ],
      complianceStatus: {
        gdprCompliant: true,
        hipaaCompliant: true,
        issues: []
      },
      recommendations: [
        {
          action: 'Review access logs',
          priority: 'medium',
          description: 'Review access logs for the past 24 hours to identify any suspicious patterns.'
        }
      ]
    }
  }
}

// Export singleton instance
export const envioAIService = new EnvioAIService()
export default envioAIService
