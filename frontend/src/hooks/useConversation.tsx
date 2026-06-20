import { useEffect, useState } from "react";
import { messageBody, UserConversation } from "../types/messages";
import { useFetcher } from "react-router-dom";
import { useAuthStore } from "../zustand/authStore/useAuthStore";
import { useSocket } from "../context/SocketContext";
export const useConversation = () => {
  const [conversation, setConversation] = useState<UserConversation>();
  const currId = useAuthStore((state) => state.authUser?.id);
  const fetcher = useFetcher();
  const { sendJsonMessage } = useSocket();
  const getConversation = (friendId: string) => {
    if (!friendId) return;
    fetcher.load(
      `conversations/direct/${currId}/search?friend_id=${encodeURIComponent(friendId)}`,
    );
  };

  const getAllConversations = (userId: string) => {
    fetcher.load(`conversations`);
    return fetcher.data;
  };

  useEffect(() => {
    setConversation(fetcher.data);
  }, [fetcher.data]);

  const sendMessage = (message: messageBody, conversationId: string) => {
    sendJsonMessage({
      type: "message:sent",
      payload: {
        conversation_id: conversationId,
        message,
      },
    });
  };

  return {
    conversation,
    setConversation,
    getConversation,
    getAllConversations,
    sendMessage,
  };
};
