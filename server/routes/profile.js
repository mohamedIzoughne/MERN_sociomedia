import { Router } from 'express'
const router = Router()
import { check, body } from 'express-validator'
import {
  getProfile,
  putAddFriend,
  deleteFriend,
  getFriends,
  postAccount,
  editProfile,
} from '../controllers/profile.js'
import isAuth from '../middleware/is-auth.js'

router.get('/:userId', check('userId').isMongoId(), isAuth, getProfile)

router.put('/add-friend', body('friendId').isMongoId(), isAuth, putAddFriend)

router.put('/remove-friend', body('friendId').isMongoId(), isAuth, deleteFriend)

router.get('/friends', isAuth, getFriends)

router.post(
  '/post-account',
  body('platform').custom((value) => {
    const platform = Object.keys(value)[0]
    if (platform !== 'twitter' && platform !== 'linkedin') {
      const error = new Error('Invalid platform')
      error.statusCode = 409
      throw error
    }
    return true
  }),
  isAuth,
  postAccount
)

router.post(
  '/edit-profile',
  [
    body('fullName')
      .isLength({ min: 3 })
      .withMessage('Name must be at least 3 characters long'),
    body('location')
      .isLength({ min: 3 })
      .withMessage('Location must be at least 3 characters long'),
    body('work')
      .isLength({ min: 3 })
      .withMessage('Work must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email'),
    body('work')
      .isLength({ min: 3 })
      .withMessage('Work must be at least 3 characters long'),
  ],
  isAuth,
  editProfile
)

export default router
