import { pool } from "../utils/db.js";
import bcrypt from "bcrypt";

export const updateUser = async (req, res) => {
  const { user_id: userId } = req.params;
  const { username, email, password } = req.body;

  if (!userId || (!username && !email && !password)) {
    return res.status(400).json({
      error:
        "User ID and at least one field (username or email or password) are required",
    });
  }

  try {
    let query;
    let values;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      query = `
    UPDATE users
    SET username = $1, email = $2, password = $3
    WHERE id = $4
    RETURNING *
  `;

      values = [username, email, hashedPassword, userId];
    } else {
      query = `
    UPDATE users
    SET username = $1, email = $2
    WHERE id = $3
    RETURNING *
  `;

      values = [username, email, userId];
    }

    const result = await pool.query(query, values);
    res.status(200).json(result.rows[0]);
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
