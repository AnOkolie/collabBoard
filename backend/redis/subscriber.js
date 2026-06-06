import { createClient } from "redis";
import { getBoardRoom } from "../src/websockets/room.js";
import { ENV } from "../src/utils/ENV.js";

export const subscriber = createClient({ url: ENV.REDIS_URL });

subscriber.on("error", (err) => {
  console.error(`Subscriber error: ${err}`);
});

export const initSubscriber = async () => {
  await subscriber.connect();
  console.log("Redis subscriber connected");

  await subscriber.pSubscribe("board:*", (message, channel) => {
    const boardId = channel.split(":")[1];
    const room = getBoardRoom(boardId);

    if (!room) return;

    const data = JSON.parse(message);
    for (const [id, set] of room) {
      console.log("id", id);
      for (const ws of set) {
        if (ws.readyState === ws.OPEN) {
          try {
            ws.send(JSON.stringify(data));
          } catch (err) {
            console.error("WS send failed:", err);
          }
        }
      }
    }
  });
};
