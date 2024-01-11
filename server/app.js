const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const authRoutes = require("./routes/auth")
const feedRoutes = require("./routes/feed")
const userRoutes = require("./routes/profile")
const User = require("./models/user")
const multer = require("multer")

const fileStorage = multer.diskStorage({
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
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use(bodyParser.json())
app.use("/images", express.static(path.join(__dirname, "images")))
app.use(multer({ storage: fileStorage, fileFilter }).single("image"))

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE",
    "OPTIONS"
  )
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
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

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT || 3000)
})

module.exports = app
