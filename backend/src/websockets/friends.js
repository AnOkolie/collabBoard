export const friendRequest = async (user_id, friend_id, ws) => {
  console.log(`user_id: ${user_id} & friend_id: ${friend_id}`);
  if (!friend_id || !user_id) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Friend request failed to send",
      }),
    );
  }
  const result = pendingFriend(user_id, friend_id);
  if (result.error) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Friend request failed to send",
      }),
    );
  }
  console.log(result);
  const friendSocket = userSocketMap.get(friend_id);
  if (friendSocket) {
    friendSocket.send(
      JSON.stringify({
        type: "received-friend-request",
        message: "You have received a new friend request",
        payload: { user_id: user_id, friend_id: friend_id },
      }),
    );
  }
};
