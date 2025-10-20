import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { WagmiConfig, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { http } from 'viem'

import Layout from './components/Layout'
import Home from './pages/Home'
import ContributorDashboard from './pages/ContributorDashboard'
import ResearcherDashboard from './pages/ResearcherDashboard'
import DataUpload from './pages/DataUpload'
import DataAnalysis from './pages/DataAnalysis'
import TailwindTest from './components/TailwindTest'

// Simplified wagmi configuration
const config = createConfig({
  chains: [mainnet],
  connectors: [
    new MetaMaskConnector(),
  ],
  transports: {
    [mainnet.id]: http(),
  },
})

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <WagmiConfig config={config}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contributor" element={<ContributorDashboard />} />
            <Route path="/researcher" element={<ResearcherDashboard />} />
            <Route path="/upload" element={<DataUpload />} />
            <Route path="/analysis" element={<DataAnalysis />} />
            <Route path="/test" element={<TailwindTest />} />
          </Routes>
        </Layout>
      </WagmiConfig>
    </BrowserRouter>
  )
}

export default App
