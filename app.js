import express, { json } from 'express'
import errorHandler from './middleware/errors'
require('dotenv').config()
const morgan = require('morgan') // morgan for logging

const app = express()

// middleware
app.use(json())
app.use(morgan('dev')) // logging http requests

// routes
import authRoutes from './routes/auth'
import postRoutes from './routes/posts'
import commentRoutes from './routes/comments'
import profileRoutes from './routes/profile'

app.use('/auth', authRoutes)
app.use('/posts', postRoutes)
app.use('/comments', commentRoutes)
app.use('/profile', profileRoutes)

// error handling middleware
app.use(errorHandler)

// health check route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'OK' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))