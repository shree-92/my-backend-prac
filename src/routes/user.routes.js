import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();


// POST endpoint for user registration
router.route('/register').post(
    upload.fields(
        [
            {
                name: "avatar",
                maxCount: 1 // read multer docs for more options
            },{
                name: "covers",
                maxCount: 1
            }
        ]
    ),
    registerUser
)

export default router;