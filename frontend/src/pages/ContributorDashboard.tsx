import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, FileText, Shield, Eye, MoreVertical, Trash2, Eye as ViewIcon } from 'lucide-react'
import { useContributorData } from '../hooks/useMedSynapse'
import { formatDate, getDataTypeIcon, getStatusColor } from '../utils/helpers'
import ConsentDetails from '../components/ConsentDetails'

const ContributorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showActions, setShowActions] = useState<string | null>(null)
  const [selectedConsent, setSelectedConsent] = useState<any>(null)
  const { consents, loading, error } = useContributorData()

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Contributor Dashboard</h1>
        <Link
          to="/upload"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Data
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Datasets</p>
              <p className="text-2xl font-bold text-gray-900">{consents.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Consents</p>
              <p className="text-2xl font-bold text-gray-900">{consents.filter(c => c.status === 'Active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Research Requests</p>
              <p className="text-2xl font-bold text-gray-900">{consents.reduce((sum, c) => sum + c.requests, 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 font-bold">$</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Earnings</p>
              <p className="text-2xl font-bold text-gray-900">$0.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Your Data</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading your data...
                  </td>
                </tr>
              ) : consents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No data uploaded yet. <Link to="/upload" className="text-blue-600 hover:text-blue-800">Upload your first dataset</Link>
                  </td>
                </tr>
              ) : (
                consents.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{getDataTypeIcon(item.type)}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {item.type.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.requests}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === item.id ? null : item.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {showActions === item.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                            <div className="py-1">
                              <button
                                onClick={() => handleViewDetails(item.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <ViewIcon className="w-4 h-4 mr-3" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleRevokeConsent(item.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
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
