import React from 'react'

const TailwindTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Tailwind CSS Test</h1>
        <p className="text-gray-600 mb-4">If you can see this styled properly, Tailwind is working!</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Test Button
        </button>
        <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">
          <p className="text-green-800">✅ Tailwind CSS is working correctly!</p>
        </div>
      </div>
    </div>
  )
}

export default TailwindTest
