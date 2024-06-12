import { getIO } from '../socket.js'
import Notification from '../models/notification.js'
import User from '../models/user.js'
import Message from '../models/message.js'
import { error } from 'console'

export const messages = (req, res, next) => {
  const { message } = req.body
  const users = {}

  // getIO().emit('messages', { action: 'create', message })
  const socket = getIO()
  socket.on('register', (userId) => {
    users[userId] = socket.id
  })
  console.log(users)
  // getIO().on('chat', (msg) => {

  // })

  res.json({ message: 'message added' })
}

export const sendInvitation = async (req, res, next) => {
  const notifiedId = req.params.notifiedId
  console.l
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

export const getMessages = (async (req, res, next) => {
  const { user1, user2 } = req.query;
  try {
    const messages = await Message.find({
      $or: [
        { creator: user1, recipient: user2 },
        { creator: user2, recipient: user1 }
      ]
    })
    

    res.json({messages});
  } catch (err) {
    next(err)
  }
});