import jwt from "jsonwebtoken";
import { ENV } from "../utils/env.js";
import { pool } from "../db/db.js";

export const protectRoute = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
      throw new Error("Missing authentication headers");
    }
    const token = authHeaders.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, ENV.ACCESS_SECRET);
    if (!decoded)
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [
      decoded.id,
    ]);
    if (!user.rows[0])
      return res.status(404).json({ message: "User not found" });

    req.user = { ...user.rows[0], password: undefined }; //add this custom user to the next function
    next();
  } catch (error) {
    console.error("Error protecting route:", error);
    return res.status(401).json({ message: "Internal Server Error" });
  }
};

export const requireAuth = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders) return;
  const token = authHeaders.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const { id } = jwt.verify(token, ENV.ACCESS_SECRET);
    req.userId = id;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
