import { Router } from "express"
const router = Router()
import {
  getProfile,
  putAddFriend,
  deleteFriend,
  getFriends,
  postAccount,
  editProfile,
} from "../controllers/profile.js"
import isAuth from "../middleware/is-auth.js"

router.get("/:userId", isAuth, getProfile)

router.put("/add-friend", isAuth, putAddFriend)

router.put("/remove-friend", isAuth, deleteFriend)

router.get("/friends", isAuth, getFriends)

router.post("/post-account", isAuth, postAccount)

router.post("/edit-profile", isAuth, editProfile)

export default router
