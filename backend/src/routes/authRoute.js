import express from 'express'
import { authController } from '../controllers/authController.js'
import { authMiddleware } from '~/middlewares/authMiddleware.js'
const Router = express.Router()

Router.post('/login', authController.login)
Router.post('/signup', authController.signup)
Router.delete('/logout', authController.logout)
Router.post(
  '/onboarding',
  authMiddleware.protectRoute,
  authController.onboarding
)

Router.get('/me', authMiddleware.protectRoute, (req, res) => {
  res.status(200).json({
    message: 'User profile fetched successfully',
    user: req.user
  })
})


export const authRoute = Router
