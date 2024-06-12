import { Router } from 'express'
import {
  messages,
  getNotifications,
  sendInvitation,
  getMessages
} from '../controllers/chat.js'
import isAuth from '../middleware/is-auth.js'
const router = Router()

router.get('/notifications/:recipientId', getNotifications)
router.get('/messages', getMessages)
router.put('/invitation/:notifiedId', isAuth, sendInvitation)
router.get('/messages', messages)

export default router
