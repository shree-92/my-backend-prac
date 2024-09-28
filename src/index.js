import dotenv from "dotenv";

import dbConnect from "./db/index.js";
import e from "express";

const port = process.env.PORT
const app = e()

dotenv.config({
    path: './env'
})

dbConnect()
.then(()=>{
    app.listen(port || 8000) // same but still a good practice
    console.log(`server is running at port ${port}`);
    
})
.catch((err)=>{
    console.log("db connection failed", err);  
})