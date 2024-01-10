const User = require("../models/user")

exports.getProfile = async (req, res, next) => {
  const userId = req.params.userId

  try {
    const user = await User.findById(userId)
    if (!user) {
      const error = new Error("User not found")
      error.statusCode = 404
      throw error
    }
    await res.json({ user })
  } catch (error) {
    next(error)
  }
}

exports.putAddFriend = async (req, res, next) => {
  const friendId = req.body.friendId

  try {
    const user = await User.findById(req.userId)
    if (!user) {
      const error = new Error("User not found")
      error.statusCode = 404
      throw error
    }

    const friend = await User.findById(friendId)
    const userFriends = [...user.friends]
    const friendFriends = [...friend.friends]

    const friendExists =
      userFriends.findIndex((fr) => fr.friendId.toString() === friendId) >= 0
    const userExists =
      friendFriends.findIndex(
        (fr) => fr.friendId.toString() === user._id.toString()
      ) >= 0

    if (friendExists || userExists) {
      const error = new Error("Friend already exists")
      error.statusCode = 409
      throw error
    } else {
      userFriends.push({
        friendId,
        name: friend.fullName,
        location: friend.location,
        imageUrl: friend.imageUrl,
      })
      user.friends = userFriends
      friendFriends.push({
        friendId: user._id,
        name: user.fullName,
        location: user.location,
        imageUrl: user.imageUrl,
      })
      friend.friends = friendFriends

      await user.save()
      await res.json({ message: "Friend added" })
    }
  } catch (error) {
    next(error)
  }
}

exports.deleteFriend = (req, res, next) => {
  const friendId = req.body.friendId
  let updatedFriends
  User.findById(req.userId).then((user) => {
    if (!user) {
      const error = new Error("User not found")
      error.statusCode = 404
      throw error
    }
    updatedFriends = [...user.friends].filter((fr) => {
      return fr.friendId.toString() !== friendId.toString()
    })

    user.friends = updatedFriends
    return user
      .save()
      .then(() => {
        return User.findById(friendId)
      })
      .then((friend) => {
        if (!friend) {
          const error = new Error("User not found")
          error.statusCode = 404
          throw error
        }
        const updatedFriends = [...friend.friends].filter((fr) => {
          return fr.friendId.toString() !== user._id.toString()
        })
        friend.friends = updatedFriends
        return friend.save()
      })
      .then(() => {
        res.json({ message: "friend removed", friends: updatedFriends })
      })
      .catch((err) => {
        next(err)
      })
  })
}

exports.getFriends = (req, res, next) => {
  // it's more performant to put friends information without populating
  // const friends = req.user.friends
  return User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User doesn't exist")
        error.statusCode = 404
        throw error
      }
    })
    .populate("friends.friendId")
    .then((user) => {
      return user.friends
    })
    .then((friends) => {
      res.json({ friends })
    })
    .catch((err) => {
      next(err)
    })
}

exports.postAccount = (req, res, next) => {
  const { userId } = req
  const { platform } = req.body

  User.findById(userId)
    .then(async (user) => {
      if (!user) {
        const error = new Error("User not found")
        error.statusCode = 404
        throw error
      }
      const key = Object.keys(platform)[0]
      user.socialProfiles[key] = platform[key]
      await user.save()
      res.json({ profile: user.socialProfiles[key] })
    })
    .catch((err) => next(err))
}

exports.editProfile = (req, res, next) => {
  const { fullName, email, location, work } = req.body
  let imageUrl
  if (req.file) {
    imageUrl = req.file.path
  }
  const userInfo = { fullName, email, location, work, imageUrl }
  const userId = req.userId

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found")
        error.statusCode = 404
        throw error
      }
      for (const key in userInfo) {
        if (userInfo[key]) user[key] = userInfo[key]
      }

      return user.save()
    })
    .catch((err) => next(err))
}
