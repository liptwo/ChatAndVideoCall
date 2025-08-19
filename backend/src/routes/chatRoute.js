import express from 'express'

import { chatController } from '../controllers/chatController.js'
import { authMiddleware } from '~/middlewares/authMiddleware.js'

const Router = express.Router()

// Protect all chat routes
// Router.use(authMiddleware.protectRoute)

// Define chat routes
Router.get('/token', authMiddleware.protectRoute, chatController.getStreamToken)
// Router.post('/create', chatController.createChat)
// Router.get('/all', chatController.getAllChats)
// Router.get('/:chatId', chatController.getChatById)
// Router.post('/:chatId/message', chatController.sendMessage)
// Router.get('/:chatId/messages', chatController.getMessages)
// Router.delete('/:chatId', chatController.deleteChat)

export const chatRoute = Router
