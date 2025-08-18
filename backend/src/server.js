import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import exitHook from 'async-exit-hook'
import { EXIT_DB } from './lib/db.js'
import 'dotenv/config.js'
import { API_route } from './routes/index.js'
import { connectDB } from './lib/db.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js'
import cookieParser from 'cookie-parser'
import path from 'path'

const START_SEVER = () => {
  const app = express()
  const port = process.env.PORT || 8167
  const _dirname = path.resolve()
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000', // Adjust the client URL as needed
      credentials: true // Allow credentials (cookies, authorization headers, etc.)
    })
  )
  app.use(cookieParser())
  app.use(express.json())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.use('/api', API_route)
  if (process.env.NODE_ENV === 'production') {
    // Trỏ tới thư mục dist nằm ngoài backend
    app.use(express.static(path.join(_dirname, '..', 'frontend', 'dist')))

    app.get('*', (req, res) => {
      res.sendFile(path.join(_dirname, '..', 'frontend', 'dist', 'index.html'))
    })
  }
  app.get('/', (req, res) => {
    res.send('Welcome to the API!')
  })
  // connectDB()

  // Start the server
  app.use(errorHandlingMiddleware)

  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`)
  })

  exitHook(() => {
    console.log('Exiting server...')
    EXIT_DB()
  })
}

;(async () => {
  try {
    console.log('1. Connecting to database...')
    await connectDB() // Make sure to await this
    console.log('2. Successfully connected to database!')
    START_SEVER()
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1) // Use exit code 1 for errors
  }
})()
