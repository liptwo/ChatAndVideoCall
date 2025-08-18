import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'
// import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import User from '~/models/User.js'

const protectRoute = async (req, res, next) => {
  // console.log('Protecting route:', req.cookies)
  const token = req?.cookies?.jwt
  // || req.headers.authorization?.split(' ')[1]
  if (!token) {
    next(
      new ApiError(
        StatusCodes.UNAUTHORIZED,
        'You are not logged in! Please log in to get access.'
      )
    )
    return
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded || !decoded.userId) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token!'))
    }
    const userId = decoded.userId
    const user = await User.findById(userId).select('-password')
    if (!user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User not found!'))
    }
    req.user = user
    // const user = await User.findById(decoded.userId)
    // if (!user) {
    //   return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User not found!'))
    // }
    next()
  } catch (error) {
    if (error?.message === 'jwt expired') {
      next(
        new ApiError(
          StatusCodes.UNAUTHORIZED,
          'Token expired! Please log in again.'
        )
      )
      return
    }
    console.error('Error verifying token:', error)
    next(
      new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Invalid token! Please log in again.'
      )
    )
  }
}
export const authMiddleware = {
  protectRoute
}
