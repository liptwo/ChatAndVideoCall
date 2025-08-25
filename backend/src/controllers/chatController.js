import { generateStreamToken } from '~/lib/stream'

const getStreamToken = async (req, res, next) => {
    try {
        // Logic to generate and return chat getChatToken
        const token = await generateStreamToken(req.user._id)
        // console.log('token', token)
        res.status(200).json(token)
    } catch (error) {
        console.error('Error generating chat token:', error)
        res.status(500).json({
            message: 'Failed to generate chat token',
            error: error.message
        })
    }
}
export const chatController = {
    getStreamToken
    // Uncomment and implement the following methods as needed
    // createChat,
    // getAllChats,
    // getChatById,
    // sendMessage,
    // getMessages,
    // deleteChat
}