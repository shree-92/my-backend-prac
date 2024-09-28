import dotenv from "dotenv";

import dbConnect from "../db/index.js";
import e from "express";

const port = process.env.PORT
const app = e()

dotenv.config({
    path: './env'
})

dbConnect()













// ;( async ()=>{
//     try {
//         await mongoose.connect(`${connectionStr}/${DB_NAME}`);
//         app.on("error", (error)=> console.log(error)
//         )
//         app.listen(port, ()=> console.log(`app is listenting on ${port}`)
//         )
//     } catch (error) {
//         console.log(error);
//         throw error;
//     }
// } )()