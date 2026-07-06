import express from "express";
import {
  addCards,
  updateCards,
  deleteCards,
  getCard,
  moveCard,
  getUpcomingTasks,
} from "../controllers/card.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/column/:column_id/cards", requireAuth, addCards);
router.put("/cards/:id", requireAuth, updateCards);
router.delete("/cards/:id", requireAuth, deleteCards);
router.get("/cards/:id", requireAuth, getCard);
router.patch("/cards/:id/move", requireAuth, moveCard);
router.get("/cards/tasks/:user_id", getUpcomingTasks);

export default router;
