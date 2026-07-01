import { userSocketMap } from "../websockets/socket.js";

export const getActiveStatus = (id) => {
  const ws = userSocketMap.get(id);
  return ws ? "online" : "offline";
};
