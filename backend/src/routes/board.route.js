import express from "express";
import {
  addBoard,
  getBoard,
  renameBoard,
  deleteBoard,
} from "../controllers/board.controller.js";

const router = express.Router();
router.get("/boards/:user_id", getBoard);
router.post("/boards/:user_id", addBoard);
router.put("/boards/:board_id", renameBoard);
router.delete("/boards/:board_id", deleteBoard);
export default router;
