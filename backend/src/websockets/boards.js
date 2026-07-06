import { userSocketMap } from "./socket.js";
import { getBoardRoom, joinRoom, leaveRoom } from "./room.js";
import {
  getConnCount,
  newConn,
  onlineUserList,
  removeConn,
} from "../../redis/hash.js";
import {
  publisherBoardUpdate,
  publishPresenceUpdate,
} from "../services/publisherHandler.js";

import {
  boardInvitation,
  updateBoardInviteState,
} from "../controllers/board.controller.js";
import { stringify } from "node:querystring";
import { createMessage } from "../controllers/messages.controller.js";
import { SYSTEM_SENDER_ID } from "../utils/strings.js";
import { generateUserJoinSystemMessage } from "../transformers/boards.js";
import { formatOutgoingMessage } from "../transformers/messages.js";

export const handleBoardInvitation = async (user_id, friend_id, board_id) => {
  const ws = userSocketMap.get(user_id);
  const friendSock = userSocketMap.get(friend_id);

  if (!ws) return;

  if (!friend_id || !user_id || !board_id) {
    return ws.send(
      JSON.stringify({
        type: "boards:error",
        code: 400,
        message: "Board invitation failed",
      }),
    );
  }

  const result = await boardInvitation(user_id, friend_id, board_id);

  if (result.error) {
    return ws.send(
      JSON.stringify({
        type: "boards:error",
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

export const updateBoardInvite = async (board_id, user_id, host_id, state) => {
  const ws = userSocketMap.get(user_id);
  const boardRooms = getBoardRoom(board_id);

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
        type: "boards:error",
        message: response.error,
      }),
    );
  }
  if (state === "accepted") {
    if (!boardRooms.has(board_id)) {
      boardRooms.set(board_id, new Set());
    }
    boardRooms.get(board_id).add(ws);
    ws.send(
      JSON.stringify({
        type: "board:joined",
        message: "You are now a member of this board",
        payload: response,
      }),
    );
    const systemMessage = await createMessage(
      SYSTEM_SENDER_ID,
      undefined,
      generateUserJoinSystemMessage(ws.user),
      "system",
      [],
      board_id,
    );
    if (systemMessage.error) {
      console.error("create message error", systemMessage.error);
    }
    return ws.send(
      JSON.stringify({
        type: "message:received",
        payload: formatOutgoingMessage(systemMessage.data),
      }),
    );
  }
};

export const broadcastBoard = (boardId, payload) => {
  const room = getBoardRoom(boardId);

  if (!room) return;

  const message = JSON.stringify(payload);

  for (const sockets of room.values()) {
    for (const ws of sockets) {
      if (ws.readyState === ws.OPEN) {
        ws.send(message);
      }
    }
  }
};

export const joinBoard = async (payload, ws) => {
  ws.boards.add(payload.board_id);
  try {
    await joinRoom(payload.board_id, ws);
    const count = await newConn(payload.board_id, ws.user.id);
    await joinResponse({
      board_id: payload.board_id,
      type: "user-joined:init",
      ws,
    });
    await publisherBoardUpdate(
      {
        board_id: payload.board_id,
        type: "user:joined",
        payload: {
          id: ws.user.id,
          username: ws.user.username,
          profilepic: ws.user.profilepic,
        },
      },
      count,
    );
  } catch (err) {
    console.error("Error joining board", err);
  }
};

export const leaveBoard = async (payload, ws) => {
  await leaveRoom(payload.board_id, ws);

  setTimeout(async () => {
    const count = getConnCount(payload.board_id, ws.user.id);
    if (count == 0) {
      publisherBoardUpdate({
        board_id: payload.board_id,
        type: "user:left",
        payload: {
          id: ws.user.id,
          username: ws.user.username,
          profilepic: ws.user.profilepic,
        },
      });
    }
  }, [5000]);
};

export const closeSocket = async (ws) => {
  for (const board_id of ws.boards) {
    console.log("closing sockets...");
    try {
      const count = await removeConn(board_id, ws.user.id);
      console.log(
        `count: ${count} board:${board_id}:connections ${ws.user.id}`,
      );
      if (count === 0) {
        publisherBoardUpdate(
          {
            board_id,
            type: "user:left",
            payload: {
              id: ws.user.id,
              username: ws.user.username,
              profilepic: ws.user.profilepic,
            },
          },
          count,
        );
      }
    } catch (err) {
      console.error("Error updating socket connections: ", err);
    }
    // publishPresenceUpdate({ user: ws.user, status: "online" });
    if (ws.user?.id) {
      userSocketMap.delete(ws.user.id);
    }
    leaveRoom(board_id, ws);
  }
  console.log("user disconnected:", ws.user?.id);
};

const joinResponse = async ({ board_id, type, ws }) => {
  const list = await onlineUserList(board_id);
  const payload = list.length === 0 ? [] : list;
  const user_id = ws.user.id;
  ws.send(JSON.stringify({ type, user_id, payload }));
};
