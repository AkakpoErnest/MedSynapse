import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import envioAIService, { AIInsight, PredictiveAnalytics, SmartRecommendation } from '../services/envioAIService'

// Hook for AI insights
export const useAIInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await envioAIService.getAIInsights()
      setInsights(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AI insights')
      console.error('Error fetching AI insights:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInsights()
    
    // Refresh insights every 5 minutes
    const interval = setInterval(fetchInsights, 300000)
    
    return () => clearInterval(interval)
  }, [fetchInsights])

  return { insights, loading, error, refetch: fetchInsights }
}

// Hook for predictive analytics
export const usePredictiveAnalytics = () => {
  const [analytics, setAnalytics] = useState<PredictiveAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await envioAIService.getPredictiveAnalytics()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch predictive analytics')
      console.error('Error fetching predictive analytics:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
    
    // Refresh analytics every 10 minutes
    const interval = setInterval(fetchAnalytics, 600000)
    
    return () => clearInterval(interval)
  }, [fetchAnalytics])

  return { analytics, loading, error, refetch: fetchAnalytics }
}

// Hook for smart recommendations
export const useSmartRecommendations = () => {
  const { address, isConnected } = useAccount()
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = useCallback(async (userRole: 'contributor' | 'researcher') => {
    if (!isConnected || !address) {
      setRecommendations([])
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const data = await envioAIService.getSmartRecommendations(address, userRole)
      setRecommendations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations')
      console.error('Error fetching recommendations:', err)
    } finally {
      setLoading(false)
    }
  }, [address, isConnected])

  return { recommendations, loading, error, fetchRecommendations }
}

// Hook for data pattern analysis
export const useDataPatternAnalysis = () => {
  const [patterns, setPatterns] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzePatterns = useCallback(async (timeRange: string = '30d') => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await envioAIService.analyzeDataPatterns(timeRange)
      setPatterns(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze data patterns')
      console.error('Error analyzing data patterns:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    analyzePatterns()
    
    // Refresh patterns every 15 minutes
    const interval = setInterval(() => analyzePatterns(), 900000)
    
    return () => clearInterval(interval)
  }, [analyzePatterns])

  return { patterns, loading, error, refetch: analyzePatterns }
}

// Hook for security insights
export const useSecurityInsights = () => {
  const [security, setSecurity] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSecurityInsights = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await envioAIService.getSecurityInsights()
      setSecurity(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch security insights')
      console.error('Error fetching security insights:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSecurityInsights()
    
    // Refresh security insights every 2 minutes
    const interval = setInterval(fetchSecurityInsights, 120000)
    
    return () => clearInterval(interval)
  }, [fetchSecurityInsights])

  return { security, loading, error, refetch: fetchSecurityInsights }
}

// Hook for AI connection status
export const useEnvioAIStatus = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true)
      try {
        // Try to fetch AI insights to test connection
        await envioAIService.getAIInsights(1)
        setIsConnected(true)
      } catch (error) {
        console.error('Envio AI connection check failed:', error)
        setIsConnected(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkConnection()
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return { isConnected, isChecking }
}
