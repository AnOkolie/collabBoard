import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessagesById } from "../controllers/messages.controller.js";
import {
  getUserConversations,
  createDirectConversation,
  createGroupConversation,
  getDirectConversation,
} from "../controllers/conversations.controller.js";
const router = express.Router();

router.get("/conversations/:user_id", protectRoute, getUserConversations);

router.post("/conversations/direct", protectRoute, createDirectConversation);

router.post("/conversations/group", protectRoute, createGroupConversation);

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
export default router;
