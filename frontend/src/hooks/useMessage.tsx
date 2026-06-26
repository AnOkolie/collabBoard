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
  const { addMessage } = useMessageStore();
  const { sendJsonMessage, lastJsonMessage } = useSocket();
  const handleSubmit = useCallback(
    (message: messageBody, conversationId: string) => {
      console.log("handle message sending");
      if (!message || !conversationId) return;
      sendJsonMessage({
        type: "message:sent",
        payload: {
          conversation_id: conversationId,
          message: message,
        },
      });
    },
    [sendJsonMessage, lastJsonMessage],
  );

  useEffect(() => {
    if (!lastJsonMessage) return;
    const { type } = lastJsonMessage;
    switch (type) {
      case "message:received":
        const { payload } = lastJsonMessage;
        console.log("message received", lastJsonMessage);
        addMessage(payload);
        break;
    }
  }, [lastJsonMessage]);

  return {
    handleSubmit,
  };
};
