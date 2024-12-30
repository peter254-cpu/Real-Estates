import express from "express"
import { google, signIn, signUp, signOut } from "../controllers/auth.js"


const router = express.Router()

router.post("/auth/signup", signUp)
router.post("/auth/signin", signIn)
router.post("/auth/google", google)
router.get("/auth/logout", signOut)
export default router