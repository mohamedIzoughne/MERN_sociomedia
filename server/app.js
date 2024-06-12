import express from 'express'
import { join, dirname } from 'path'
import bodyParser from 'body-parser'
import { connect } from 'mongoose'
const app = express()
import authRoutes from './routes/auth.js'
import feedRoutes from './routes/feed.js'
import userRoutes from './routes/profile.js'
import User from './models/user.js'
import multer, { diskStorage } from 'multer'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { getIO, init } from './socket.js'
import { createServer } from 'http'
import chatRoutes from './routes/chat.js'
import Message from './models/message.js'
import message from './models/message.js'
// import { Server } from 'socket.io'
// import { createServer } from 'http'
// const server = createServer(app)
// const io = new Server(server, {
//   cors: {
//     origin: '*', // Adjust this to your client origin
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['your-custom-header'],
//     credentials: true,
//   },
// })
const server = createServer(app)

dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const fileStorage = diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/'
    if (file.mimetype.startsWith('image/')) {
      uploadPath += 'images'
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath += 'videos'
    } else if (file.mimetype.startsWith('audio/')) {
      uploadPath += 'audios'
    } else if (file.mimetype.startsWith('application/')) {
      uploadPath += 'documents'
    }

    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
    )
  },
})

const fileFilter = (req, file, cb) => {
  const allowedMIMETypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/tiff',
    'image/svg+xml',

    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/mp4',
    'audio/aac',
    'audio/x-m4a',

    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/webm',

    'application/pdf',
    'text/plain',
    'application/rtf',
  ]

  if (allowedMIMETypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Unsupported file type'), false)
  }
}

app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(join(__dirname, 'uploads')))
app.use(multer({ storage: fileStorage, fileFilter }).single('image')) // should change it to 'file' instead of 'image'

// set headers
app.use((req, res, next) => {
  // cors
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  )
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  // caching
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  next()
})

app.use((req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      req.user = user
    })
    .then(() => next())
})

app.use('/chat', chatRoutes)
app.use('/profile', userRoutes)
app.use('/feed', feedRoutes)
app.use('/auth', authRoutes)

// Handle Errors:
app.use((error, req, res, next) => {
  const message = error.message
  let status = error.statusCode
  if (!status) {
    status = 500
  }

  return res.status(status).json({ message })
})

const users = {}

connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT || 3000)
    console.log('Running on Port', process.env.PORT || 3000)
    init(server).on('connection', (socket) => {
      socket.on('register', (userId) => {
        users[userId] = socket.id
      })

      socket.on('chat', async ({ senderId, receiverId, msg }) => {
        const receiverSocketId = users[receiverId]
        const message = new Message({
          creator: senderId,
          content: msg,
          recipient: receiverId,
        })
        await message.save()

        if (receiverSocketId) {
          socket.to(receiverSocketId).emit('chat', message)
        }
      })

      socket.on('disconnect', (socket) => {
        console.log('User disconnected ', socket.id) // deon't give me the socket id, maybe I should do something in frontend
        for (const userId in users) {
          if (users[userId === socket.id]) {
            delete users[userId]
            break
          }
        }
      })
    }) // we use the http server to establish the websocket connection: websockets uses http as a basis
  })
  .catch((err) => {
    console.log(err)
  })

export default app
