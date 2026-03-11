import { WebSocketServer } from "ws";
import { pendingFriend } from "../controllers/friends.controller.js";
import { boardInvitation } from "../controllers/board.controller.js";

const userSocketMap = new Map();

export const wss = new WebSocketServer({ noServer: true });

const friendRequest = async (user_id, friend_id, ws) => {
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

const handleBoardInvitation = async (user_id, friend_id, board_id) => {
  const ws = userSocketMap.get(user_id);
  const friendSock = userSocketMap.get(friend_id);

  if (!ws) return;

  if (!friend_id || !user_id || !board_id) {
    return ws.send(
      JSON.stringify({
        type: "error",
        code: 400,
        message: "Board invitation failed",
      }),
    );
  }

  const result = await boardInvitation(user_id, friend_id, board_id);

  if (result.error) {
    return ws.send(
      JSON.stringify({
        type: "error",
        message: result.error,
      }),
    );
  }

  if (!friendSock) {
    return ws.send(
      JSON.stringify({
        type: "error",
        message: "User is not online",
      }),
    );
  }

  friendSock.send(
    JSON.stringify({
      type: "board-invite",
      message: "You've received a board invitation",
      payload: {
        host_id: user_id,
        board_id: board_id,
      },
    }),
  );
};

export const webSocketSetup = () => {
  wss.on("connection", (ws, req) => {
    console.log("new user connected:", ws.user?.id);

    if (ws.user?.id) {
      userSocketMap.set(ws.user.id, ws);
    }

    ws.on("message", (message) => {
      console.log("received:", message.toString());
      const data = JSON.parse(message);
      console.log(data);
      const { type } = data;
      console.log(type);
      if (type === "friend-request") {
        const { user_id, friend_id } = data;
        friendRequest(user_id, friend_id, ws);
      } else if (type === "board-invite") {
        const { user_id, friend_id, board_id } = data;
        handleBoardInvitation(user_id, friend_id, board_id, ws);
      }
    });

    ws.on("close", () => {
      if (ws.user?.id) {
        userSocketMap.delete(ws.user.id);
      }
      console.log("user disconnected:", ws.user?.id);
    });

    ws.on("error", (err) => {
      console.error("ws error:", err);
    });
  });
};

export { userSocketMap };
