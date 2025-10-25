import React, { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Coins, TrendingUp, Users, Award, Shield, CheckCircle } from 'lucide-react'
import dataCoinService from '../services/dataCoinService'

const DataCoinDashboard: React.FC = () => {
  const { address, isConnected } = useAccount()
  const [dataCoinStats, setDataCoinStats] = useState<any>(null)
  const [contributorHistory, setContributorHistory] = useState<any[]>([])
  const [balance, setBalance] = useState('0')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isConnected && address) {
      loadDataCoinData()
    }
  }, [isConnected, address])

  const loadDataCoinData = async () => {
    try {
      setLoading(true)
      const [stats, history, userBalance] = await Promise.all([
        dataCoinService.getDataCoinStats(),
        dataCoinService.getContributorHistory(address!),
        dataCoinService.getContributorBalance(address!)
      ])
      
      setDataCoinStats(stats)
      setContributorHistory(history)
      setBalance(userBalance)
    } catch (error) {
      console.error('Error loading data coin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshData = async () => {
    await loadDataCoinData()
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Wallet Not Connected</h3>
              <p className="text-yellow-700">Please connect your wallet to access the Data Coin dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">MedSynapse Data Coin Dashboard</h1>
        <p className="text-gray-400">Earn MEDS tokens for contributing health data</p>
        <div className="mt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Contract Deployed
          </span>
        </div>
      </div>

      {/* Data Coin Stats */}
      {dataCoinStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 p-6 rounded-lg">
            <div className="flex items-center">
              <Coins className="w-8 h-8 text-yellow-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Your MEDS Balance</p>
                <p className="text-2xl font-bold text-white">{balance}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 p-6 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Contributions</p>
                <p className="text-2xl font-bold text-white">{dataCoinStats.totalContributions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 p-6 rounded-lg">
            <div className="flex items-center">
              <Award className="w-8 h-8 text-purple-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Rewards Distributed</p>
                <p className="text-2xl font-bold text-white">{dataCoinStats.totalRewardsDistributed}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 p-6 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Contributors</p>
                <p className="text-2xl font-bold text-white">{dataCoinStats.activeContributors}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Information */}
      <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">MedSynapse Contract</h2>
        <div className="space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-2">Contract Address:</p>
            <p className="text-white font-mono text-sm break-all">
              {dataCoinStats?.dataCoinAddress || 'Loading...'}
            </p>
          </div>
          
          <button
            onClick={handleRefreshData}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center"
          >
            <Coins className="w-5 h-5 mr-2" />
            Refresh Contract Data
          </button>
          
          <div className="text-sm text-gray-400">
            <p>• Contract deployed on Polygon Amoy testnet</p>
            <p>• Contributors earn tokens for validated health data contributions</p>
            <p>• Uses Lighthouse storage and encryption for data security</p>
            <p>• Real blockchain data integration with Envio HyperSync</p>
          </div>
        </div>
      </div>

      {/* Contribution History */}
      <div className="bg-black/50 backdrop-blur-sm border border-blue-500/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Your Contribution History</h2>
        {contributorHistory.length > 0 ? (
          <div className="space-y-3">
            {contributorHistory.map((contribution, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{contribution.dataType.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-gray-400 text-sm">Hash: {contribution.dataHash.slice(0, 10)}...</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 font-bold">+{contribution.rewardAmount} MEDS</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(contribution.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Coins className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No contributions yet. Start by uploading health data!</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default DataCoinDashboard
