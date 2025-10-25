import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, Activity, Brain, Download, Share2 } from 'lucide-react'
import envioService from '../services/envioService'

const DataAnalysis: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const data = await envioService.getAnalytics()
        setAnalytics(data)
      } catch (err) {
        setError('Failed to fetch analytics data')
        console.error('Error fetching analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-xl text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-400 mb-4">AI-Powered Health Data Analysis</h1>
          <p className="text-xl text-gray-400">Real-time insights from blockchain health data</p>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 p-6 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Consents</p>
                <p className="text-2xl font-bold text-white">{analytics?.totalConsents || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 p-6 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Consents</p>
                <p className="text-2xl font-bold text-white">{analytics?.activeConsents || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 p-6 rounded-lg">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Research Requests</p>
                <p className="text-2xl font-bold text-white">{analytics?.totalRequests || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 p-6 rounded-lg">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-orange-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Data Access</p>
                <p className="text-2xl font-bold text-white">{analytics?.totalAccess || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Types Distribution */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Data Types Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics?.dataTypes && Object.entries(analytics.dataTypes).map(([type, count]) => (
              <div key={type} className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white capitalize">{type.replace('_', ' ')}</h3>
                <p className="text-3xl font-bold text-blue-400">{count as number}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-8 text-center">
          <Brain className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Advanced AI Analysis Coming Soon</h2>
          <p className="text-gray-400 mb-6">
            We're working on implementing advanced machine learning models for:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-300">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p>Trend Analysis</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p>Correlation Detection</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <Activity className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p>Predictive Modeling</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataAnalysis