import { StatusCodes } from 'http-status-codes'
import FriendRequest from '~/models/FriendRequest'
import User from '~/models/User'

const getRecommendUser = async (req, res, next) => {
    try {
        const currentUserId = req.user._id
        // Assuming you have a User model with a method to get recommended users
        // This is just a placeholder; replace with your actual logic'
        const currentUser = req.user
        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude current user
                { _id: { $nin: currentUser.friends } },
                { isOnboarded: true }
            ]
        })
        // Logic to get recommended users
        res.status(StatusCodes.OK).json(recommendedUsers)
    } catch (error) {
        console.error('Error fetching recommended users:', error)
        res.status(500).json({
            message: 'Failed to fetch recommended users',
            error: error.message
        })
    }
}

const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select('friends')
            .populate(
                'friends',
                'username profilePicture nativeLanguage learningLanguage'
            )
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const friends = user.friends
        // Logic to get user's friends
        res.status(200).json(friends)
    } catch (error) {
        console.error('Error fetching friends:', error)
        res.status(500).json({
            message: 'Failed to fetch friends',
            error: error.message
        })
    }
}

const sendFriendRequest = async (req, res) => {
    try {
        const userId = req.user._id
        const { id: reciptId } = req.params
        if (userId === reciptId) {
            return res.status(400).json({
                message: 'You cannot send a friend request to yourself'
            })
        }
        // const sender = await User.findById(userId)
        const receiver = await User.findById(reciptId).select('-password')
        if (!receiver) {
            return res.status(404).json({
                message: 'Recipient not found'
            })
        }
        // Logic to send friend request
        if (receiver.friends.includes(userId)) {
            return res.status(400).json({
                message: 'You are already friends with this user'
            })
        }
        // check if a request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: userId, receiver: reciptId },
                { sender: reciptId, receiver: userId }
            ]
        })
        if (existingRequest) {
            return res.status(400).json({
                message: 'Friend request already exists'
            })
        }
        const newFriendRequest = await FriendRequest.create({
            sender: userId,
            receiver: reciptId
        })
        res.status(StatusCodes.CREATED).json({
            message: 'Friend request sent successfully',
            newFriendRequest
        })
    } catch (error) {
        console.error('Error fetching friends:', error)
        res.status(500).json({
            message: 'Failed to fetch friends',
            error: error.message
        })
    }
}

const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params
        const request = await FriendRequest.findById(requestId)
        if (!request) {
            return res.status(404).json({
                message: 'Friend request not found'
            })
        }
        // verify that the current user is the receiver of the request
        if (request.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'You are not authorized to accept this friend request'
            })
        }
        // Logic to accept friend request
        request.status = 'accepted'
        await request.save()
        // Add both users to each other's friends list
        // $addToSet: add element to an array only if it doesn't already exist
        await User.findByIdAndUpdate(request.sender, {
            $addToSet: { friends: request.receiver }
        })
        await User.findByIdAndUpdate(request.receiver, {
            $addToSet: { friends: request.sender }
        })

        res.status(200).json('Friend request accepted successfully')
    } catch (error) {
        console.error('Error fetching friends:', error)
        res.status(500).json({
            message: 'Failed to fetch friends',
            error: error.message
        })
    }
}

const rejectFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params
        const request = await FriendRequest.findById(requestId)
        if (!request) {
            return res.status(404).json({
                message: 'Friend request not found'
            })
        }
        // verify that the current user is the receiver of the request
        if (request.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'You are not authorized to accept this friend request'
            })
        }
        // Logic to accept friend request
        request.status = 'rejected'
        await request.save()
        // Remove the request from the database
        await FriendRequest.findByIdAndDelete(requestId)
        res.status(200).json('Friend request rejected successfully')
    } catch (error) {
        console.error('Error fetching friends:', error)
        res.status(500).json({
            message: 'Failed to fetch friends',
            error: error.message
        })
    }
}

const getFriendRequest = async (req, res) => {
    try {
        const userId = req.user._id
        // Fetch incoming requests where the current user is the receiver
        const incomingReqs = await FriendRequest.find({
            receiver: userId,
            status: 'pending'
        }).populate(
            'sender',
            'fullName profilePicture nativeLanguage learningLanguage'
        )
        // Fetch accepted requests where the current user is the sender
        const acceptedReqs = await FriendRequest.find({
            sender: userId,
            status: 'accepted'
        }).populate('receiver', 'fullName profilePicture')
        // const friendRequests = [...incomingReqs, ...acceptedReqs]
        // if (!friendRequests || friendRequests.length === 0) {
        //   return res.status(404).json({
        //     message: 'No friend requests found'
        //   })
        // }
        // Logic to get friend requests
        res.status(200).json({ incomingReqs, acceptedReqs })
    } catch (error) {
        console.error('Error fetching friend requests:', error)
        res.status(500).json({
            message: 'Failed to fetch friend requests',
            error: error.message
        })
    }
}

const getOutgoingFriendRequest = async (req, res) => {
    try {
        const userId = req.user._id
        // Fetch incoming requests where the current user is the receiver
        const outgoingReqs = await FriendRequest.find({
            sender: userId,
            status: 'pending'
        }).populate(
            'receiver',
            'username profilePicture nativeLanguage learningLanguage'
        )
        res.status(200).json(outgoingReqs)
    } catch (error) {
        console.error('Error fetching outgoing friend requests:', error)
        res.status(500).json({
            message: 'Failed to fetch outgoing friend requests',
            error: error.message
        })
    }
}

export const userController = {
    getRecommendUser,
    getMyFriends,
    sendFriendRequest,
    acceptFriendRequest,
    getFriendRequest,
    getOutgoingFriendRequest,
    rejectFriendRequest
}