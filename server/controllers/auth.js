import path from 'path'
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'

export const postSignUp = async (req, res, next) => {
  const { fullName, location, email, password, work } = req.body
  let imageUrl = path.join('uploads', 'images', 'default-user-avatar.png')

  if (req.file) {
    imageUrl = req.file.path
  }

  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg)
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
        twitter: '',
        linkedIn: '',
      },
      friends: [],
      profileViews: 0,
    })

    await newUser.save()

    await res.json({ data: newUser, message: 'Signed up successfully' })
  } catch (error) {
    next(error)
  }
}

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body
  const errors = validationResult(req)

  try {
    const user = await User.findOne({ email })

    if (!errors.isEmpty()) {

      const error = new Error(errors.array()[0].msg)
      error.statusCode = 422
      throw error
    }

    if (!user) {
      const error = new Error('There is no user with this email')
      error.statusCode = 401
      throw error
    }

    const doMatch = await bcrypt.compare(password, user.password)
    if (!doMatch) {
      const error = new Error('Password is incorrect')
      error.statusCode = 401
      throw error
    }
    const token = jwt.sign(
      {
        email: user.email,
        password: user.password,
        userId: user._id.toString(),
      },
      'someSuperSuperSecretKey',
      { expiresIn: '24h' }
    )
    req.userId = user.userId
    const expirationDate = new Date(Date.now() + 3600000)
    res
      .status(202)
      .json({ token: token, userId: user._id.toString(), expirationDate })
    return
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500
    }
    next(error)
    return error
  }
}

// export default { postSignUp, postLogin }
