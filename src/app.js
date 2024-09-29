import cookieParser from "cookie-parser"
import express, { urlencoded } from "express"
import cors from "cors"

const app = express()

app.use(cors({
    origin: '*',
    credentials:true
    // LEARN CORS THROUGH DOCS MAYBE , A LIL
}))

// EXPRESS CONFIGS
app.use(express.json({limit: "20kb"}))
app.use(urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js';

//routes decleration
app.use("/api/v1/users", userRouter);

export {app};