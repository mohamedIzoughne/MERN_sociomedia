import mongoose from 'mongoose'

const messageSchema = mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: String,
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    //   required: true,
  },
  { timeStamps: true }
)

// I'm not sure if we should use indexes or not
messageSchema.index({ creator: 1, recipient: 1 })

export default mongoose.model('Message', messageSchema)
