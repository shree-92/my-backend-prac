import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required:true,
            uniquw:true,
            lowercase:true,
            trim:true,
            index: true
        },
        email: {
            type: String,
            required:true,
            uniquw:true,
            lowercase:true,
            trim:true,
        },
        fullname: {
            type: String,
            required:true,
            trim:true,
        },
        avatar:{
            type:String, // cloudnary will give us a string to store images
            required:true
        },
        coverimage:{
            type:String
        },
        watchhistory:[
            {
                type: Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true, "password is needed"]
        },
        refreshToken:{
            type:String,

        }
        
    }, {timestamps:true}
)

userSchema.pre("save", async function(next){
    if(this.isModified("password")) return next(); // logic for password encryption if not done this way mongoose will encrypt pass each any other field is changed by doing this pass word will only be encrypted if its modified/change
        this.password = bcrypt.hash(this.password, 10)
} )

// making an custom methods to verify password

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password) // asking bcrypt to check the pass hashing algos take time so await
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign(// payload, accesstoken, expiry, 
        {
            //payload key: value coming from data base
            _id: this._id,
            username: this.username,
            email: this.email,
            fullName: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(// payload, accesstoken, expiry, 
        {
            //payload key: value coming from data base
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)