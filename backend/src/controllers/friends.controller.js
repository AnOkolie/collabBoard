import { pool } from "../utils/db.js";

export const pendingFriend = async (user_id, friend_id) => {
  console.log("pending friends");
  if (!user_id || !friend_id) {
    return { error: "Required fields are missing" };
  }
  try {
    const result = await pool.query(
      "INSERT INTO user_friends(user_id, friend_id, status) VALUES($1, $2, $3)",
      [user_id, friend_id, "pending"],
    );

    if (result.rows.length === 0) {
      return { message: "Failed to create a pending friend request" };
    }
    return {
      message: "Friend status has been updated to pending",
      data: result.rows[0],
    };
  } catch (error) {
    console.log("Error creating pending request: ", error);
    return { error: error };
  }
};

export const addFriend = async (user_id, friend_id) => {
  if (!user_id || !friend_id) {
    return;
  }
  try {
    const result = await pool.query(
      "UPDATE user_friends SET status = 'accepted' where user_id = $1 and friend_id = $2 RETURNING *",
      [user_id, friend_id],
    );
    if (result.rows.length === 0) {
      return { message: "Failed to create a pending friend request" };
    }
    return { message: "Friend status has been updated to pending" };
  } catch (error) {
    console.log("Error creating pending request: ", error);
    return { error: error };
  }
};
