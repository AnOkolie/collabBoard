import jwt from "jsonwebtoken";
import cookie from "cookie";
import { ENV } from "../utils/env.js";
import { pool } from "../db/db.js";
import { prisma } from "../db/prisma.js";

export const socketAuthMiddleware = async (req) => {
  const url = new URL(req.url, "http://localhost:3000");
  const token = url.searchParams.get("token");

  if (!token) {
    throw new Error("Unauthorized - No Token Provided");
  }
  try {
    const { id, email } = jwt.verify(token, ENV.ACCESS_SECRET);

    if (!id) {
      throw new Error("Unauthorized - Invalid Token");
    }
    const result = await prisma.users.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        profilepic: true,
      },
    });

    const user = result;

    if (!user) {
      throw new Error("User not found");
    }

    return { user, token };
  } catch (err) {
    throw new Error("TOKEN_EXPIRED");
  }
};
