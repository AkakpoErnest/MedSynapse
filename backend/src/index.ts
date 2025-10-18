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

app.get('/api/datasets', (req, res) => {
  // Mock data for now
  const datasets = [
    {
      id: '1',
      title: 'Diabetes Study',
      type: 'lab_results',
      contributorCount: 150,
      dataPoints: 2500
    }
  ]
  res.json(datasets)
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
