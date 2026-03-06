import express from "express";
import {
  addColumn,
  deleteColumn,
  getBoardColumns,
} from "../controllers/column.controller.js";
const router = express.Router();
router.post("/boards/:id/columns", addColumn);
router.delete("/boards/:board_id/columns/:column_id", deleteColumn);
router.get("/boards/:board_id/columns", getBoardColumns);

export default router;
