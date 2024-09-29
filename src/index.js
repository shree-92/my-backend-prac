import dotenv from "dotenv";
import dbConnect from "./db/index.js";
import express from "express";

import {app} from './app.js'

dotenv.config({
    path: './.env'
})

const port = process.env.PORT

dbConnect()
.then(()=>{
    app.listen(port || 8000) // same but still a good practice
    console.log(`server is running at port ${port}`);
    
})
.catch((err)=>{
    console.log("db connection failed", err);  
})