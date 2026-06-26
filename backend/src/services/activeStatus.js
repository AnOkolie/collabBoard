import { userSocketMap } from "../websockets/socket.js";

export const getActiveStatus = (id) => {
  console.log("log");
  const ws = userSocketMap.get(id);
  return ws ? "online" : "offline";
};
