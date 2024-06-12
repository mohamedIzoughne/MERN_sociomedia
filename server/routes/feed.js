import { Router } from 'express'
import { body, check } from 'express-validator'
import Post from '../models/post.js'
const router = Router()
import {
  createPost,
  getPosts,
  getUserPosts,
  deletePost,
  updatePost,
  updateLikes,
  putAddComment,
} from '../controllers/feed.js'
import isAuth from '../middleware/is-auth.js'

const validatePost = async (value, { req }) => {
  const post = await Post.findById(value)
  if (!post) {
    const error = new Error('Could not find post')
    error.statusCode = 404
    throw error
  }
  return true
}

router.post(
  '/new-post',
  [
    body('content').custom((value, { req }) => {
      if (!value && !req.file) {
        const error = new Error('Content is required')
        error.statusCode = 400
        throw error
      }
      return true
    }),
  ],
  isAuth,
  createPost
)

router.get('/posts', isAuth, getPosts)

router.get('/posts/:userId', check('userId').isMongoId(), isAuth, getUserPosts)

router.delete(
  '/delete-post/:postId',
  check('postId')
    .isMongoId()
    .custom((value, { req }) => {
      const post = Post.findById(value)
      if (!post) {
        const error = new Error('Could not find post')
        error.statusCode = 404
        throw error
      }
      if (post.creatorId.toString() !== req.userId) {
        const error = new Error('Not authorized')
        error.statusCode = 403
        throw error
      }
      return true
    }),
  isAuth,
  deletePost
)

router.put(
  '/update-post/:postId',
  check('postId')
    .isMongoId()
    .custom(async (value, { req }) => {
      const post = await Post.findById(value)
      if (!post) {
        const error = new Error('Could not find post')
        error.statusCode = 404
        throw error
      } else if (post.creatorId.toString() !== req.userId) {
        const error = new Error('Not authorized')
        error.statusCode = 403
        throw error
      }
      return true
    }),
  isAuth,
  updatePost
)

router.put(
  '/update-like/:postId',
  [
    check('postId').isMongoId().custom(validatePost),
    body('action').isIn(['increment', 'decrement']),
  ],
  isAuth,
  updateLikes
)

router.put(
  '/add-comment/:postId',
  check('postId').isMongoId().custom(validatePost),
  body('comment').trim().isLength({ min: 3 }),

  isAuth,
  putAddComment
)

export default router
