import jwt from "jsonwebtoken";
import cookie from "cookie";
import { ENV } from "../utils/env.js";
import { pool } from "../db/db.js";

export const socketAuthMiddleware = async (req) => {
  const rawCookie = req.headers.cookie;

  if (!rawCookie) {
    throw new Error("Unauthorized - No Cookie Header");
  }

  const cookies = cookie.parse(rawCookie);
  const token = cookies.token;

  if (!token) {
    throw new Error("Unauthorized - No Token Provided");
  }

  const { sub } = jwt.verify(token, ENV.JWT_SECRET);

  if (!sub) {
    throw new Error("Unauthorized - Invalid Token");
  }

  const result = await pool.query(
    "SELECT id, email, username, profilepic FROM users WHERE id = $1",
    [sub],
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
