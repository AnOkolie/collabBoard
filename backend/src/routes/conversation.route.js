import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessagesById } from "../controllers/messages.controller.js";
import {
  getUserConversations,
  getDirectConversation,
  getGroupConversation,
} from "../controllers/conversations.controller.js";
const router = express.Router();

router.get("/conversations/:user_id", protectRoute, getUserConversations);

router.get(
  "/conversations/:conversation_id/messages",
  protectRoute,
  getMessagesById,
);
router.get(
  "/conversations/direct/:user_id/search",
  protectRoute,
  getDirectConversation,
);

router.get("/conversations/group/:board_id", getGroupConversation);
export default router;
