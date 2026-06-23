import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

import {
  login,
  register,
  logout,
  checkAuth,
  validUsername,
  refreshToken,
  verifyToken,
} from "../controllers/auth.controller.js";

router.post("/login", login);
router.post("/signup", register);
router.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user),
);
router.post("/check-auth", checkAuth);
router.post("/logout", logout);
router.get("/username-check", validUsername);
router.post("/refresh", refreshToken);
router.post("/me", verifyToken);

export default router;
