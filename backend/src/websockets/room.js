import { newConn, removeConn } from "../../redis/hash.js";

const boardRooms = new Map();

export const joinRoom = (board_id, ws) => {
  if (!boardRooms.has(board_id)) {
    boardRooms.set(board_id, new Map());
  }
  const room = boardRooms.get(board_id);
  if (!room.has(ws.user.id)) {
    room.set(ws.user.id, new Set());
  }
  room.get(ws.user.id).add(ws);
};

export const leaveRoom = async (board_id, ws) => {
  const room = boardRooms.get(board_id);
  if (!room) return;
  const userSockets = room.get(ws.user.id);
  if (!userSockets) return;
  userSockets.delete(ws);

  if (userSockets.size === 0) {
    room.delete(ws.user.id);
  }
  if (room.size === 0) {
    boardRooms.delete(board_id);
  }
  await removeConn(board_id, ws.user.id);
};

export const getBoardRoom = (boardId) => {
  return boardRooms.get(boardId) || null;
};
