import { boardChannel } from "../../redis/channel.js";
import { getConnCount, onlineUserList } from "../../redis/hash.js";
import { publisher } from "../../redis/publisher.js";
import { publishMessage } from "../db/redis.js";
import { getBoardRoom } from "../websockets/room.js";

export const publisherBoardUpdate = async (
  { board_id, type, payload },
  count,
) => {
  let bool = false;
  console.log("type:", type, " count:", count);
  switch (type) {
    case "user:joined":
      bool = count == 1 ? true : false;
      break;
    case "user:left":
      bool = count <= 0 ? true : false;
      break;
    default:
      bool = false;
  }
  if (bool) {
    await publisher.publish(
      boardChannel(board_id),
      JSON.stringify({ type, payload }),
    );
  }
};

export const publisherBoardInit = async ({ board_id, type, ws }) => {
  const list = await onlineUserList(board_id);
  console.log(`list: ${list}`);
  const payload = list.length === 0 ? [] : list;
  const user_id = ws.user.id;
  publisher.publish(
    boardChannel(board_id),
    JSON.stringify({ type, user_id, payload }),
  );
};

export const publishPresenceUpdate = async ({ user, status }) => {
  if (status === "online") {
    await publishMessage(`presence:${user.id}`, {
      type: "user-online",
      payload: user,
    });
  } else if (status === "offline") {
    await publishMessage(`presence:${user.id}`, {
      type: "user-offline",
      payload: user,
    });
  }
};
