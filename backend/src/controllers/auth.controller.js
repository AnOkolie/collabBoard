import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../utils/env.js";
import { prisma } from "../db/prisma.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

export const login = async (req, res) => {
  const { email, password: userPassword, username } = req.body;
  if ((!email && !username) || !userPassword) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (email) {
    emailLogin(email, userPassword, req, res);
  } else if (username) {
    usernameLogin(username, userPassword, req, res);
  }
};

export const register = async (req, res) => {
  const { email, password: userPassword, username } = req.body;
  if (!email || !userPassword || !username) {
    return res
      .status(400)
      .json({ error: "Email, username and password are required" });
  }
  try {
    // Check if user already exists
    const existingUser = await prisma.users.findUnique({
      where: {
        email: email,
        username: username,
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const result = await prisma.users.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        profilepic: true,
        created_at: true,
      },
    });

    const user = result;
    // Generate JWT token
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
    });
    //for cross site cookies, sameSite needs to be turned off

    res.status(201).json({
      message: "User registered successfully",
      user: user,
      token: accessToken,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders) return;
    const token = authHeaders.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: { message: "Not authenticated" } });
    }

    const { id } = jwt.verify(token, ENV.ACCESS_SECRET);
    const result = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        profilepic: true,
        username: true,
        email: true,
      },
    });

    if (!result) {
      return res.status(401).json({ error: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "User is authenticated", user: result });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const validUsername = async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return { error: "Missing required fields" };
  }
  try {
    const response = await prisma.users.findFirst({
      where: {
        username: {
          startsWith: username,
        },
      },
    });
    if (!response) {
      return { message: "Username is valid" };
    }
    return { message: `username ${username} is taken` };
  } catch (err) {
    console.error("Error checking validity of username");
    return { error: "Internal server error" };
  }
};

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    jwt.verify(token, ENV.REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const accessToken = generateAccessToken(user.id, user.email);
      res.json({ accessToken });
    });
  } catch (err) {
    console.error("Error generating refresh token");
  }
};

const emailLogin = async (email, userPassword, req, res) => {
  try {
    const result = await prisma.users.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        profilepic: true,
        created_at: true,
      },
    });

    if (!result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = result;
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(userPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Generate JWT token
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token: accessToken,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const usernameLogin = async (username, userPassword, req, res) => {
  try {
    const result = await prisma.users.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        profilepic: true,
        created_at: true,
      },
    });
    if (!result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = result;
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(userPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Generate JWT token
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token: accessToken,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
