import { useMemo, useRef, useEffect, useCallback } from "react";
import { IncomingBoardEvent } from "../types/socket/incomingMessages";
import { messageBody } from "../types/messages";
import { useSocket } from "../context/SocketContext";
import { useMessageStore } from "../zustand/messageStore/useMessageStore";
export const useTypedBoardMessage = (lastJsonMessage: any) => {
  return useMemo(() => {
    if (
      !lastJsonMessage ||
      typeof lastJsonMessage !== "object" ||
      !("type" in lastJsonMessage)
    ) {
      return null;
    }

    return lastJsonMessage as IncomingBoardEvent;
  }, [lastJsonMessage]);
};

export const useMessage = () => {
  const { sendJsonMessage } = useSocket();
  const handleSubmit = useCallback(
    (message: messageBody, conversationId: string) => {
      if (!message || !conversationId) return;
      sendJsonMessage({
        type: "message:sent",
        payload: {
          conversation_id: conversationId,
          message: message,
        },
      });
    },
    [sendJsonMessage],
  );
  const sendTyping = useCallback(
    (isTyping: boolean, conversationId: string, senderId?: string) => {
      if (!senderId) return;
      sendJsonMessage({
        type: `typing:${isTyping}`,
        payload: {
          conversation_id: conversationId,
          sender_id: senderId,
        },
      });
    },
    [sendJsonMessage],
  );
  return {
    handleSubmit,
    sendTyping,
  };
};
