import { Schema, Types, model } from 'mongoose'

const postSchema = Schema(
  {
    content: {
      type: String,
    },
    fileUrl: {
      type: String,
      required: false,
    },
    fileType: {
      type: String,
      enum: ['image', 'video', 'audio', 'application'],
      required: false,
    },
    creator: {
      type: {
        id: {
          type: Types.ObjectId,
          ref: 'User',
          required: true,
        },
        name: {
          type: String,
        },
        location: {
          type: String,
        },
        imageUrl: {
          type: String,
        },
      },
      required: true,
    },
    likes: {
      type: Map,
      default: {},
    },
    comments: {
      type: [
        {
          content: String,
          creatorId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
          },
          creatorName: String,
          creatorImageUrl: String,
        },
      ],
    },
    likedByUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

postSchema.methods.likeIncrement = function (userId) {
  if (!this.likes.get(userId)) {
    this.likes.set(userId, userId)
  }

  return this.save()
}

postSchema.methods.likeDecrement = function (userId) {
  this.likes.delete(userId)

  return this.save()
}

postSchema.methods.addComment = function (comment) {
  const updatedComments = [...this.comments, comment]

  this.comments = updatedComments
  return this.save()
}

export default model('Post', postSchema)
