import express from "express";
import { updateUser, deleteUser } from "../controllers/user.controller.js";
const router = express.Router();

router.patch("/users/:user_id", updateUser);
router.delete("/users/:user_id", deleteUser);

export default router;
