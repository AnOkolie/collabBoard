import express from "express";
import { getFriendRequestReceived } from "../controllers/friends.controller.js";
const router = express.Router();

router.get("/friend/:user_id", getFriendRequestReceived);

export default router;
