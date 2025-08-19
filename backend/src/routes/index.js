import express from 'express'
import { authRoute } from './authRoute.js'
import { userRoute } from './userRoute.js'
import { chatRoute } from './chatRoute.js'

const router = express.Router()

// Define your routes here
router.use('/auth', authRoute)
// User route
router.use('/user', userRoute)

// Chat route
router.use('/chat', chatRoute)
export const API_route = router
// Export the router to be used in server.js
// export default route
// er