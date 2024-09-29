import cookieParser from "cookie-parser"
import express, { urlencoded } from "express"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
    // LEARN CORS THROUGH DOCS MAYBE , A LIL
}))

// EXPRESS CONFIGS
app.use(express.json({limit: "20kb"}))
app.use(urlencoded())
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'

//routes decleration
app.use("api/v1/users", userRouter)

export {app}