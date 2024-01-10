const mongoose = require("mongoose")

const postSchema = mongoose.Schema(
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
          type: mongoose.Types.ObjectId,
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
            type: mongoose.Types.ObjectId,
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

module.exports = mongoose.model("Post", postSchema)
