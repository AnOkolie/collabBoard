import express from "express";
import {
  updateUser,
  deleteUser,
  updateProfile,
  findUserByName,
  getUserProfile,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.patch("/users/:user_id", updateUser);
router.delete("/users/:user_id", deleteUser);
router.patch("/user-image/:user_id", updateProfile);
router.get("/user/:user_id/search", findUserByName);
router.get("/profile/:user_id", getUserProfile);

export default router;
