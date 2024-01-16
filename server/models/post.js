import { Schema, Types, model } from "mongoose"

const postSchema = Schema(
  {
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    creator: {
      type: {
        id: {
          type: Types.ObjectId,
          ref: "User",
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
      type: Number,
      default: 0,
    },
    comments: {
      type: [
        {
          content: String,
          creatorId: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
          },
          creatorName: String,
          creatorImageUrl: String,
        },
      ],
    },
  },
  { timestamps: true }
)

postSchema.methods.likeIncrement = function () {
  this.likes++

  return this.save()
}

postSchema.methods.likeDecrement = function () {
  this.likes--

  return this.save()
}

postSchema.methods.addComment = function (comment) {
  const updatedComments = [...this.comments, comment]

  this.comments = updatedComments
  return this.save()
}

export default model("Post", postSchema)
