import express from "express";
import {
  addBoard,
  getBoard,
  renameBoard,
  deleteBoard,
  getAllBoardDetails,
  getBoardMembers,
} from "../controllers/board.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();
router.get("/boards/:user_id", requireAuth, getBoard);
router.post("/boards/:user_id", requireAuth, addBoard);
router.put("/boards/:board_id", requireAuth, renameBoard);
router.delete("/boards/:board_id", requireAuth, deleteBoard);
router.get("/board-history-summary/:user_id", getAllBoardDetails);
router.get("/boards/members/:board_id", getBoardMembers);
export default router;
