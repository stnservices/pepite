import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { authMiddleware } from './middleware/auth.js'
import authRoutes from './routes/auth.js'
import dataRoutes from './routes/data.js'
import placesRoutes from './routes/places.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = parseInt(process.env.PORT || '3001', 10)

app.use(express.json())

// CORS for development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:3000' }))
}

// Auth routes (public)
app.use('/api/auth', authRoutes)

// Protected data routes
app.use('/api', authMiddleware, dataRoutes)
app.use('/api/places', authMiddleware, placesRoutes)

// Production: serve frontend static files
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../dist')
  app.use(express.static(clientDist))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Pepite server running on port ${PORT}`)
})
