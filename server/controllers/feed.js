import Post from '../models/post.js'
import User from '../models/user.js'
import Notification from '../models/notification.js'
import { validationResult } from 'express-validator'

export async function createPost(req, res, next) {
  const { content } = req.body
  let fileUrl = ''
  let fileType = ''

  if (req.file) {
    fileUrl = req.file.path
    fileType = req.file.mimetype.split('/')[0]
  }

  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg)
      throw error
    }

    const user = await User.findById(req.userId)
    const post = new Post({
      content: content || '',
      creator: {
        id: user._id,
        name: user.fullName,
        location: user.location,
        imageUrl: user.imageUrl,
      },
      comments: [],
      fileUrl,
    })

    if (fileType) {
      post.fileType = fileType
    }

    await post.save()
    await user.addPost(post._id)
    await res.status(201).json({
      message: 'Post created',
      post: post,
    })
  } catch (error) {
    next(error)
  }
}

export function getPosts(req, res, next) {
  const currentPage = req.query.page || 1
  const pageCount = req.query.count || 1
  const perPage = 10 * pageCount
  let totalItems
  // should limit the posts
  Post.find()
    .skip((currentPage - 1) * perPage)
    .limit(perPage)
    .then((posts) => {
      posts.forEach((post) => {
        if (post.likes.get(req.userId)) {
          post.likedByUser = true
        }
      })
      res.json({
        message: 'getting posts succeeded',
        posts: posts.reverse(),
        totalItems,
      })
    })
    .catch((err) => next(err))
}

export async function getUserPosts(req, res, next) {
  const { userId } = req.params

  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg)
      throw error
    }

    const posts = await Post.find({ 'creator.id': userId })
    await posts.forEach((post) => {
      if (post.likes.get(req.userId)) {
        post.likedByUser = true
      }
    })
    await res.json({ message: 'Success', posts: posts.reverse() })
  } catch (err) {
    next(err)
  }
}

export async function deletePost(req, res, next) {
  const postId = req.params.postId
  const { userId } = req
  // should i check if post exists first
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg)
      throw error
    }

    await Post.deleteOne({ _id: postId })
    const user = await User.findById(userId)
    await user.deletePost(postId)
    await res.json({ message: 'post is deleted' })
  } catch (error) {
    next(error)
  }
}

export async function updatePost(req, res, next) {
  const postId = req.params.postId
  const updatedContent = req.body.newContent

  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg)
      throw error
    }

    const post = await Post.findById(postId)
    post.content = updatedContent
    await post.save()
  } catch (error) {
    next(error)
  }
}

export async function updateLikes(req, res, next) {
  const postId = req.params.postId
  const { action } = req.body
  const postUserId = req.body.userId

  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg)
      throw error
    }

    const post = await Post.findById(postId)
    const user = await User.findById(req.userId)
    const postUser = await User.findById(postUserId)

    if (action === 'increment') {
      await post.likeIncrement(req.userId)

      if (postUserId !== req.userId) {
        const notification = await new Notification({
          creator: {
            id: req.userId,
            name: user.fullName,
            imageUrl: user.imageUrl,
          },
          recipient: postUserId,
          type: 'like',
        })
        postUser.impressionsOnPosts++
        await notification.save()
        await postUser.save()
      }
    } else {
      await post.likeDecrement(req.userId)
    }

    await res.status(201).json({ message: 'likes updated' })
  } catch (error) {
    next(error)
  }
}

export async function putAddComment(req, res, next) {
  const postId = req.params.postId
  const content = req.body.comment
  const postUserId = req.body.userId

  try {
    const user = await User.findById(req.userId)
    const comment = {
      creatorId: req.userId,
      creatorName: user.fullName,
      content,
      creatorImageUrl: user.imageUrl,
    }
    const post = await Post.findById(postId)
    await post.addComment(comment)
    if (postUserId !== req.userId) {
      const notification = await new Notification({
        creator: {
          id: req.userId,
          name: user.fullName,
          imageUrl: user.imageUrl,
        },
        recipient: postUserId,
        type: 'comment',
      })

      user.impressionsOnPosts++
      await notification.save()
      await user.save()
    }
    await res.status(201).json({ post })
  } catch (error) {
    next(error)
  }
}
