import { createClient } from "redis";
import { prisma } from "../src/db/prisma.js";
import { ENV } from "../src/utils/env.js";
import { use } from "react";
export const hash = createClient({ url: ENV.REDIS_URL });

hash.on("error", (err) => {
  console.error(`Redis error: ${err}`);
});
await hash.connect();

export const newConn = async (board_id, user_id) => {
  const count = await hash.hIncrBy(generateKey(board_id), user_id, 1);
  await hash.hExpire(generateKey(board_id), ["user_id"], 60);
  return count;
};

export const removeConn = async (board_id, user_id) => {
  const key = generateKey(board_id);
  const count = await hash.hIncrBy(key, user_id, -1);
  if (count <= 0) {
    await hash.hDel(key, user_id);
  }
  return count;
};

export const getConnCount = async (board_id, user_id) => {
  return await hash.hGet(generateKey(board_id), user_id);
};

export const onlineUserList = async (board_id) => {
  try {
    const users = await hash.hGetAll(generateKey(board_id));

    const userIds = Object.keys(users);

    if (userIds.length === 0) return [];
    const userList = await prisma.users.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        username: true,
        profilepic: true,
      },
    });
    return userList;
  } catch (err) {
    console.error("Error fetching users", err);
  }
};

const generateKey = (board_id) => {
  return `board:${board_id}:connections`;
};
