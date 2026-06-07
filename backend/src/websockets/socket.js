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

const userSocketMap = new Map();

export const wss = new WebSocketServer({ noServer: true });

export const webSocketSetup = () => {
  wss.on("connection", (ws, req) => {
    console.log("ws object", ws.user);
    if (ws.user?.id) {
      userSocketMap.set(ws.user.id, ws);
      publishPresenceUpdate({ user: ws.user, status: "online" });
    }
    ws.boards = new Set();

    ws.on("message", async (message) => {
      console.log("received:", message.toString());
      const data = JSON.parse(message);
      const { type } = data;
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
        joinBoard(payload, ws);
      } else if (type == "board:leave") {
        const { payload } = data;
        leaveBoard(payload, ws);
      }
    });

    ws.on("close", async () => {
      closeSocket(ws);
    });

    ws.on("error", (err) => {
      console.error("ws error:", err);
    });
  });
};

export { userSocketMap };
