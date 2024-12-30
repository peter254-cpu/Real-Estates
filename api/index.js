import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import userRouter from './routes/user.js'
import authRouter from './routes/auth.js'
import ListingRouter from './routes/listing.js'
import cors from "cors"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";


const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({ origin:true, credentials:true }));



//routes
app.use('/api', userRouter)
app.use('/api', authRouter)
app.use('/api', ListingRouter)

//middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error"
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})
dotenv.config()
const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`)
    })
}).catch((err) => {
    console.log(err)
})



