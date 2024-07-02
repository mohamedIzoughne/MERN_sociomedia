import { Router } from 'express'
import {
  getNotifications,
  sendInvitation,
  getMessages,
} from '../controllers/chat.js'
import isAuth from '../middleware/is-auth.js'
const router = Router()

router.get('/notifications/:recipientId', isAuth, getNotifications)
router.get('/messages', getMessages)
router.put('/invitation/:notifiedId', isAuth, sendInvitation)

export default router
