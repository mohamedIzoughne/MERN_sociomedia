import Post from "../models/post.js"
import User from "../models/user.js"

export async function createPost(req, res, next) {
  const { content } = req.body

  let imageUrl

  if (req.file) {
    imageUrl = req.file.path
  }

  try {
    const user = await User.findById(req.userId)
    const post = new Post({
      content,
      creator: {
        id: user._id,
        name: user.fullName,
        location: user.location,
        imageUrl: user.imageUrl,
      },
      comments: [],
      imageUrl,
    })

    await post.save()
    await user.addPost(post._id)
    await res.status(201).json({
      message: "Post created",
      post: post,
    })
  } catch (error) {
    next(error)
  }
}

export function getPosts(req, res, next) {
  const currentPage = req.query.page || 1
  const perPage = 10
  let totalItems
  // should limit the posts
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count

      return Post.find()
      // .skip((currentPage - 1) * perPage)
      // .limit(totalItems)
    })
    .then((posts) => {
      // if (posts.length === 0) {
      //   const error = new Error('No posts found') // should it be an error?
      //   error.statusCode =
      // }
      res.json({
        message: "getting posts succeeded",
        posts: posts.reverse(),
        totalItems,
      })
    })
    .catch((err) => next(err))
}

export async function getUserPosts(req, res, next) {
  const { userId } = req.params

  try {
    const posts = await Post.find({ "creator.id": userId })
    await res.json({ message: "Success", posts })
  } catch (err) {
    next(err)
  }
}

export async function deletePost(req, res, next) {
  const postId = req.params.postId
  const { userId } = req
  // should i check if post exists first
  try {
    const post = await Post.findById(postId)
    if (!post) {
      const error = new Error("Could not find post")
      error.statusCode = 404
      throw error
    }
    if (post.creatorId.toString() !== req.userId) {
      const error = new Error("Not authorized")
      error.statusCode = 403
      throw error
    }
    await Post.deleteOne({ _id: postId })
    const user = await User.findById(userId)
    await user.deletePost(postId)
    await res.json({ message: "post is deleted" })
  } catch (error) {
    next(error)
  }
}

export async function updatePost(req, res, next) {
  const postId = req.params.postId
  const updatedContent = req.body.newContent

  try {
    const post = await Post.findById(postId)
    if (!post) {
      const error = new Error("Could not find post")
      error.statusCode = 404
      throw error
    } else if (post.creatorId.toString() !== req.userId) {
      const error = new Error("Not authorized")
      error.statusCode = 403
      throw error
    }
    post.content = updatedContent
    await post.save()
    await res.status(301).json({ message: "Post updated", post })
  } catch (error) {
    next(error)
  }
}

export async function updateLikes(req, res, next) {
  const postId = req.params.postId
  const { action } = req.body
  try {
    const post = await Post.findById(postId)
    if (action === "increment") {
      await post.likeIncrement()
    } else {
      await post.likeDecrement()
    }
    await res.status(201).json({ message: "likes updated" })
  } catch (error) {
    next(error)
  }
}

export async function putAddComment(req, res, next) {
  const postId = req.params.postId
  const content = req.body.comment

  try {
    console.log("hello")
    const user = await User.findById(req.userId)
    const comment = {
      creatorId: req.userId,
      creatorName: user.fullName,
      content,
      creatorImageUrl: "",
    }
    const post = await Post.findById(postId)
    const updatedPost = await post.addComment(comment)
    await res.status(201).json({ post })
  } catch (error) {
    next(error)
  }
}
