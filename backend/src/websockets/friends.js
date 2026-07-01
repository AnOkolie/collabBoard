import {
  dropFriendship,
  pendingFriend,
  rejectFriendship,
  updateFriendship,
} from "../controllers/friends.controller.js";
import { userSocketMap } from "./socket.js";

export const friendRequest = async (user_id, friend_id, ws) => {
  if (!friend_id || !user_id) {
    console.error("Missing required fields");
    ws.send(
      JSON.stringify({
        type: "friends:error",
        message: "Friend request failed to send",
      }),
    );
  }
  const result = pendingFriend(user_id, friend_id);
  if (result.error) {
    console.error("Error updating friendships");
    ws.send(
      JSON.stringify({
        type: "friends:error",
        message: "Friend request failed to send",
      }),
    );
  }

  const friendSocket = userSocketMap.get(friend_id);
  if (friendSocket) {
    friendSocket.send(
      JSON.stringify({
        type: "friend-request:received",
        message: "You have received a new friend request",
        payload: { user_id: user_id, friend_id: friend_id },
      }),
    );
  }
};

export const friendRequestUpdate = async (user_id, friend_id, ws, status) => {
  if (!friend_id || !user_id) {
    console.error("Missing required fields");
    ws.send(
      JSON.stringify({
        type: "friends:error",
        message: "Friend request failed to send",
      }),
    );
  }
  try {
    if (status === "decline") {
      handleRejectFriendship(user_id, friend_id, ws);
    } else {
      handleFriendshipUpdate(user_id, friend_id, ws, status);
    }
  } catch (err) {
    console.error("Error updating friendship");
  }
};

const handleRejectFriendship = async (user_id, friend_id, ws) => {
  const result = await rejectFriendship(user_id, friend_id);
  if (result.error) {
    console.error("Error updating friendships");
    ws.send(
      JSON.stringify({
        type: "friends:error",
        message: "Friend request failed to send",
      }),
    );
  }
  const friendSocket = userSocketMap.get(friend_id);
  if (friendSocket) {
    friendSocket.send(
      JSON.stringify({
        type: "friend-request:rejected",
        message: `You have rejected ${friendSocket.username} request to be friends`,
        payload: { user_id: user_id, friend_id: friend_id },
      }),
    );
  }
};

const handleFriendshipUpdate = async (user_id, friend_id, ws, status) => {
  const response = await updateFriendship(user_id, friend_id, status);
  if (response.error) {
    ws.send(
      JSON.stringify({
        type: "friends:error",
        message: "Friend request failed to send",
      }),
    );
  }
  const friendSocket = userSocketMap.get(friend_id);
  if (friendSocket) {
    friendSocket.send(
      JSON.stringify({
        type: `friend-request:${status}`,
        message: `You have ${status} a new friend request`,
        payload: { user_id: user_id, friend_id: friend_id },
      }),
    );
  }
};

export const dropFriendRequest = async (user_id, friend_id, ws) => {
  if ((!user_id, !friend_id)) {
    ws.send(
      JSON.stringify({
        type: "friend-request:removed",
        message: "Failed to unsend friend request",
      }),
    );
  }
  try {
    const response = await dropFriendship(user_id, friend_id);
    if (response.error) {
      ws.send(
        JSON.stringify({
          type: "friend-request:removed",
          error: "Failed to unsend friend request",
        }),
      );
    } else {
      ws.send(
        JSON.stringify({
          type: "friend-request:removed",
          message: response.message,
        }),
      );
    }
  } catch (err) {
    console.error("Error unsending friend request");
  }
};
