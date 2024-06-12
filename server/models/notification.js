import mongoose from 'mongoose'

const notificationSchema = mongoose.Schema(
  {
    creator: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: false,
      },
      imageUrl: {
        type: String,
        required: false,
      },
      //   required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'comment', 'invitation'],
      required: true,
    },
  },
  { timeStamps: true }
)

notificationSchema.index({ 'creator.id': 1, recipient: 1 })

export default mongoose.model('Notification', notificationSchema)
