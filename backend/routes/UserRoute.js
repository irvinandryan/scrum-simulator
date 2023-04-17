import express from "express";
import {
    register,
    login,
} from "../controllers/UserController.js"; // import the controller functions

const router = express.Router();

router.post('/register', register); // POST a user
router.post('/login', login); // POST a user

export default router;