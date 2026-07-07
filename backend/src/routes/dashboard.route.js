import express from "express";
import {
  getCompletedTasks,
  getDashboardStats,
  getIncompleteTasks,
} from "../controllers/dashboard.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/dashboard/complete/:user_id", protectRoute, getCompletedTasks);
router.get("/dashboard/incomplete/:user_id", protectRoute, getIncompleteTasks);
router.get("/dashboard/:user_id", protectRoute, getDashboardStats);
export default router;
