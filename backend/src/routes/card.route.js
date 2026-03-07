import express from "express";
import {
  addCards,
  updateCards,
  deleteCards,
  getCard,
  moveCard,
} from "../controllers/card.controller.js";
import { get } from "node:http";
const router = express.Router();

router.post("/column/:column_id/cards", addCards);
router.put("/cards/:id", updateCards);
router.delete("/cards/:id", deleteCards);
router.get("/cards/:id", getCard);
router.patch("/cards/:id/move", moveCard);

export default router;
