import { ENV } from "./env.js";
import jwt from "jsonwebtoken";

const accessTTL = "15m";
const refreshTTL = "7d";

export const generateAccessToken = (id, email) => {
  return jwt.sign({ id: id, email: email }, ENV.ACCESS_SECRET, {
    expiresIn: accessTTL,
  });
};

export const generateRefreshToken = (id, email) => {
  return jwt.sign({ id: id, email: email }, ENV.REFRESH_SECRET, {
    expiresIn: refreshTTL,
  });
};
