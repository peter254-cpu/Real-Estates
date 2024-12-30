import express from "express"
import { createListing, deleteListing, updateListing, getListing, getListings } from "../controllers/listing.js"
import { verifyUser } from "../utils/verifyUser.js"

const router = express.Router()

router.post('/listing/create', verifyUser, createListing)
router.delete('/listing/delete/:id', verifyUser, deleteListing)
router.post('/listing/update/:id', verifyUser, updateListing)
router.get('/listing/get/:id', getListing)
router.get('/listing/get', getListings)

export default router