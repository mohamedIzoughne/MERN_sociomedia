import express from "express"
import { join, dirname } from "path"
import bodyParser from "body-parser"
import { connect } from "mongoose"
const app = express()
import authRoutes from "./routes/auth.js"
import feedRoutes from "./routes/feed.js"
import userRoutes from "./routes/profile.js"
import User from "./models/user.js"
import multer, { diskStorage } from "multer"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
dotenv.config()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const fileStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images")
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    )
  },
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use(bodyParser.json())
app.use("/images", express.static(join(__dirname, "images")))
app.use(multer({ storage: fileStorage, fileFilter }).single("image"))

// set headers
app.use((req, res, next) => {
  // cors
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE",
    "OPTIONS"
  )
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  // caching
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate")
  next()
})

app.use((req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      req.user = user
    })
    .then(() => next())
})

app.use("/profile", userRoutes)
app.use("/feed", feedRoutes)
app.use("/auth", authRoutes)

// Handle Errors:
app.use((error, req, res, next) => {
  const message = error.message
  let status = error.statusCode
  if (!status) {
    status = 500
  }
  return res.status(status).json({ message })
})

connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT || 3000)
})

export default app
