import { WebSocketServer } from "ws";
import { pendingFriend } from "../controllers/friends.controller.js";
import {
  boardInvitation,
  updateBoardInviteState,
} from "../controllers/board.controller.js";
import { getProfilePicture } from "../controllers/user.controller.js";
import { publishMessage, subscriber } from "../db/redis.js";
import {
  publisherBoardUpdate,
  publishPresenceUpdate,
} from "../services/publisherHandler.js";
import { join } from "path";
import { getBoardRoom, joinRoom, leaveRoom } from "./room.js";
import { getConnCount } from "../../redis/hash.js";
import {
  updateBoardInvite,
  handleBoardInvitation,
  joinBoard,
  leaveBoard,
  closeSocket,
} from "./boards.js";
import {
  friendRequest,
  friendRequestUpdate,
  dropFriendRequest,
} from "./friends.js";
import { broadcastMessage, broadcastTypingIcon } from "./messages.js";

const userSocketMap = new Map();

export const wss = new WebSocketServer({ noServer: true });

const heartbeat = (ws) => {
  ws.isAlive = true;
};

export const webSocketSetup = () => {
  wss.on("connection", (ws, req) => {
    console.log("ws object", ws.user);
    ws.isAlive = true;
    if (ws.user?.id) {
      userSocketMap.set(ws.user.id, ws);
      publishPresenceUpdate({ user: ws.user, status: "online" });
    }
    ws.boards = new Set();
    ws.on("pong", () => {
      console.log("ponging");
      ws.isAlive = true;
    });

    const interval = setInterval(() => {
      if (ws.isAlive === false) {
        return ws.terminate(); // Kill broken connection
      }

      ws.isAlive = false;
      ws.ping(); // Send ping frame
    }, 30000);

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);
        console.log("Received", data);
        const { type } = data;
        if (type === "friend-request:sent") {
          const { user_id, friend_id } = data;
          friendRequest(user_id, friend_id, ws);
        } else if (type === "board-invite") {
          const { user_id, friend_id, board_id } = data;
          handleBoardInvitation(user_id, friend_id, board_id, ws);
        } else if (type == "board-invitation-response") {
          const { user_id, host_id, board_id, response } = data;
          updateBoardInvite(board_id, user_id, host_id, response);
        } else if (type == "board:join") {
          const { payload } = data;
          joinBoard(payload, ws);
        } else if (type == "board:leave") {
          const { payload } = data;
          leaveBoard(payload, ws);
        } else if (type == "message:sent" || type == "message:edited") {
          const { payload } = data;
          broadcastMessage(ws, payload.conversation_id, payload.message);
        } else if (type === "friend-request:response") {
          const { user_id, friend_id, response } = data;
          friendRequestUpdate(user_id, friend_id, ws, response);
        } else if (type === "friend-request:unsend") {
          const { user_id, friend_id } = data;
          dropFriendRequest(user_id, friend_id, ws);
        } else if (type.startsWith("typing")) {
          const { payload } = data;
          broadcastTypingIcon(
            ws,
            payload.conversation_id,
            payload.sender_id,
            type,
          );
        }
      } catch (err) {
        console.log("Message err: ", err);
      }
    });

    ws.on("close", async () => {
      clearInterval(interval);
      closeSocket(ws);
    });

    ws.on("error", (err) => {
      console.error("ws error:", err);
    });
  });
};

export { userSocketMap };
