import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"; // Check this path

const router = Router();

// POST endpoint for user registration
router.route('/register').post(registerUser)

export default router;