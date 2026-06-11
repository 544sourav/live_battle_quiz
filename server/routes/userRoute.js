import express from "express";
import {
  getUserById,
  updateUserDetails,
  getUserDetails,
  updateUserProfilePicture,
} from "../controllers/user.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/profile", authMiddleware, getUserDetails);
router.put("/profile/update", authMiddleware, updateUserDetails);
router.put("/profile/picture", authMiddleware, updateUserProfilePicture);

export default router;
