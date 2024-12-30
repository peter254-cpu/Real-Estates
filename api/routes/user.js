import express from "express"
import { test, updateUser, deleteUser, getUserListing, getUser } from "../controllers/user.js"
import { verifyUser } from "../utils/verifyUser.js"

const router = express.Router()

router.post('/user/update/:id', verifyUser, updateUser)
router.delete('/user/delete/:id', verifyUser, deleteUser)
router.get('/user/listings/:id', verifyUser, getUserListing)
router.get('/user/:id', verifyUser, getUser)


export default router