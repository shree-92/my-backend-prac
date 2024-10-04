import {asyncHandler} from "../utils/asyncHandler.js"
import  {ApiError} from "../utils/apiErrors.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { response } from "express"

const generateRefreshAndAccessTOKEN = async(userID)=>{
    try {
        const user = await User.findById(userID);
        const accessToken =user.generateAccessToken()
        const refreshToken =user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

    } catch (error) {
        throw new ApiError(500, "failed to generate access and refresh tokens");
        
    }
}

const registerUser = asyncHandler( async (req,res) =>{
    // gets user details from front end
    // validating the given data
    // check if user already exist check by using username and email
    // check for images, check for avatar
    // upload them to cloudinary
    // create an object - create entry in db { db calls }
    // remove pass and refresh token from response
    // check for user creation
    // return response

    //step one done got data from postman
    const {fullname, email, username, password} = req.body;
    console.log(email, fullname, password);

    // error handling for missing fields
    if(
        [fullname, email, username, password].some( (fields) => fields?.trim() === "" )
    ){
        throw new ApiError(400, 'all fields are needed')
    }

    // connecting to DB and finding if the user already exists
    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    })

    if(existedUser){
        throw new ApiError(409, "user with this username and email already exists")
    }

    // check for images
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverimageLocalPath = req.files?.coverimage[0]?.path;

    // below block helps to make it optional and will only check for url if its uploaded 
    let coverimageLocalPath;
    if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        coverimageLocalPath = req.files.coverimage[0].path;
    }


    // check for avatar 
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is needed")
    }
    // uploading avatar to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverimage = await uploadOnCloudinary(coverimageLocalPath)
    
    if(!avatar){
        throw new ApiError(400, "avatar file is needed")
    }
    
    // createing database entry
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverimage?.url || "", // ? here is imp if want to make it optional and not cause errors
        email,
        password,
        username: username.toLowerCase(),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" // by default everything is selected negative ones are not
    )

    // MAKING sure that user is created on db
    if (!createdUser) {
        throw new ApiError(500, "failed to create user entry in data base")
    }

    // api response

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user has been registerd" )
    )
} )

const loginUser = asyncHandler( async(req, res)=>{
    // TODOS for login controller logic
    // req body se data of username email password
    // find the user 
    // if user found check the password
    //grant access and refresh token
    // send in form of secured cookie
    // response that logged  in

    // declaring what we need from the user
    const {username, email, password} = req.body;

    // error hanndling incase of no username or pass
    if(!username || !email){
        throw new ApiError(400, "username or email one of them required")
    }

    //finding the user from our data base
    //based on username and email
    const user = await User.findOne({
        $or: [{username},{email}]
    })

    // checking if such users exist on our data base or not
    if(!user){
        throw new ApiError(404, "such user does not exist in our data base")
    }

    // checking if the given pass is valid or not
    const isPasswordValid = await user.isPasswordCorrect(password) // here password came for req.body

    // error if pass is wrong
    if(!isPasswordValid){
        throw new ApiError(401,"given pass is incorrect")
    }

    const {accessToken, refreshToken} = await generateRefreshAndAccessTOKEN(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //cookies
    const options = {
        //only server will able to modify cookies now
        httpOnly:true,
        secure:true,
    }

    // sending cookies with access and refresh token
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)

    new ApiResponse(200,{user: loggedInUser, accessToken, refreshToken},"user logged in")
})

// imp to remove the refresh token when logging out
const logOutUser = asyncHandler( async(req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new:true
        }
    )

    const options = {
        //only server will able to modify cookies now
        httpOnly:true,
        secure:true,
    }

    return response
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "user successfully logged out"))
})

export {
    registerUser,
    loginUser,
    logOutUser
}