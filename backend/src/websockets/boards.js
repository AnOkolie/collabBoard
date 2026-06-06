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

export const handleBoardInvitation = async (user_id, friend_id, board_id) => {
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

export const updateBoardInvite = async (board_id, user_id, host_id, state) => {
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

export const joinBoard = async (payload, ws) => {
  ws.boards.add(payload.board_id);
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
  await joinRoom(payload.board_id, ws);
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
  console.log("Ws.boards", ws.boards);
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
