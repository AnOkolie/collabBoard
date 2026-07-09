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
  const result = await pendingFriend(user_id, friend_id);
  if (result.error) {
    console.error("Error updating friendships");
    ws.send(
      JSON.stringify({
        type: "friends:error",
        message: "Friend request failed to send",
      }),
    );
  }
  const message = {
    type: "friend:request-received",
    message: "You have received a new friend request",
    payload: {
      user_id: user_id,
      friend_id: friend_id,
      message: "You have received a friend request",
      requester: { username: ws.user.username, profilepic: ws.user.profilepic },
      created_at: result.data.created_at,
    },
  };
  messageFriend(friend_id, message);
  const updateFriendshipState = {
    type: "friend:status-update",
    user_id: friend_id,
    sender: user_id,
    status: "pending",
  };
  ws.send(JSON.stringify(updateFriendshipState));
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
    const friendshipStatus = status === "accepted" ? "friends" : null;
    const message = {
      type: "friend:status-update",
      user_id: friend_id,
      status: friendshipStatus,
    };
    messageFriend(user_id, message);
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
  const friend = getFriendSocket(user_id);
  const message = {
    type: "friend:request-rejected",
    message: `You have rejected ${friend.username} request to be friends`,
    payload: { user_id: user_id, friend_id: friend_id },
  };
  messageFriend(friend_id, message);
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
  const message = {
    type: `friend:request-${status}`,
    message: `You have ${status} a new friend request`,
    payload: { user_id: user_id, friend_id: friend_id },
  };
  messageFriend(friend_id, message);
};

export const dropFriendRequest = async (user_id, friend_id, ws) => {
  if ((!user_id, !friend_id)) {
    ws.send(
      JSON.stringify({
        type: "friend:request-removed",
        message: "Failed to unsend friend request",
      }),
    );
  }
  try {
    const response = await dropFriendship(user_id, friend_id);
    if (response.error) {
      ws.send(
        JSON.stringify({
          type: "friend:error",
          error: "Failed to unsend friend request",
        }),
      );
    } else {
      const message = {
        type: "friend:status-update",
        user_id: friend_id,
        status: "none",
      };
      ws.send(JSON.stringify(message));
    }
  } catch (err) {
    console.error("Error unsending friend request");
  }
};

const messageFriend = (friend_id, message) => {
  const friendSocket = getFriendSocket(friend_id);
  if (friendSocket) {
    friendSocket.send(JSON.stringify(message));
  }
};

const getFriendSocket = (user_id) => {
  return userSocketMap.get(user_id);
};
