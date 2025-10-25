import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

export interface User {
  address: string
  role: 'contributor' | 'researcher' | null
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  setRole: (role: 'contributor' | 'researcher') => void
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      if (isConnected && address) {
        const savedUser = localStorage.getItem(`medsynapse_user_${address}`)
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser)
            setUser(userData)
          } catch (error) {
            console.error('Error parsing saved user data:', error)
            localStorage.removeItem(`medsynapse_user_${address}`)
          }
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }

    loadUser()
  }, [address, isConnected])

  const setRole = (role: 'contributor' | 'researcher') => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    const userData: User = {
      address,
      role,
      isVerified: true // For now, just wallet connection = verified
    }

    setUser(userData)
    localStorage.setItem(`medsynapse_user_${address}`, JSON.stringify(userData))
  }

  const logout = () => {
    if (address) {
      localStorage.removeItem(`medsynapse_user_${address}`)
    }
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    setRole,
    logout,
    isAuthenticated: !!user && user.isVerified,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
