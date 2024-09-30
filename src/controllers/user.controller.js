import {asyncHandler} from "../utils/asyncHandler.js"
import  {ApiError} from "../utils/apiErrors.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiResponse.js"

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

    // error handling for missing files
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

export {registerUser,}