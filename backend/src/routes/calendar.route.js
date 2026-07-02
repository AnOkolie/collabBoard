import express from "express";
import { getTaskDetails } from "../controllers/calendar.controller.js";

const router = express.Router();

router.get("/events/:user_id", getTaskDetails);

export default router;
