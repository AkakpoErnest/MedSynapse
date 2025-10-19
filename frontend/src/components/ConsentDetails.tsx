import React from 'react'
import { X, Calendar, User, Shield, Eye } from 'lucide-react'

interface ConsentDetailsProps {
  consent: {
    id: string
    type: string
    description: string
    date: string
    status: string
    requests: number
  }
  onClose: () => void
}

const ConsentDetails: React.FC<ConsentDetailsProps> = ({ consent, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Consent Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-blue-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Data Type</p>
              <p className="text-sm text-gray-600 capitalize">{consent.type.replace('_', ' ')}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-green-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Upload Date</p>
              <p className="text-sm text-gray-600">{new Date(consent.date).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Eye className="w-5 h-5 text-purple-500 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Research Requests</p>
              <p className="text-sm text-gray-600">{consent.requests}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Description</p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {consent.description}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-900 mb-2">Consent ID</p>
            <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded break-all">
              {consent.id}
            </p>
          </div>
        </div>
        
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConsentDetails
