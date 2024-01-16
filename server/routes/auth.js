import { Router } from "express"
const router = Router()
import { postSignUp, postLogin } from "../controllers/auth.js"

router.post("/register", postSignUp)

router.post("/login", postLogin)

export default router
