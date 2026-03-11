import { profile } from "node:console";
import { pool } from "../utils/db.js";
import bcrypt from "bcrypt";
import cloudinary from "../utils/cloudinary.js";

export const updateUser = async (req, res) => {
  const { user_id: userId } = req.params;
  const { username, email, password, profilepic: profilePic } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    let hashedPassword = null;
    let profileUrl = null;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);

      profileUrl = uploadResponse.secure_url;
    }

    const query = `
      UPDATE users
      SET
        username = COALESCE($1, username),
        email = COALESCE($2, email),
        password = COALESCE($3, password),
        profilepic = COALESCE($4, profilepic)
      WHERE id = $5
      RETURNING id, username, email, profilepic
    `;

    const values = [
      username || null,
      email || null,
      hashedPassword,
      profileUrl,
      userId,
    ];

    const result = await pool.query(query, values);

    res.status(200).json({
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { user_id: userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return res.status(400).json({ messsage: "Profile pic is required" });

    const userId = req.user_id;
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const user = await pool.query(
      "INSERT INTO USERS (profilePic) VALUES ($1) where id = $2 RETURNING *",
      [uploadResponse, userId],
    );

    res
      .status(200)
      .json({ message: "Profile Picture updated successfully", user: user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const findUserByName = async (req, res) => {
  console.log(req.query);
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "Provide a username" });
  }
  try {
    const result = await pool.query(
      "SELECT id, username, email, profilepic FROM users WHERE username ILIKE $1",
      [`%${username}%`],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: `We couldn't find "${username}". You should invite them to join our app`,
      });
    }

    return res.status(200).json({
      message: "Retrieved users",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error finding user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
