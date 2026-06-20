import { getDirectConversation } from "../api/messages";

export const getOrCreateDirectConversation = async (
  userId: string,
  friendId: string,
) => {
  if (!userId || !friendId) {
    return;
  }
  const res = await getDirectConversation(userId, friendId);
  return res.data;
};
