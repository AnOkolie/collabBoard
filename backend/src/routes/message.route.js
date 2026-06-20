import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessagesById,
  createMessage,
  updateMessage,
  deleteMessage,
  addReaction,
} from "../controllers/messages.controller.js";
const router = express.Router();

router.post("/messages", protectRoute, createMessage);

router.patch("/messages/:messageId", protectRoute, updateMessage);

router.delete("/messages/:messageId", protectRoute, deleteMessage);

router.post("/messages/:messageId", protectRoute, addReaction);

router.get(
  "/messages/user/:user_id/conversation/:conversation_id",
  getMessagesById,
);

export default router;
