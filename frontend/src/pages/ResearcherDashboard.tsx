import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Download, BarChart3, Eye, Clock, Users, TrendingUp } from 'lucide-react'
import { mockDatasets } from '../utils/helpers'

const ResearcherDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedDataset, setSelectedDataset] = useState<any>(null)
  const [requestHistory, setRequestHistory] = useState<any[]>([])

  // Mock data - in real app this would come from HyperSync
  const mockDatasets = [
    {
      id: '1',
      title: 'Diabetes Biomarkers Study',
      type: 'lab_results',
      contributorCount: 150,
      dataPoints: 2500,
      lastUpdated: '2024-01-15',
      description: 'Blood glucose, HbA1c, and insulin levels from diabetic patients',
      tags: ['diabetes', 'biomarkers', 'glucose'],
      accessLevel: 'public',
      price: 0.05
    },
    {
      id: '2',
      title: 'Cardiovascular Health Monitoring',
      type: 'wearable_data',
      contributorCount: 89,
      dataPoints: 12000,
      lastUpdated: '2024-01-14',
      description: 'Heart rate, blood pressure, and activity data from fitness trackers',
      tags: ['cardiovascular', 'heart-rate', 'activity'],
      accessLevel: 'restricted',
      price: 0.1
    },
    {
      id: '3',
      title: 'Mental Health Patterns',
      type: 'survey_data',
      contributorCount: 67,
      dataPoints: 800,
      lastUpdated: '2024-01-13',
      description: 'Depression and anxiety screening results with demographic data',
      tags: ['mental-health', 'depression', 'anxiety'],
      accessLevel: 'public',
      price: 0.03
    },
    {
      id: '4',
      title: 'Sleep Quality Analysis',
      type: 'wearable_data',
      contributorCount: 203,
      dataPoints: 15000,
      lastUpdated: '2024-01-12',
      description: 'Sleep duration, quality, and patterns from smart devices',
      tags: ['sleep', 'quality', 'patterns'],
      accessLevel: 'public',
      price: 0.08
    }
  ]

  const filteredDatasets = mockDatasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = selectedFilter === 'all' || dataset.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const sortedDatasets = [...filteredDatasets].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case 'contributors':
        return b.contributorCount - a.contributorCount
      case 'dataPoints':
        return b.dataPoints - a.dataPoints
      case 'price':
        return a.price - b.price
      default:
        return 0
    }
  })

  const handleRequestAccess = (dataset: any) => {
    const request = {
      id: Date.now().toString(),
      datasetId: dataset.id,
      datasetTitle: dataset.title,
      requestedAt: new Date().toISOString(),
      status: 'pending',
      price: dataset.price
    }
    setRequestHistory(prev => [request, ...prev])
    setSelectedDataset(null)
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

  const getAccessLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'public': 'bg-green-100 text-green-800',
      'restricted': 'bg-yellow-100 text-yellow-800',
      'private': 'bg-red-100 text-red-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Researcher Dashboard</h1>
        <Link
          to="/analysis"
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          AI Analysis
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Datasets</p>
              <p className="text-2xl font-bold text-gray-900">{mockDatasets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Contributors</p>
              <p className="text-2xl font-bold text-gray-900">{mockDatasets.reduce((sum, d) => sum + d.contributorCount, 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Data Points</p>
              <p className="text-2xl font-bold text-gray-900">{mockDatasets.reduce((sum, d) => sum + d.dataPoints, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{requestHistory.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search datasets by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="lab_results">Lab Results</option>
              <option value="wearable_data">Wearable Data</option>
              <option value="survey_data">Survey Data</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="contributors">Sort by Contributors</option>
              <option value="dataPoints">Sort by Data Points</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedDatasets.map((dataset) => (
          <div key={dataset.id} className="bg-white rounded-lg shadow-sm border p-6 card-hover">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getDataTypeIcon(dataset.type)}</span>
                <h3 className="text-lg font-semibold text-gray-900">{dataset.title}</h3>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getAccessLevelColor(dataset.accessLevel)}`}>
                  {dataset.accessLevel}
                </span>
                <span className="text-xs text-gray-500">${dataset.price.toFixed(3)}</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{dataset.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {dataset.tags.map((tag: string) => (
                <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Contributors:</span>
                <span className="font-medium">{dataset.contributorCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Data Points:</span>
                <span className="font-medium">{dataset.dataPoints.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Updated:</span>
                <span className="font-medium">{new Date(dataset.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setSelectedDataset(dataset)}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button 
                onClick={() => handleRequestAccess(dataset)}
                className="bg-green-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-600 transition-colors"
              >
                Request Access
              </button>
            </div>
          </div>
        ))}
      </div>

      {sortedDatasets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No datasets found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Request History */}
      {requestHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Access Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dataset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requestHistory.slice(0, 5).map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.datasetTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.requestedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        request.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${request.price.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dataset Details Modal */}
      {selectedDataset && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-2xl w-full">
            <button
              onClick={() => setSelectedDataset(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-start mb-6">
              <span className="text-4xl mr-4">{getDataTypeIcon(selectedDataset.type)}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedDataset.title}</h2>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${getAccessLevelColor(selectedDataset.accessLevel)}`}>
                    {selectedDataset.accessLevel}
                  </span>
                  <span className="text-sm text-gray-500">${selectedDataset.price.toFixed(3)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{selectedDataset.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDataset.tags.map((tag: string) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Dataset Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contributors:</span>
                      <span className="font-medium">{selectedDataset.contributorCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data Points:</span>
                      <span className="font-medium">{selectedDataset.dataPoints.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-medium">{new Date(selectedDataset.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedDataset(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => handleRequestAccess(selectedDataset)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                Request Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResearcherDashboard
