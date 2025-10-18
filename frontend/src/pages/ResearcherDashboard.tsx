import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Download, BarChart3 } from 'lucide-react'

const ResearcherDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  // Mock data - in real app this would come from HyperSync
  const mockDatasets = [
    {
      id: '1',
      title: 'Diabetes Biomarkers Study',
      type: 'lab_results',
      contributorCount: 150,
      dataPoints: 2500,
      lastUpdated: '2024-01-15',
      description: 'Blood glucose, HbA1c, and insulin levels from diabetic patients'
    },
    {
      id: '2',
      title: 'Cardiovascular Health Monitoring',
      type: 'wearable_data',
      contributorCount: 89,
      dataPoints: 12000,
      lastUpdated: '2024-01-14',
      description: 'Heart rate, blood pressure, and activity data from fitness trackers'
    },
    {
      id: '3',
      title: 'Mental Health Patterns',
      type: 'survey_data',
      contributorCount: 67,
      dataPoints: 800,
      lastUpdated: '2024-01-13',
      description: 'Depression and anxiety screening results with demographic data'
    }
  ]

  const filteredDatasets = mockDatasets.filter(dataset => {
    const matchesSearch = dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || dataset.type === selectedFilter
    return matchesSearch && matchesFilter
  })

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

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search datasets..."
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
          </div>
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatasets.map((dataset) => (
          <div key={dataset.id} className="bg-white rounded-lg shadow-sm border p-6 card-hover">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{dataset.title}</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {dataset.type.replace('_', ' ')}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{dataset.description}</p>
            
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
                <span className="font-medium">{dataset.lastUpdated}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                Request Access
              </button>
              <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDatasets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No datasets found matching your criteria.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  )
}

export default ResearcherDashboard
