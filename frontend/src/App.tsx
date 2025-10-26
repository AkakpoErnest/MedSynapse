import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import ContributorDashboard from './pages/ContributorDashboard'
import ResearcherDashboard from './pages/ResearcherDashboard'
import DataUpload from './pages/DataUpload'
import DataAnalysis from './pages/DataAnalysis'
import AIInsightsDashboard from './components/AIInsightsDashboard'
import TailwindTest from './components/TailwindTest'
import { AuthProvider } from './contexts/AuthContext'

// Wagmi v2 configuration
const config = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
  },
})

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <WagmiProvider config={config}>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/contributor"
                element={
                  <ProtectedRoute requiredRole="contributor">
                    <ContributorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/researcher"
                element={
                  <ProtectedRoute requiredRole="researcher">
                    <ResearcherDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute requiredRole="contributor">
                    <DataUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analysis"
                element={
                  <ProtectedRoute requiredRole="researcher">
                    <DataAnalysis />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-dashboard"
                element={<AIInsightsDashboard />}
              />
              <Route path="/test" element={<TailwindTest />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </WagmiProvider>
    </BrowserRouter>
  )
}

export default App
