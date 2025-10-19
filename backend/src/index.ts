import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Basic routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Mock data for datasets
const mockDatasets = [
  {
    id: '1',
    title: 'Diabetes Biomarkers Study',
    type: 'lab_results',
    contributorCount: 150,
    dataPoints: 2500,
    lastUpdated: '2024-01-15',
    description: 'Blood glucose, HbA1c, and insulin levels from diabetic patients',
    tags: ['diabetes', 'biomarkers', 'glucose'],
    accessLevel: 'public',
    price: 0.05,
    dataHash: 'QmDiabetes123',
    consentId: '0xabc123'
  },
  {
    id: '2',
    title: 'Cardiovascular Health Monitoring',
    type: 'wearable_data',
    contributorCount: 89,
    dataPoints: 12000,
    lastUpdated: '2024-01-14',
    description: 'Heart rate, blood pressure, and activity data from fitness trackers',
    tags: ['cardiovascular', 'heart-rate', 'activity'],
    accessLevel: 'restricted',
    price: 0.1,
    dataHash: 'QmCardio456',
    consentId: '0xdef456'
  },
  {
    id: '3',
    title: 'Mental Health Patterns',
    type: 'survey_data',
    contributorCount: 67,
    dataPoints: 800,
    lastUpdated: '2024-01-13',
    description: 'Depression and anxiety screening results with demographic data',
    tags: ['mental-health', 'depression', 'anxiety'],
    accessLevel: 'public',
    price: 0.03,
    dataHash: 'QmMental789',
    consentId: '0xghi789'
  },
  {
    id: '4',
    title: 'Sleep Quality Analysis',
    type: 'wearable_data',
    contributorCount: 203,
    dataPoints: 15000,
    lastUpdated: '2024-01-12',
    description: 'Sleep duration, quality, and patterns from smart devices',
    tags: ['sleep', 'quality', 'patterns'],
    accessLevel: 'public',
    price: 0.08,
    dataHash: 'QmSleep012',
    consentId: '0xjkl012'
  }
]

app.get('/api/datasets', (req, res) => {
  const { search, type, sortBy } = req.query
  
  let filteredDatasets = [...mockDatasets]
  
  // Filter by search query
  if (search) {
    const searchTerm = (search as string).toLowerCase()
    filteredDatasets = filteredDatasets.filter(dataset => 
      dataset.title.toLowerCase().includes(searchTerm) ||
      dataset.description.toLowerCase().includes(searchTerm) ||
      dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }
  
  // Filter by type
  if (type && type !== 'all') {
    filteredDatasets = filteredDatasets.filter(dataset => dataset.type === type)
  }
  
  // Sort datasets
  if (sortBy) {
    switch (sortBy) {
      case 'date':
        filteredDatasets.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        break
      case 'contributors':
        filteredDatasets.sort((a, b) => b.contributorCount - a.contributorCount)
        break
      case 'dataPoints':
        filteredDatasets.sort((a, b) => b.dataPoints - a.dataPoints)
        break
      case 'price':
        filteredDatasets.sort((a, b) => a.price - b.price)
        break
    }
  }
  
  res.json({
    datasets: filteredDatasets,
    total: filteredDatasets.length,
    filters: { search, type, sortBy }
  })
})

app.get('/api/datasets/:id', (req, res) => {
  const dataset = mockDatasets.find(d => d.id === req.params.id)
  if (!dataset) {
    return res.status(404).json({ error: 'Dataset not found' })
  }
  res.json(dataset)
})

// Access request endpoints
app.post('/api/access-requests', (req, res) => {
  const { datasetId, researcherAddress, purpose } = req.body
  
  if (!datasetId || !researcherAddress) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  
  const dataset = mockDatasets.find(d => d.id === datasetId)
  if (!dataset) {
    return res.status(404).json({ error: 'Dataset not found' })
  }
  
  const request = {
    id: Date.now().toString(),
    datasetId,
    datasetTitle: dataset.title,
    researcherAddress,
    purpose: purpose || 'Research study',
    requestedAt: new Date().toISOString(),
    status: 'pending',
    price: dataset.price
  }
  
  res.json(request)
})

// Analytics endpoints
app.get('/api/analytics/overview', (req, res) => {
  const totalDatasets = mockDatasets.length
  const totalContributors = mockDatasets.reduce((sum, d) => sum + d.contributorCount, 0)
  const totalDataPoints = mockDatasets.reduce((sum, d) => sum + d.dataPoints, 0)
  const averagePrice = mockDatasets.reduce((sum, d) => sum + d.price, 0) / totalDatasets
  
  res.json({
    totalDatasets,
    totalContributors,
    totalDataPoints,
    averagePrice: parseFloat(averagePrice.toFixed(3)),
    datasetsByType: mockDatasets.reduce((acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  })
})

app.post('/api/upload', (req, res) => {
  // TODO: Implement file upload to Lighthouse
  res.json({ message: 'Upload endpoint - coming soon' })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
