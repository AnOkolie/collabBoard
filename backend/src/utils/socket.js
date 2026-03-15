import { WebSocketServer } from "ws";
import { pendingFriend } from "../controllers/friends.controller.js";
import {
  boardInvitation,
  updateBoardInviteState,
} from "../controllers/board.controller.js";

const userSocketMap = new Map();
const boardRooms = new Map();

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

  if (!friendSock) return;

  return friendSock.send(
    JSON.stringify({
      type: "board-invite",
      message: "You've received a board invitation",
      payload: {
        host_id: user_id,
        board_id: board_id,
        title: result.title,
        alert: result.alert,
        id: result.data.id,
      },
    }),
  );
};

const updateBoardInvite = async (board_id, user_id, host_id, state) => {
  const ws = userSocketMap.get(user_id);

  if (!ws) return;
  if (!board_id || !user_id || !host_id) {
    return ws.send(
      JSON.stringify({
        type: "error",
        code: 400,
        message: "Board invitation failed",
      }),
    );
  }
  const response = await updateBoardInviteState(
    board_id,
    user_id,
    host_id,
    state,
  );
  if (response.error) {
    return ws.send(
      JSON.stringify({
        type: "error",
        message: response.error,
      }),
    );
  }
  if (state === "accepted") {
    if (!boardRooms.has(board_id)) {
      boardRooms.set(board_id, new Set());
    }
    boardRooms.get(board_id).add(ws);
    console.log(response);
    return ws.send(
      JSON.stringify({
        type: "board:joined",
        message: "You are now a member of this board",
        payload: response,
      }),
    );
  }
};

export const broadcastBoard = (board_id, payload) => {
  const subscribers = boardRooms.get(board_id);

  if (!subscribers) return;

  const message = JSON.stringify(payload);

  subscribers.forEach((ws) => {
    if (ws.readyState === ws.OPEN) {
      try {
        ws.send(message);
      } catch (err) {
        console.error("Socket send failed:", err);
      }
    }
  });
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
      } else if (type == "board-invitation-response") {
        console.log("invite response");
        const { user_id, host_id, board_id, response } = data;
        updateBoardInvite(board_id, user_id, host_id, response);
      } else if (type == "board:join") {
        const { payload } = data;
        if (!boardRooms.has(payload.board_id)) {
          boardRooms.set(payload.board_id, new Set());
        }
        boardRooms.get(payload.board_id).add(ws);
      } else if (type == "board:leave") {
        const { payload } = data;
        const room = boardRooms.get(payload.board_id);

        if (!room) return;

        room.delete(ws);

        if (room.size === 0) {
          boardRooms.delete(payload.board_id);
        }
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
