import { getIO } from '../socket.js'
import Notification from '../models/notification.js'
import User from '../models/user.js'
import Message from '../models/message.js'

export const sendInvitation = async (req, res, next) => {
  const notifiedId = req.params.notifiedId
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error('There is no user')
      error.statusCode = 404
      throw error
    }
    const notification = await new Notification({
      creator: {
        id: req.userId,
        name: user.fullName,
        imageUrl: user.imageUrl,
      },
      recipient: notifiedId,
      type: 'invitation',
    })
    await notification.save()
  } catch (error) {
    next(error)
  }
}

export const getNotifications = async (req, res, next) => {
  const recipientId = req.params.recipientId
  try {
    const notifications = await Notification.find({ recipient: recipientId })

    await res.json({ notifications })
    await Notification.deleteMany({
      recipient: recipientId,
      type: { $ne: 'invitation' },
    })
  } catch (err) {
    next(err)
  }
}

export const getMessages = async (req, res, next) => {
  const { user1, user2 } = req.query

  try {
    const messages = await Message.find({
      $or: [
        { creator: user1, recipient: user2 },
        { creator: user2, recipient: user1 },
      ],
    }).sort({ createdAt: 'desc' })

    await res.json({ messages })
  } catch (err) {
    next(err)
  }
}
