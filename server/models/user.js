import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  imageUrl: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  friends: {
    type: [
      {
        friendId: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        location: {
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
        },
      },
    ],
  },
  location: {
    type: String,
  },
  work: {
    type: String,
  },
  profileViews: {
    type: Number,
    default: 0,
  },
  socialProfiles: {
    type: {
      twitter: String,
      linkedin: String,
    },
  },
  posts: {
    type: [
      {
        postId: {
          type: mongoose.Types.ObjectId,
          ref: 'Post',
          required: true,
          unique: true
        },
      },
    ],
  },
  impressionsOnPosts: {
    type: Number,
    default: 0,
  },
})

userSchema.index({email: 1, password: 1})

userSchema.methods.addPost = function (postId) {
  const updatedPosts = [...this.posts, { postId }]
  this.posts = updatedPosts

  return this.save()
}

userSchema.methods.deletePost = function (postId) {
  this.posts.pull(postId)
  return this.save()
}

export default mongoose.model('User', userSchema)
