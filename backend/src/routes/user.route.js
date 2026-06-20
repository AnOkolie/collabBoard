import express from "express";
import {
  updateUser,
  deleteUser,
  updateProfile,
  findUserByName,
} from "../controllers/user.controller.js";
const router = express.Router();

router.patch("/users/:user_id", updateUser);
router.delete("/users/:user_id", deleteUser);
router.patch("/user-image/:user_id", updateProfile);
router.get("/user/:user_id/search", findUserByName);

export default router;
