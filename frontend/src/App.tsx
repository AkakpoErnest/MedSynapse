import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import Layout from './components/Layout'
import Home from './pages/Home'
import ContributorDashboard from './pages/ContributorDashboard'
import ResearcherDashboard from './pages/ResearcherDashboard'
import DataUpload from './pages/DataUpload'
import DataAnalysis from './pages/DataAnalysis'

// Configure wagmi
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
})

function App() {
  return (
    <WagmiConfig config={config}>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contributor" element={<ContributorDashboard />} />
            <Route path="/researcher" element={<ResearcherDashboard />} />
            <Route path="/upload" element={<DataUpload />} />
            <Route path="/analysis" element={<DataAnalysis />} />
          </Routes>
        </Layout>
      </div>
    </WagmiConfig>
  )
}

export default App
