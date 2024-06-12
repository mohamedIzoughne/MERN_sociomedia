import { Router } from 'express'
import { check, body } from 'express-validator'
import User from '../models/user.js'
const router = Router()
import { postSignUp, postLogin } from '../controllers/auth.js'

router.post(
  '/register',
  [
    body('fullName')
      .isLength({ min: 3 })
      .withMessage(
        'Name must be at least 3 characters long and only alphanumeric characters'
      ),
    body('email')
      .isEmail()
      .withMessage('Invalid email')
      .custom(async (value) => {
        const user = await User.findOne({ email: value })
        if (user) {
          const error = new Error('Email already exists')
          error.statusCode = 302
          throw error
        }
        return true
      }),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('location')
      .isLength({ min: 3 })
      .withMessage('Location must be at least 3 characters long'),
    body('work')
      .isLength({ min: 3 })
      .withMessage('Work must be at least 3 characters long'),
  ],
  postSignUp
)

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email')
      .custom(async (value) => {
        const user = await User.findOne({ email: value })
        if (!user) {
          const error = new Error('email or password is incorrect')
          error.statusCode = 401
          throw error
        }
        return true
      }),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  postLogin
)

export default router
