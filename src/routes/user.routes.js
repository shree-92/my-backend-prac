import { Router } from "express";
import { loginUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();


// POST endpoint for user registration
router.route('/register').post(
    upload.fields(
        [
            {
                name: "avatar",
                maxCount: 1 // read multer docs for more options
            },{
                name: "coverimage",
                maxCount: 1
            }
        ]
    ),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes

router.route("/logout").post(verifyJwt, logOutUser)

export default router;