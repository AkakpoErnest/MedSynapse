import React from 'react'
import { Wifi, WifiOff, Loader2 } from 'lucide-react'
import { useEnvioConnection } from '../hooks/useEnvio'

interface EnvioStatusProps {
  className?: string
  showText?: boolean
}

const EnvioStatus: React.FC<EnvioStatusProps> = ({ className = '', showText = true }) => {
  const { isConnected, isChecking } = useEnvioConnection()

  if (isChecking) {
    return (
      <div className={`flex items-center text-gray-400 ${className}`}>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        {showText && <span>Checking Envio...</span>}
      </div>
    )
  }

  return (
    <div className={`flex items-center ${isConnected ? 'text-green-400' : 'text-red-400'} ${className}`}>
      {isConnected ? (
        <Wifi className="w-4 h-4 mr-2" />
      ) : (
        <WifiOff className="w-4 h-4 mr-2" />
      )}
      {showText && (
        <span>
          Envio HyperSync {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      )}
    </div>
  )
}

export default EnvioStatus
