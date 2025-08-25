import { StreamChat } from 'stream-chat'
import { StatusCodes } from 'http-status-codes'
import 'dotenv/config.js'
import ApiError from '../utils/ApiError.js'

const API_KEY = process.env.STEAM_API_KEY
const API_SECRET = process.env.STEAM_API_SECRET

if (!API_KEY || !API_SECRET) {
  console.error('Stream API credentials are not set')
}

const client = StreamChat.getInstance(API_KEY, API_SECRET)

export async function upsertStreamUser(userData) {
  try {
    await client.upsertUsers([userData])
    return userData
  } catch (error) {
    console.error('Error creating Stream user:', error)
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create Stream user'
    )
  }
}

export async function generateStreamToken(userId) {
  try {
    const userIdStr = userId.toString()
    const token = client.createToken(userIdStr)
    // console.log('token stream', token)
    return token
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to generate Stream token'
    )
  }
}

// export async function getStreamUser(userId) {
//   try {
//     const user = await client.queryUsers({ id: userId })
//     if (user.length === 0) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'Stream user not found')
//     }
//     return user[0]
//   } catch (error) {
//     console.error('Error fetching Stream user:', error)
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       'Failed to fetch Stream user'
//     )
//   }
// }

// export async function deleteStreamUser(userId) {
//   try {
//     await client.deleteUser(userId)
//   } catch (error) {
//     console.error('Error deleting Stream user:', error)
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       'Failed to delete Stream user'
//     )
//   }
// }
