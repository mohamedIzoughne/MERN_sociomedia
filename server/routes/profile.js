const express = require("express")
const router = express.Router()
const profileController = require("../controllers/profile")
const isAuth = require("../middleware/is-auth")

router.get("/:userId", isAuth, profileController.getProfile)

router.put("/add-friend", isAuth, profileController.putAddFriend)

router.put("/remove-friend", isAuth, profileController.deleteFriend)

router.get("/friends", isAuth, profileController.getFriends)

router.post("/post-account", isAuth, profileController.postAccount)

router.post("/edit-profile", isAuth, profileController.editProfile)

module.exports = router
