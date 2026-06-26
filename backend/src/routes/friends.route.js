import express from "express";
import {
  getAllFriends,
  getFriendRequestReceived,
} from "../controllers/friends.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/friend/:user_id", protectRoute, getFriendRequestReceived);
router.get("/friends/:user_id", getAllFriends);

export default router;
