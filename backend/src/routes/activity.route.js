import express from "express";
import { getActivity } from "../controllers/activity.controller.js";
const router = express.Router();

router.get("/activity-center/:user_id", getActivity);

export default router;
