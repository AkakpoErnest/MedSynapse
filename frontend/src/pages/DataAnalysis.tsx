import React, { useState } from 'react'
import { BarChart3, TrendingUp, Users, Activity, Brain, Download, Share2 } from 'lucide-react'

const DataAnalysis: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState('diabetes')
  const [analysisType, setAnalysisType] = useState('trends')

  // Mock analysis results
  const mockAnalysis = {
    diabetes: {
      trends: {
        title: 'Diabetes Biomarker Trends',
        insights: [
          'Average HbA1c levels decreased by 12% over 6 months',
          'Peak glucose spikes occur between 2-4 PM',
          'Correlation found between sleep quality and morning glucose levels'
        ],
        charts: [
          { label: 'HbA1c Trend', value: 85, color: 'bg-blue-500' },
          { label: 'Glucose Variability', value: 72, color: 'bg-green-500' },
          { label: 'Insulin Sensitivity', value: 68, color: 'bg-purple-500' }
        ]
      },
      correlations: {
        title: 'Biomarker Correlations',
        insights: [
          'Strong negative correlation between exercise frequency and HbA1c',
          'Sleep duration shows moderate correlation with glucose control',
          'Stress levels correlate with glucose variability'
        ],
        charts: [
          { label: 'Exercise vs HbA1c', value: -0.78, color: 'bg-red-500' },
          { label: 'Sleep vs Glucose', value: -0.45, color: 'bg-blue-500' },
          { label: 'Stress vs Variability', value: 0.62, color: 'bg-orange-500' }
        ]
      }
    },
    cardiovascular: {
      trends: {
        title: 'Cardiovascular Health Patterns',
        insights: [
          'Resting heart rate decreased by 8 BPM on average',
          'Peak activity periods show improved recovery rates',
          'Blood pressure variability reduced by 15%'
        ],
        charts: [
          { label: 'Heart Rate Recovery', value: 92, color: 'bg-green-500' },
          { label: 'BP Stability', value: 78, color: 'bg-blue-500' },
          { label: 'Activity Efficiency', value: 85, color: 'bg-purple-500' }
        ]
      },
      correlations: {
        title: 'Cardiovascular Correlations',
        insights: [
          'Exercise intensity strongly correlates with heart rate recovery',
          'Sleep quality impacts morning blood pressure readings',
          'Stress levels affect heart rate variability'
        ],
        charts: [
          { label: 'Exercise vs Recovery', value: 0.82, color: 'bg-green-500' },
          { label: 'Sleep vs BP', value: -0.58, color: 'bg-blue-500' },
          { label: 'Stress vs HRV', value: -0.71, color: 'bg-red-500' }
        ]
      }
    }
  }

  const currentAnalysis = mockAnalysis[selectedDataset as keyof typeof mockAnalysis]?.[analysisType as keyof typeof mockAnalysis.diabetes]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">AI Data Analysis</h1>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>
      </div>

      {/* Dataset Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Select Dataset for Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedDataset === 'diabetes' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedDataset('diabetes')}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">🧪</span>
              <div>
                <h3 className="font-medium">Diabetes Biomarkers Study</h3>
                <p className="text-sm text-gray-500">150 contributors, 2,500 data points</p>
              </div>
            </div>
          </div>
          <div 
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedDataset === 'cardiovascular' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedDataset('cardiovascular')}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">⌚</span>
              <div>
                <h3 className="font-medium">Cardiovascular Health Monitoring</h3>
                <p className="text-sm text-gray-500">89 contributors, 12,000 data points</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Type Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Type</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setAnalysisType('trends')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              analysisType === 'trends'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Trend Analysis
          </button>
          <button
            onClick={() => setAnalysisType('correlations')}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              analysisType === 'correlations'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Correlation Analysis
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {currentAnalysis && (
        <div className="space-y-6">
          {/* Key Insights */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <Brain className="w-6 h-6 text-purple-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">{currentAnalysis.title}</h2>
            </div>
            <div className="space-y-3">
              {currentAnalysis.insights.map((insight, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Charts */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentAnalysis.charts.map((chart, index) => (
                <div key={index} className="text-center">
                  <div className="mb-2">
                    <div className={`w-16 h-16 mx-auto rounded-full ${chart.color} flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {Math.abs(chart.value)}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900">{chart.label}</h3>
                  <p className="text-sm text-gray-500">
                    {chart.value > 0 ? '+' : ''}{chart.value}%
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Detailed Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Data Quality</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completeness:</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium">98.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consistency:</span>
                    <span className="font-medium">91.5%</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Analysis Confidence</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statistical Power:</span>
                    <span className="font-medium">0.89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Significance Level:</span>
                    <span className="font-medium">p < 0.001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effect Size:</span>
                    <span className="font-medium">Large</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataAnalysis
