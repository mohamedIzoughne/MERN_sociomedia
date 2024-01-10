const express = require("express")
const router = express.Router()
const feedController = require("../controllers/feed")
const isAuth = require("../middleware/is-auth")

router.post("/new-post", isAuth, feedController.createPost)

router.get("/posts", isAuth, feedController.getPosts)

router.get("/posts/:userId", isAuth, feedController.getUserPosts)

router.delete("/delete-post/:postId", isAuth, feedController.deletePost)

router.put("/update-post/:postId", isAuth, feedController.updatePost)

router.put("/update-like/:postId", isAuth, feedController.updateLikes)

router.put("/add-comment/:postId", isAuth, feedController.putAddComment)

module.exports = router
