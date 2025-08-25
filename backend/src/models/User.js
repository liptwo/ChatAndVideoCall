import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'
import ApiError from '~/utils/ApiError'

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    bio: {
      type: String,
      default: '' // Default bio
    },
    profilePicture: {
      type: String,
      default: 'https://example.com/default-profile-picture.png' // Default profile picture URL
    },
    nativeLanguage: {
      type: String,
      default: '' // Default native language
    },
    learningLanguage: {
      type: String,
      default: '' // Default learning language
    },
    location: {
      type: String,
      default: '' // Default location
    },
    isOnboarded: {
      type: Boolean,
      default: false // Default onboarding status
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
    // followers: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    // }],
    // following: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    // }],
  },
  { timestamps: true }
)

// TODO: Explain this once agian
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next() // Only hash the password if it has been modified
  try {
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.comparePassword = function (candidatePassword) {
  // bcryptjs.compareSync(password, user.password)
  const isMatch = bcryptjs.compareSync(candidatePassword, this.password)
  return isMatch
}

const User = mongoose.model('User', userSchema)

export default User
