import React from 'react'
import { useAccount } from 'wagmi'
import { useAuth } from '../contexts/AuthContext'
import RoleSelection from '../pages/RoleSelection'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'contributor' | 'researcher'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { isConnected } = useAccount()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If wallet is connected but no role selected, show role selection
  if (isConnected && !isAuthenticated) {
    return <RoleSelection />
  }

  // If wallet not connected, show role selection
  if (!isConnected) {
    return <RoleSelection />
  }

  // If authenticated but wrong role, show role selection
  if (requiredRole && user?.role !== requiredRole) {
    return <RoleSelection />
  }

  return <>{children}</>
}

export default ProtectedRoute
