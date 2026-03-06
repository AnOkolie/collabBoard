import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

import { login, register } from "../controllers/auth.controller.js";

router.post("/login", login);
router.post("/signup", register);
router.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user),
);
// router.post("/logout", logout);

export default router;
