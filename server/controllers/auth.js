const path = require("path")
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.postSignUp = async (req, res, next) => {
  const { fullName, location, email, password, work } = req.body
  let imageUrl = path.join("..", "images", "default-user-avatar.png")

  if (req.file) {
    imageUrl = req.file.path
  }

  try {
    const user = await User.findOne({ email })
    if (user) {
      const error = new Error("This profile does already exist")
      error.statusCode = 302
      throw error
    }

    const hashedPassword = await bcrypt.genSalt(12).then((salt) => {
      return bcrypt.hash(password, salt)
    })

    const newUser = new User({
      fullName,
      location,
      email,
      work,
      imageUrl,
      password: hashedPassword,
      profileImageUrl: imageUrl,
      socialProfiles: {
        twitter: "",
        linkedIn: "",
      },
      friends: [],
      profileViews: 0,
    })

    await newUser.save()

    await res.json({ data: newUser, message: "Signed up successfully" })
  } catch (error) {
    next(error)
  }
}

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      const error = new Error("There is no user with this email")
      error.statusCode = 401
      throw error
    }
    const doMatch = await bcrypt.compare(password, user.password)
    if (!doMatch) {
      const error = new Error("Password is incorrect")
      error.statusCode = 401
      throw error
    }
    const token = jwt.sign(
      {
        email: user.email,
        password: user.password,
        userId: user._id.toString(),
      },
      "someSuperSuperSecretKey",
      { expiresIn: "1h" }
    )
    req.userId = user.userId
    const expirationDate = new Date(Date.now() + 3600000)
    res
      .status(202)
      .json({ token: token, userId: user._id.toString(), expirationDate })
  } catch (error) {
    next(error)
  }

  // User.findOne({ email })
  //   .then((user) => {
  //     loadedUser = user
  //     if (!user) {
  //       const error = new Error('There is no user with this email')
  //       error.statusCode = 401
  //       throw error
  //     }

  //     return bcrypt.compare(password, user.password)
  //   })
  //   .then((doMatch) => {
  //     if (!doMatch) {
  //       const error = new Error('Password is incorrect')
  //       error.statusCode = 401
  //       throw error
  //     }
  //     const token = jwt.sign(
  //       { email: loadedUser.email, password: loadedUser.password, userId: loadedUser._id.toString() },
  //       'someSuperSuperSecretKey',
  //       { expiresIn: '1h' }
  //     )
  //       req.userId = loadedUser.userId
  //       const expirationDate = new Date(Date.now() + 3600000)
  //     res.status(202).json({ token: token, userId: loadedUser._id.toString(), expirationDate })
  //   })
  //   .catch((error) => {
  //     next(error)
  //   })
}
