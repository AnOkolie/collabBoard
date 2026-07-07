import { ENV } from "./env.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const accessTTL = "2m";
const refreshTTL = "7d";

export const generateAccessToken = (id, email) => {
  return jwt.sign({ id: id, email: email }, ENV.ACCESS_SECRET, {
    expiresIn: accessTTL,
  });
};

export const generateRefreshToken = (id, email) => {
  return jwt.sign({ id: id, email: email }, ENV.REFRESH_SECRET, {
    expiresIn: refreshTTL,
    jwtid: uuidv4(),
  });
};
