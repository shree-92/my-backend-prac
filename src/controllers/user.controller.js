import {asyncHandler} from "../utils/asyncHandler.js"

const registerUser = asyncHandler( (req,res) =>{
    res.status(200).json({
        messsage:"ok works fine"
    })
} )

export {registerUser}