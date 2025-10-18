import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Shield, Brain, Users } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
          MedSynapse
        </h1>
        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          Decentralized, AI-powered platform for secure health data sharing. 
          Bridge siloed healthcare data across blockchains while maintaining privacy.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/contributor"
            className="bg-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            I'm a Contributor
          </Link>
          <Link
            to="/researcher"
            className="bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            I'm a Researcher
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border card-hover">
          <Shield className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Secure & Private
          </h3>
          <p className="text-gray-600">
            Your health data is encrypted and stored securely on Lighthouse with blockchain consent.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border card-hover">
          <Brain className="w-8 h-8 text-purple-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            AI-Powered Analysis
          </h3>
          <p className="text-gray-600">
            Advanced AI tools analyze anonymized data to discover insights and patterns.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border card-hover">
          <Users className="w-8 h-8 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Global Access
          </h3>
          <p className="text-gray-600">
            Researchers can access diverse, up-to-date medical data from global sources.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border card-hover">
          <Heart className="w-8 h-8 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Patient Control
          </h3>
          <p className="text-gray-600">
            You control who accesses your data and can see when and how it's used.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          How MedSynapse Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload & Encrypt
            </h3>
            <p className="text-gray-600">
              Contributors upload health data which gets encrypted and stored on Lighthouse.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Grant Consent
            </h3>
            <p className="text-gray-600">
              Smart contracts manage consent, giving you full control over data access.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Research & Analyze
            </h3>
            <p className="text-gray-600">
              Researchers discover insights using AI tools while respecting privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
