import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js' // Adjust the path as necessary
import jwt from 'jsonwebtoken'
import ApiError from '~/utils/ApiError.js'
import bcryptjs from 'bcryptjs'
import { upsertStreamUser } from '~/lib/stream.js'
export async function signup(req, res, next) {
    const { email, password, fullName } = req.body
    try {
        if (!email || !password || !fullName) {
            throw new ApiError(StatusCodes.CONFLICT, 'All fields are required')
        }
        if (password.length < 6) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                'Password must be at least 6 characters long'
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            throw new ApiError(StatusCodes.CONFLICT, 'Invalid email format')
        }

        const existingUser = await User.findOne({ email }) // Assuming User is a model you have defined
        if (existingUser) {
            throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
        }
        const idx = Math.floor(Math.random() * 100) + 1
        const avatarURL = `https://avatar.iran.liara.run/public/${idx}.png` // Example URL, replace with actual logic
        const newUser = await User.create({
            email,
            password,
            fullName,
            profilePicture: avatarURL
        })
        // console.log('New user created:', newUser)
        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePicture
            })
            console.log('Stream user created successfully for user:', newUser._id)
        } catch (error) {
            console.error('Failed to create Stream user:', error)
        }
        //
        // await newUser.save()
        // TODO: Create user in stream as well
        const token = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d' // Token expiration time}
            }
        )
        // Here you would typically save the user to the database
        // res
        //   .status(201)
        //   .json({
        //     message: 'User registered successfully',
        //     user: { email, fullName }
        //   })
        res.cookie('jwt', token, {
            httpOnly: true, // prevent XSS attacks
            sameSite: 'Strict', // prevent CSRF attacks
            secure: process.env.NODE_ENV === 'production', // use secure cookies in production
            // secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        res.status(StatusCodes.CREATED).json({
            message: 'User registered successfully',
            user: newUser
        })
    } catch (error) {
        console.error('Error during signup:', error)
        next(error) // This will be caught by the error handling middleware
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //   error: 'An error occurred during signup'
        // })
    }
}

export async function login(req, res, next) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Email and password are required'
            )
        }
        const user = await User.findOne({ email })
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
        }

        // console.log('User PAssword:', user.comparePassword(password))
        if (!user.comparePassword(password)) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid email or password')
        }
        // Here you would typically check the user's credentials against the database
        // For demonstration, we'll assume the login is successful
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Token expiration time
        )
        res.cookie('jwt', token, {
            httpOnly: true, // prevent XSS attacks
            sameSite: 'Strict', // prevent CSRF attacks
            secure: process.env.NODE_ENV === 'production', // use secure cookies in production
            // secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        res.status(StatusCodes.OK).json({
            message: 'User logged in successfully',
            user: { email }
        })
    } catch (error) {
        console.error('Error during login:', error)
        next(error) // This will be caught by the error handling middleware
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //   error: 'An error occurred during login'
        // })
    }
}

export function logout(req, res) {
    res.clearCookie('jwt', {
        httpOnly: true, // prevent XSS attacks
        sameSite: 'Strict' // prevent CSRF attacks
    })
    res.status(StatusCodes.OK).json({
        message: 'User logged out successfully'
    })
}
export async function onboarding(req, res, next) {
    // console.log('Onboarding user:', req.user)
    try {
        const userId = req.user._id
        const { fullName, bio, nativeLanguage, learningLanguage, location } =
            req.body
        if (
            !fullName ||
            !bio ||
            !nativeLanguage ||
            !learningLanguage ||
            !location
        ) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                `All fields are required. Missing fields: ${[
                    !fullName && 'fullName',
                    !bio && 'bio',
                    !nativeLanguage && 'nativeLanguage',
                    !learningLanguage && 'learningLanguage',
                    !location && 'location'
                ]
                    .filter(Boolean)
                    .join(', ')}`
            )
        }
        const updateUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true // Set onboarding status to true
        }, { new: true })

        if (!updateUser) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
        }
        console.log('User updated successfully:', updateUser)
        try {
            await upsertStreamUser({
                id: updateUser._id.toString(),
                name: updateUser.fullName,
                image: updateUser.profilePicture || ''
            })
            console.log('Stream user created successfully for user:', updateUser._id)
        } catch (error) {
            console.error('Failed to create Stream user:', error)
        }
        // console.log('Stream user updated successfully for user:', updateUser._id)
        res.status(StatusCodes.OK).json(
            {
                message: 'User onboarding completed successfully',
                user: { updateUser }
            }
        )
    } catch (error) {
        next(error) // This will be caught by the error handling middleware
    }
}

export const authController = {
    signup,
    login,
    logout,
    onboarding
}