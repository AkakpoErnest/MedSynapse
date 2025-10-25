import React from 'react'
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react'
import lighthouseService from '../services/lighthouseService'

const LighthouseStatus: React.FC = () => {
  const isConfigured = lighthouseService.isConfigured()

  return (
    <div className="flex items-center space-x-2">
      {isConfigured ? (
        <>
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400">Lighthouse Storage Ready</span>
        </>
      ) : (
        <>
          <ShieldAlert className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-yellow-400">Lighthouse Not Configured</span>
        </>
      )}
    </div>
  )
}

export default LighthouseStatus
