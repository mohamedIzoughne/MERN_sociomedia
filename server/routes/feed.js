import { Router } from "express"
const router = Router()
import {
  createPost,
  getPosts,
  getUserPosts,
  deletePost,
  updatePost,
  updateLikes,
  putAddComment,
} from "../controllers/feed.js"
import isAuth from "../middleware/is-auth.js"

router.post("/new-post", isAuth, createPost)

router.get("/posts", isAuth, getPosts)

router.get("/posts/:userId", isAuth, getUserPosts)

router.delete("/delete-post/:postId", isAuth, deletePost)

router.put("/update-post/:postId", isAuth, updatePost)

router.put("/update-like/:postId", isAuth, updateLikes)

router.put("/add-comment/:postId", isAuth, putAddComment)

export default router
