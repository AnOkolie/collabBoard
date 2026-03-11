import { pool } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV } from "../utils/ENV.js";

export const login = async (req, res) => {
  console.log("calling login");
  const { email, password: userPassword } = req.body;
  if (!email || !userPassword) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const result = await pool.query(
      "SELECT id, email, username, password, profilepic FROM users WHERE email = $1",
      [email],
    );
    if (result.rows.length === 0) {
      console.log("no user");
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = result.rows[0];
    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(userPassword, user.password);
    if (!isPasswordValid) {
      console.log("wrong pass");
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      ENV.JWT_SECRET,
      { expiresIn: "2h" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
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
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email, username],
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    const result = await pool.query(
      "INSERT INTO users(email,username,password) VALUES($1,$2,$3) RETURNING *",
      [email, username, hashedPassword],
    );
    const user = result.rows[0];
    // Generate JWT token
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      ENV.JWT_SECRET,
      { expiresIn: "2h" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });
    const { password, ...userWithoutPassword } = user;
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: { message: "Not authenticated" } });
    }

    const { sub } = jwt.verify(token, ENV.JWT_SECRET);

    const result = await pool.query(
      "SELECT id, email, username, profilepic FROM users WHERE id = $1",
      [sub],
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User is authenticated", user });
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
