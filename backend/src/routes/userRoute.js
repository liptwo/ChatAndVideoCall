import express from 'express'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.use(authMiddleware.protectRoute)
Router.get('/', userController.getRecommendUser)
Router.get('/friends', userController.getMyFriends)

Router.post('/friend-request/:id', userController.sendFriendRequest)
Router.put('/friend-request/:id/accept', userController.acceptFriendRequest)
Router.put('/friend-request/:id/reject', userController.rejectFriendRequest)

Router.get('/friend-request', userController.getFriendRequest)
Router.get('/outgoing-friend-request', userController.getOutgoingFriendRequest)
export const userRoute = Router