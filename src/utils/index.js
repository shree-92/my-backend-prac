import dotenv from "dotenv";

import dbConnect from "../db/index.js";
import e from "express";

const port = process.env.PORT
const app = e()

dotenv.config({
    path: './env'
})

dbConnect()