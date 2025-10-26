import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileText, Shield, Eye, MoreVertical, Trash2, Eye as ViewIcon, Wifi, WifiOff, Coins, TrendingUp, Users, Award, CheckCircle, XCircle, User } from 'lucide-react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { useContributorConsents, useEnvioConnection, useContributorResearchRequests } from '../hooks/useEnvio'
import { formatDate, getDataTypeIcon, getStatusColor } from '../utils/helpers'
// ConsentDetails component removed, using inline modal instead
import dataCoinService from '../services/dataCoinService'

const ContributorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showActions, setShowActions] = useState<string | null>(null)
  const [selectedConsent, setSelectedConsent] = useState<any>(null)
  const [dataCoinStats, setDataCoinStats] = useState<any>(null)
  const [contributorBalance, setContributorBalance] = useState('0')
  const [dataCoinLoading, setDataCoinLoading] = useState(true)
  const [approvalSuccess, setApprovalSuccess] = useState<string | null>(null)
  const { address, isConnected } = useAccount()
  const { data: publicClient } = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const { consents, loading, error, refetch: refetchConsents } = useContributorConsents()
  const { isConnected: envioConnected, isChecking } = useEnvioConnection()
  const { requests: researchRequests, loading: requestsLoading, approvedRequests } = useContributorResearchRequests(address || '')

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
        
        // Get balance - use current connected address
        const contributorAddress = address || '0x0000000000000000000000000000000000000000'
        
        // For fallback, just use the consent count from Envio
        // The contract-based balance is not necessary for the consent balance display
        const consentCount = consents.length.toString()
        setContributorBalance(consentCount)
        
        console.log('Contributor balance updated:', consentCount, 'for address:', contributorAddress)
        
        console.log('Data coin data loaded:', { stats, balance: consentCount })
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

    // Load data when consents change or on mount
    loadDataCoinData()
  }, [consents.length, address]) // Refresh when consents change or address changes

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
    const consent = consents.find(c => c.consentId === consentId)
    setSelectedConsent(consent)
    setShowActions(null)
  }

  const handleApproveRequest = async (consentId: string, requestIndex: number) => {
    if (!isConnected || !address || !walletClient) {
      alert('Please connect your wallet first')
      return
    }

    try {
      const MEDSYNAPSE_CONTRACT = '0x05133bC59e34413F683Cc336A26f215b3261a51F' // Sepolia
      const MEDSYNAPSE_ABI = [
        {
          inputs: [
            { internalType: 'bytes32', name: '_consentId', type: 'bytes32' },
            { internalType: 'uint256', name: '_requestIndex', type: 'uint256' }
          ],
          name: 'approveResearchRequest',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ] as const

      // Convert string consentId to bytes32
      const consentIdBytes = consentId as `0x${string}`
      
      console.log('Approving research request for consent:', consentId, 'index:', requestIndex)
      
      // Try to approve with reasonable gas
      const hash = await walletClient.writeContract({
        address: MEDSYNAPSE_CONTRACT as `0x${string}`,
        abi: MEDSYNAPSE_ABI,
        functionName: 'approveResearchRequest',
        args: [consentIdBytes, BigInt(requestIndex)],
        gas: 300000n // Reduced gas limit
      })
      
      console.log('Approval transaction submitted:', hash)
      
      // Wait for transaction
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        console.log('Approval confirmed:', receipt)
        setApprovalSuccess('Congratulations! You have successfully approved the research request. The researcher can now access this data.')
        setTimeout(() => setApprovalSuccess(null), 5000)
      }
      
      // Refresh data
      refetchConsents()
    } catch (error) {
      console.error('Error approving request:', error)
      alert('Failed to approve request: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleDenyRequest = async (consentId: string, requestIndex: number) => {
    alert('Request denied. Note: Revoking functionality will be added in the next update.')
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Success Message */}
      {approvalSuccess && (
        <div className="bg-green-500/20 border-2 border-green-500/50 rounded-lg p-4 flex items-center animate-fade-in">
          <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
          <p className="text-white font-medium">{approvalSuccess}</p>
        </div>
      )}
      
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
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="min-w-full divide-y divide-blue-500/20">
            <thead className="bg-black/30">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider min-w-[250px]">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider min-w-[140px]">
                  Date Uploaded
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider min-w-[100px]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider min-w-[120px]">
                  Access Count
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider min-w-[120px]">
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
                    <td className="px-4 py-4">
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
                    <td className="px-4 py-4 text-sm text-gray-400">
                      {formatDate(item.timestamp ? item.timestamp.toString() : new Date().toISOString())}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.isActive 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-400">
                      {item.accessCount || 0}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
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

      {/* Research Requests Section */}
      <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg hover:border-blue-400/40 transition-all duration-300">
        <div className="px-6 py-4 border-b border-blue-500/20">
          <h2 className="text-lg font-semibold text-white">Research Requests</h2>
          <p className="text-sm text-gray-400">Review and manage access requests from researchers</p>
        </div>
        <div className="p-6">
          {requestsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center text-gray-400">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                Loading research requests...
              </div>
            </div>
          ) : researchRequests.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No research requests yet</p>
              <p className="text-sm text-gray-500 mt-2">Researchers can request access to your datasets</p>
            </div>
          ) : (
            <div className="space-y-4">
              {researchRequests.map((request, index) => {
                // Check if this request has been approved by checking the approved requests set
                const isApproved = approvedRequests ? approvedRequests.has(request.consentId) : false
                const status = isApproved ? 'approved' : 'pending'
                
                return (
                <div key={request.id} className="bg-black/30 border border-blue-500/20 rounded-lg p-4 hover:border-blue-400/40 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <User className="w-5 h-5 text-blue-400 mr-2" />
                        <span className="text-sm font-medium text-white">Request #{index + 1}</span>
                        <span className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${
                          isApproved 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{request.purpose}</p>
                      <p className="text-xs text-gray-500">
                        Researcher: {request.researcher}
                      </p>
                      <p className="text-xs text-gray-500">
                        Consent ID: {request.consentId}
                      </p>
                      {isApproved && (
                        <p className="text-xs text-green-400 mt-1">
                          ✓ Researcher has been granted access
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {!isApproved && (
                        <>
                          <button
                            onClick={() => handleApproveRequest(request.consentId, index)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center transition-colors"
                            title="Approve this research request"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleDenyRequest(request.consentId, index)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center transition-colors"
                            title="Deny this research request"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Deny
                          </button>
                        </>
                      )}
                      {isApproved && (
                        <button
                          disabled
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center opacity-50 cursor-not-allowed"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Consent Details Modal */}
      {selectedConsent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedConsent(null)}>
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Consent Details</h2>
              <button
                onClick={() => setSelectedConsent(null)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-blue-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-400">Data Type</p>
                  <p className="text-sm text-white capitalize">{(selectedConsent.dataType || 'unknown').replace('_', ' ')}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-green-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-400">Description</p>
                  <p className="text-sm text-white">{selectedConsent.description || 'No description'}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Eye className="w-5 h-5 text-purple-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-400">Access Count</p>
                  <p className="text-sm text-white">{selectedConsent.accessCount || 0}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">Data Hash</p>
                <p className="text-xs text-gray-500 font-mono bg-gray-900 p-2 rounded break-all">
                  {selectedConsent.dataHash}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end p-6 border-t border-gray-700">
              <button
                onClick={() => setSelectedConsent(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContributorDashboard
