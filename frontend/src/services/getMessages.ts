import { useAuthStore } from "../zustand/authStore/useAuthStore";
import { getMessagesByConversation } from "../api/messages";

export const getMessages = async (conversationId: string) => {
  const userId = useAuthStore((state) => state.authUser?.id);
  if (!conversationId || !userId) return;
  const res = await getMessagesByConversation(conversationId, userId);
  return res.data;
};
