import moogse from 'mongoose'

const friendRequestSchema = new moogse.Schema(
  {
    sender: {
      type: moogse.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: moogse.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  { timestamps: true }
)

const FriendRequest = moogse.model('FriendRequest', friendRequestSchema)

export default FriendRequest