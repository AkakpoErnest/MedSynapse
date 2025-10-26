import React, { useState } from 'react'
import { Brain, TrendingUp, Shield, Lightbulb, AlertTriangle, CheckCircle, BarChart3, Users, Clock, Target } from 'lucide-react'
import { useAIInsights, usePredictiveAnalytics, useDataPatternAnalysis, useSecurityInsights, useEnvioAIStatus } from '../hooks/useEnvioAI'

const AIInsightsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('insights')
  const { insights, loading: insightsLoading } = useAIInsights()
  const { analytics, loading: analyticsLoading } = usePredictiveAnalytics()
  const { patterns, loading: patternsLoading } = useDataPatternAnalysis()
  const { security, loading: securityLoading } = useSecurityInsights()
  const { isConnected: aiConnected, isChecking } = useEnvioAIStatus()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30'
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend': return <TrendingUp className="w-5 h-5" />
      case 'anomaly': return <AlertTriangle className="w-5 h-5" />
      case 'recommendation': return <Lightbulb className="w-5 h-5" />
      case 'security': return <Shield className="w-5 h-5" />
      default: return <Brain className="w-5 h-5" />
    }
  }

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-500/20'
      case 'medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'high': return 'text-orange-400 bg-orange-500/20'
      case 'critical': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
            <Brain className="w-8 h-8 mr-3 text-emerald-400" />
            Envio AI Dashboard
          </h1>
          <div className="flex items-center mt-2">
            {isChecking ? (
              <div className="flex items-center text-gray-400">
                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm">Checking AI connection...</span>
              </div>
            ) : aiConnected ? (
              <div className="flex items-center text-emerald-400">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">Envio AI Connected</span>
              </div>
            ) : (
              <div className="flex items-center text-red-400">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span className="text-sm">Envio AI Disconnected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'insights', label: 'AI Insights', icon: Brain },
          { id: 'analytics', label: 'Predictive Analytics', icon: BarChart3 },
          { id: 'patterns', label: 'Data Patterns', icon: TrendingUp },
          { id: 'security', label: 'Security', icon: Shield }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800/50 text-slate-300 hover:text-emerald-400 hover:bg-slate-800/70'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* AI Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insightsLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded mb-3"></div>
                  <div className="h-3 bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                </div>
              ))
            ) : (
              insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`bg-slate-800/50 border rounded-lg p-6 hover:border-emerald-400/40 transition-all duration-300 ${getPriorityColor(insight.priority)}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getTypeIcon(insight.type)}
                      <span className="ml-2 text-sm font-medium capitalize">{insight.type}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                      {insight.priority}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{insight.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">{insight.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(insight.timestamp).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-emerald-400">
                      <Target className="w-4 h-4 mr-1" />
                      {Math.round(insight.confidence * 100)}%
                    </div>
                  </div>
                  
                  {insight.actionable && (
                    <div className="mt-4 pt-4 border-t border-emerald-500/20">
                      <button className="w-full bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                        Take Action
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Predictive Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {analyticsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded mb-4"></div>
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : analytics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Data Demand Forecast */}
              <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
                  Data Demand Forecast
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Next 30 days:</span>
                    <span className="text-lg font-semibold text-white">{analytics.dataDemandForecast.next30Days}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Next 90 days:</span>
                    <span className="text-lg font-semibold text-white">{analytics.dataDemandForecast.next90Days}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Trend:</span>
                    <span className={`text-sm font-medium capitalize ${
                      analytics.dataDemandForecast.trend === 'increasing' ? 'text-green-400' : 
                      analytics.dataDemandForecast.trend === 'decreasing' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {analytics.dataDemandForecast.trend}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contributor Growth */}
              <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-emerald-400" />
                  Contributor Growth
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Expected new:</span>
                    <span className="text-lg font-semibold text-white">{analytics.contributorGrowth.expectedNewContributors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Retention rate:</span>
                    <span className="text-lg font-semibold text-white">{Math.round(analytics.contributorGrowth.retentionRate * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* Research Opportunities */}
              <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-emerald-400" />
                  Research Opportunities
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-400 block mb-2">High demand data types:</span>
                    <div className="flex flex-wrap gap-1">
                      {analytics.researchOpportunities.highDemandDataTypes.map((type, i) => (
                        <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">
                          {type.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data Patterns Tab */}
      {activeTab === 'patterns' && (
        <div className="space-y-6">
          {patternsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded mb-4"></div>
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : patterns && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Trends */}
              <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Upload Trends</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-400 block mb-2">Daily uploads (last 7 days):</span>
                    <div className="flex space-x-1">
                      {patterns.uploadTrends.dailyUploads.map((count: number, i: number) => (
                        <div key={i} className="flex-1 bg-emerald-500/20 rounded text-center text-xs py-1 text-emerald-400">
                          {count}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block mb-2">Data type distribution:</span>
                    {Object.entries(patterns.uploadTrends.dataTypeDistribution).map(([type, percentage]) => (
                      <div key={type} className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{type.replace('_', ' ')}</span>
                        <span className="text-emerald-400">{String(percentage)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Access Patterns */}
              <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Access Patterns</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-400 block mb-2">Most accessed data types:</span>
                    {patterns.accessPatterns.mostAccessedDataTypes.map((type: string, i: number) => (
                      <div key={i} className="flex items-center text-sm mb-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                        <span className="text-gray-300">{type.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <span className="text-sm text-gray-400 block mb-2">Peak access times:</span>
                    <div className="text-sm text-gray-300">
                      {patterns.accessPatterns.researcherBehavior.peakAccessHours}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {securityLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded mb-4"></div>
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : security && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Threat Level */}
              <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                  Security Status
                </h3>
                <div className="space-y-4">
                  <div className={`px-3 py-2 rounded-lg text-center font-medium ${getThreatLevelColor(security.threatLevel)}`}>
                    Threat Level: {security.threatLevel.toUpperCase()}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Suspicious activities:</span>
                      <span className="text-white">{security.suspiciousActivities.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">GDPR Compliant:</span>
                      <span className={security.complianceStatus.gdprCompliant ? 'text-green-400' : 'text-red-400'}>
                        {security.complianceStatus.gdprCompliant ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">HIPAA Compliant:</span>
                      <span className={security.complianceStatus.hipaaCompliant ? 'text-green-400' : 'text-red-400'}>
                        {security.complianceStatus.hipaaCompliant ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-slate-800/50 border border-emerald-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-emerald-400" />
                  Security Recommendations
                </h3>
                <div className="space-y-3">
                  {security.recommendations.map((rec: any, i: number) => (
                    <div key={i} className="p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{rec.action}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.priority === 'high' ? 'text-red-400 bg-red-500/20' :
                          rec.priority === 'medium' ? 'text-yellow-400 bg-yellow-500/20' :
                          'text-green-400 bg-green-500/20'
                        }`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AIInsightsDashboard
