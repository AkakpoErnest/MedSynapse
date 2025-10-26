import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, BarChart3, Eye, Clock, Users, TrendingUp, Wifi, WifiOff } from 'lucide-react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { useResearchRequests, useAnalytics, useEnvioConnection } from '../hooks/useEnvio'

const ResearcherDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [selectedDataset, setSelectedDataset] = useState<any>(null)
  const [requestHistory, setRequestHistory] = useState<any[]>([])
  const [requestingAccess, setRequestingAccess] = useState(false)
  
  // Blockchain hooks
  const { address, isConnected } = useAccount()
  const { data: publicClient } = usePublicClient()
  const { data: walletClient } = useWalletClient()
  
  // Use Envio hooks for real-time data
  const { requests, loading: requestsLoading, error: requestsError } = useResearchRequests()
  const { analytics, loading: analyticsLoading } = useAnalytics()
  const { isConnected: envioConnected, isChecking } = useEnvioConnection()

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (request.consentRecord?.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || request.consentRecord?.dataType === selectedFilter
    return matchesSearch && matchesFilter
  })

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return (b.timestamp ? new Date(b.timestamp).getTime() : 0) - (a.timestamp ? new Date(a.timestamp).getTime() : 0)
      case 'price':
        return parseFloat(a.price || '0') - parseFloat(b.price || '0')
      case 'status':
        return (a.status || '').localeCompare(b.status || '')
      default:
        return 0
    }
  })

  const handleRequestAccess = async (request: any) => {
    if (!isConnected || !address || !walletClient) {
      alert('Please connect your wallet first')
      return
    }

    setRequestingAccess(true)
    try {
      const MEDSYNAPSE_CONTRACT = '0xeaDEaAFE440283aEaC909CD58ec367735BfE712f' // Sepolia
      const MEDSYNAPSE_ABI = [
        {
          inputs: [
            { internalType: 'bytes32', name: '_consentId', type: 'bytes32' },
            { internalType: 'string', name: '_purpose', type: 'string' }
          ],
          name: 'requestDataAccess',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function'
        }
      ] as const

      const purpose = `Research on ${request.consentRecord?.description || 'health data'}`
      
      console.log('Requesting data access for consent:', request.consentId)
      const hash = await walletClient.writeContract({
        address: MEDSYNAPSE_CONTRACT as `0x${string}`,
        abi: MEDSYNAPSE_ABI,
        functionName: 'requestDataAccess',
        args: [request.consentId, purpose]
      })
      
      console.log('Research request submitted:', hash)
      
      // Wait for transaction
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        console.log('Research request confirmed:', receipt)
      }

      // Update local state
      const newRequest = {
        id: Date.now().toString(),
        consentId: request.consentId,
        researcher: address,
        purpose: purpose,
        timestamp: Date.now(),
        status: 'pending'
      }
      setRequestHistory(prev => [newRequest, ...prev])
      
      alert('Research request submitted successfully! Waiting for contributor approval.')
    } catch (error) {
      console.error('Error requesting access:', error)
      alert('Failed to submit research request: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setRequestingAccess(false)
      setSelectedDataset(null)
    }
  }

  const getDataTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      'lab_results': '🧪',
      'wearable_data': '⌚',
      'survey_data': '📋',
      'imaging_data': '📷',
      'genetic_data': '🧬'
    }
    return icons[type] || '📄'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Researcher Dashboard</h1>
          <div className="flex items-center mt-2">
            {isChecking ? (
              <div className="flex items-center text-gray-400">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Checking Envio connection...
              </div>
            ) : envioConnected ? (
              <div className="flex items-center text-green-400">
                <Wifi className="w-4 h-4 mr-2" />
                Envio HyperSync Connected
              </div>
            ) : (
              <div className="flex items-center text-red-400">
                <WifiOff className="w-4 h-4 mr-2" />
                Envio HyperSync Disconnected
              </div>
            )}
          </div>
        </div>
        <Link
          to="/analysis"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center border border-blue-400/30"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analyze Data
        </Link>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 p-6 rounded-lg hover:border-blue-400/40 transition-all duration-300">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Consents</p>
                <p className="text-2xl font-bold text-white">{analytics.totalConsents}</p>
              </div>
            </div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 p-6 rounded-lg hover:border-blue-400/40 transition-all duration-300">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Consents</p>
                <p className="text-2xl font-bold text-white">{analytics.activeConsents}</p>
              </div>
            </div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 p-6 rounded-lg hover:border-blue-400/40 transition-all duration-300">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Requests</p>
                <p className="text-2xl font-bold text-white">{analytics.totalRequests}</p>
              </div>
            </div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 p-6 rounded-lg hover:border-blue-400/40 transition-all duration-300">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Pending Requests</p>
                <p className="text-2xl font-bold text-white">{analytics.pendingRequests}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search datasets by purpose or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-blue-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 bg-black/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Types</option>
              <option value="lab_results">Lab Results</option>
              <option value="wearable_data">Wearable Data</option>
              <option value="survey_data">Survey Data</option>
              <option value="imaging_data">Imaging Data</option>
              <option value="genetic_data">Genetic Data</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-black/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option value="date">Sort by Date</option>
              <option value="price">Sort by Price</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Available Datasets */}
      <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg">
        <div className="px-6 py-4 border-b border-blue-500/20">
          <h2 className="text-lg font-semibold text-white">Available Datasets</h2>
        </div>
        <div className="p-6">
          {requestsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center text-gray-400">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-3"></div>
                Loading datasets from blockchain...
              </div>
            </div>
          ) : requestsError ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">Error loading datasets: {requestsError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-blue-400 hover:text-blue-300"
              >
                Try again
              </button>
            </div>
          ) : sortedRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No datasets available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedRequests.map((request) => (
                <div key={request.id} className="bg-black/30 border border-blue-500/20 rounded-lg p-6 hover:border-blue-400/40 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {getDataTypeIcon(request.consentRecord?.dataType || 'unknown')}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {request.consentRecord?.description || 'Unknown Dataset'}
                        </h3>
                        <p className="text-sm text-gray-400 capitalize">
                          {request.consentRecord?.dataType?.replace('_', ' ') || 'Unknown Type'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(request.status || 'pending')}`}>
                      {request.status || 'pending'}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {request.purpose}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>Price: {request.price || '0'} ETH</span>
                    <span>{(request.timestamp ? new Date(request.timestamp) : new Date()).toLocaleDateString()}</span>
                  </div>
                  
                  <button
                    onClick={() => handleRequestAccess(request)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium"
                  >
                    Request Access
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Request History */}
      {requestHistory.length > 0 && (
        <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg">
          <div className="px-6 py-4 border-b border-blue-500/20">
            <h2 className="text-lg font-semibold text-white">Your Request History</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {requestHistory.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-black/30 border border-blue-500/20 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">{request.datasetTitle}</h3>
                    <p className="text-sm text-gray-400">
                      Requested: {new Date(request.requestedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(request.status || 'pending')}`}>
                      {request.status || 'pending'}
                    </span>
                    <span className="text-sm text-gray-400">{request.price || '0'} ETH</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResearcherDashboard