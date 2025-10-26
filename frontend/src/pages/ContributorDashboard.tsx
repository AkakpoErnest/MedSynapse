import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileText, Shield, Eye, MoreVertical, Trash2, Eye as ViewIcon, Wifi, WifiOff, Coins, TrendingUp, Users, Award } from 'lucide-react'
import { useContributorConsents, useEnvioConnection } from '../hooks/useEnvio'
import { formatDate, getDataTypeIcon, getStatusColor } from '../utils/helpers'
import ConsentDetails from '../components/ConsentDetails'
import dataCoinService from '../services/dataCoinService'

const ContributorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showActions, setShowActions] = useState<string | null>(null)
  const [selectedConsent, setSelectedConsent] = useState<any>(null)
  const [dataCoinStats, setDataCoinStats] = useState<any>(null)
  const [contributorBalance, setContributorBalance] = useState('0')
  const [dataCoinLoading, setDataCoinLoading] = useState(true)
  const { consents, loading, error, refetch: refetchConsents } = useContributorConsents()
  const { isConnected: envioConnected, isChecking } = useEnvioConnection()

  // Load data coin information
  useEffect(() => {
    const loadDataCoinData = async () => {
      if (!dataCoinService.isConfigured()) {
        console.log('Data coin service not configured')
        setDataCoinLoading(false)
        return
      }

      try {
        setDataCoinLoading(true)
        
        // Get stats first
        const stats = await dataCoinService.getDataCoinStats()
        setDataCoinStats(stats)
        
        // Get balance - use a default address if no consents yet
        const contributorAddress = consents[0]?.contributor || '0x0000000000000000000000000000000000000000'
        const balance = await dataCoinService.getContributorBalance(contributorAddress)
        setContributorBalance(balance)
        
        console.log('Data coin data loaded:', { stats, balance })
      } catch (error) {
        console.error('Error loading data coin data:', error)
        // Set fallback values
        setContributorBalance('0')
        setDataCoinStats({
          totalContributions: 0,
          totalRewardsDistributed: '0',
          activeContributors: 0,
          dataCoinAddress: 'Not Available'
        })
      } finally {
        setDataCoinLoading(false)
      }
    }

    // Only load data once on mount, not on every consents change
    loadDataCoinData()
  }, []) // Remove consents dependency to prevent infinite loop

  const handleRefreshDataCoin = async () => {
    try {
      setDataCoinLoading(true)
      const [stats, balance] = await Promise.all([
        dataCoinService.getDataCoinStats(),
        dataCoinService.getContributorBalance(consents[0]?.contributor || '')
      ])
      
      setDataCoinStats(stats)
      setContributorBalance(balance)
    } catch (error) {
      console.error('Error refreshing data coin data:', error)
    } finally {
      setDataCoinLoading(false)
    }
  }

  const handleRevokeConsent = (consentId: string) => {
    // In a real app, this would call the smart contract
    console.log('Revoking consent:', consentId)
    setShowActions(null)
  }

  const handleViewDetails = (consentId: string) => {
    const consent = consents.find(c => c.id === consentId)
    setSelectedConsent(consent)
    setShowActions(null)
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Contributor Dashboard</h1>
          <div className="flex items-center mt-2">
            {isChecking ? (
              <div className="flex items-center text-gray-400">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm">Checking Envio connection...</span>
              </div>
            ) : envioConnected ? (
              <div className="flex items-center text-green-400">
                <Wifi className="w-4 h-4 mr-2" />
                <span className="text-sm">Envio HyperSync Connected</span>
              </div>
            ) : (
              <div className="flex items-center text-red-400">
                <WifiOff className="w-4 h-4 mr-2" />
                <span className="text-sm">Envio HyperSync Disconnected</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            to="/upload"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center border border-blue-400/30 text-sm sm:text-base"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Data
          </Link>
          <button
            onClick={refetchConsents}
            disabled={loading}
            className="bg-transparent border border-blue-500 text-blue-400 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-500/10 transition-all duration-300 flex items-center text-sm sm:text-base"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <TrendingUp className="w-4 h-4 mr-2" />
            )}
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 p-4 sm:p-6 rounded-lg hover:border-blue-400/40 transition-all duration-300">
          <div className="flex items-center">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-400">Total Datasets</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{consents.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 p-4 sm:p-6 rounded-lg hover:border-blue-400/40 transition-all duration-300">
          <div className="flex items-center">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-400">Active Consents</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{consents.filter(c => c.isActive).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 p-4 sm:p-6 rounded-lg hover:border-blue-400/40 transition-all duration-300">
          <div className="flex items-center">
            <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-400">Total Access</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{consents.reduce((sum, c) => sum + (c.accessCount || 0), 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 p-4 sm:p-6 rounded-lg hover:border-blue-400/40 transition-all duration-300">
          <div className="flex items-center">
            <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-gray-400">Consent Balance</p>
              <div className="text-xl sm:text-2xl font-bold text-white">
                {dataCoinLoading ? (
                  <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  contributorBalance
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg hover:border-blue-400/40 transition-all duration-300">
        <div className="px-6 py-4 border-b border-blue-500/20">
          <h2 className="text-lg font-semibold text-white">Your Data</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-500/20">
            <thead className="bg-black/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Access Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-black/20 divide-y divide-blue-500/20">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                      Loading your data from blockchain...
                    </div>
                  </td>
                </tr>
              ) : consents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No data uploaded yet. <Link to="/upload" className="text-blue-400 hover:text-blue-300">Upload your first dataset</Link>
                  </td>
                </tr>
              ) : (
                consents.map((item) => (
                  <tr key={item.id} className="hover:bg-black/30 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getDataTypeIcon(item.dataType || 'unknown')}</span>
                        <div>
                          <div className="text-sm font-medium text-white capitalize">
                            {(item.dataType || 'unknown').replace(/_/g, ' ')}
                          </div>
                          <div className="text-sm text-gray-400">{item.description || 'No description'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatDate(item.timestamp?.toString() || Date.now().toString())}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.isActive 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {item.accessCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === item.id ? null : item.id)}
                          className="text-gray-400 hover:text-white transition-colors duration-200"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {showActions === item.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-sm rounded-md shadow-lg z-10 border border-blue-500/30">
                            <div className="py-1">
                              <button
                                onClick={() => handleViewDetails(item.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-blue-500/20 hover:text-white transition-colors duration-200"
                              >
                                <ViewIcon className="w-4 h-4 mr-3" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleRevokeConsent(item.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4 mr-3" />
                                Revoke Consent
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MedSynapse Coin Section - Contributors Only */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-blue-500/30 rounded-lg hover:border-blue-400/50 transition-all duration-300">
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-blue-500/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white flex items-center">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mr-2 sm:mr-3" />
                MedSynapse Coin
              </h2>
              <p className="text-sm text-gray-400 mt-1">Your contribution rewards and platform status</p>
            </div>
            <button
              onClick={handleRefreshDataCoin}
              disabled={dataCoinLoading}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center px-3 py-2 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              {dataCoinLoading ? (
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-1"></div>
              ) : (
                <TrendingUp className="w-4 h-4 mr-1" />
              )}
              Refresh
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          {/* Balance Display */}
          <div className="bg-black/40 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Your Balance</h3>
              {dataCoinLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-gray-400">Loading...</span>
                </div>
              ) : (
                <div>
                  <p className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-1">{contributorBalance}</p>
                  <p className="text-sm text-gray-400">Consent Records</p>
                </div>
              )}
            </div>
          </div>

          {/* Platform Stats */}
          {dataCoinStats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center bg-black/30 rounded-lg p-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <p className="text-xs sm:text-sm text-gray-400">Total Consents</p>
                <p className="text-lg sm:text-xl font-bold text-white">{dataCoinStats.totalContributions}</p>
              </div>
              <div className="text-center bg-black/30 rounded-lg p-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                </div>
                <p className="text-xs sm:text-sm text-gray-400">Active Contributors</p>
                <p className="text-lg sm:text-xl font-bold text-white">{dataCoinStats.activeContributors}</p>
              </div>
              <div className="text-center bg-black/30 rounded-lg p-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <p className="text-xs sm:text-sm text-gray-400">Contract</p>
                <p className="text-xs text-gray-400 font-mono break-all">
                  {dataCoinStats.dataCoinAddress.slice(0, 6)}...{dataCoinStats.dataCoinAddress.slice(-4)}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-sm sm:text-base">
              View Transaction History
            </button>
            <button className="flex-1 bg-transparent border border-blue-500 text-blue-400 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-500/10 transition-all duration-300 text-sm sm:text-base">
              Learn About Rewards
            </button>
          </div>
        </div>
      </div>
      
      {/* Consent Details Modal */}
      {selectedConsent && (
        <ConsentDetails
          consent={selectedConsent}
          onClose={() => setSelectedConsent(null)}
        />
      )}
    </div>
  )
}

export default ContributorDashboard
