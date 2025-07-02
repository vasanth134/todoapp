import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import todoRoutes from './routes/todoRoutes'
import { errorHandler } from './middleware/errorHandler'
import { testConnection } from './database/config'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/todos', todoRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
  
  // Test database connection
  console.log('🔍 Testing database connection...')
  const dbConnected = await testConnection()
  if (!dbConnected) {
    console.log('⚠️  Database connection failed. Please ensure PostgreSQL is running and configured properly.')
    console.log('📋 Expected database: todoapp')
    console.log('📋 Expected user: postgres')
    console.log('📋 Expected host: localhost:5432')
  }
})
