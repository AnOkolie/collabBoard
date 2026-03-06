import express from "express";
import {
  addCards,
  updateCards,
  deleteCards,
  getCard,
} from "../controllers/card.controller.js";
import { get } from "node:http";
const router = express.Router();

router.post("/cards", addCards);
router.put("/cards/:id", updateCards);
router.delete("/cards/:id", deleteCards);
router.get("/cards/:id", getCard);

export default router;
