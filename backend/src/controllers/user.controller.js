import { profile } from "node:console";
import { pool } from "../db/db.js";
import bcrypt from "bcrypt";
import cloudinary from "../utils/cloudinary.js";
import { prisma } from "../db/prisma.js";

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
  const { username } = req.query;
  const { user_id } = req.params;

  if (!username) {
    return res.status(400).json({
      error: "Provide a username",
    });
  }

  try {
    const requestMap = new Map();
    const friendMap = new Map();
    const users = await prisma.users.findMany({
      where: {
        username: {
          contains: username,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilepic: true,
      },
    });
    const requests = await prisma.friendship_requests.findMany({
      where: {
        OR: [
          {
            user_id: user_id,
            friend_id: { in: users.map((user) => user.id) },
          },
          {
            friend_id: user_id,
            user_id: { in: users.map((user) => user.id) },
          },
        ],
      },
      select: {
        user_id: true,
        friend_id: true,
        status: true,
      },
    });
    const friends = await prisma.friends.findMany({
      where: {
        OR: [
          {
            user_id: user_id,
            friend_id: { in: users.map((user) => user.id) },
          },
          {
            friend_id: user_id,
            user_id: { in: users.map((user) => user.id) },
          },
        ],
      },
      select: {
        user_id: true,
        friend_id: true,
        status: true,
      },
    });

    for (const r of requests) {
      requestMap.set(mapKey(r.friend_id, r.user_id), r);
    }
    for (const f of friends) {
      friendMap.set(mapKey(f.friend_id, f.user_id), f);
    }
    const formattedUsers = users.map((user) => {
      const key = mapKey(user_id, user.id);
      const friend = friendMap.get(key);
      const request = requestMap.get(key);
      const isSender =
        request?.user_id === user_id || friend?.user_id === user_id;
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        profilepic: user.profilepic,

        friendshipStatus: friend?.status ?? request?.status ?? null,

        sender: isSender ? user_id : (request?.user_id ?? null),
      };
    });
    return res.status(200).json({
      message: "Retrieved users",
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Error finding user:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const mapKey = (a, b) => {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
};

export const getProfilePicture = async (user_id) => {
  if (!user_id) return { error: "Missing user Id!" };

  try {
    const profile = await pool.query(
      "SELECT profilepic FROM users where id = $1",
      [user_id],
    );
    if (profile.row.length === 0) {
      return { error: "Invalid user Id" };
    }
    return { message: "Profile retrieved", profilepic: profile.rows[0] };
  } catch (err) {
    console.log({ error: "Error retrieving profile:", err });
  }
};

// SELECT u.id, u.profilepic, u.username, u.email, uf.status, uf.request_sender FROM users as u LEFT JOIN user_friendships as uf ON u.id = uf.user_id OR u.id = uf.friend_id WHERE (uf.user_id='c004a3e5-84fc-4ab1-8266-775bba866de0' OR uf.friend_id='c004a3e5-84fc-4ab1-8266-775bba866de0') AND username='anthony'
