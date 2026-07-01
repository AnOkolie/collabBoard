import { Stack } from "@mantine/core";
import { useLoaderData } from "react-router-dom";
import {
  combinedLoader,
  conversationMessage,
  messagesResponse,
  UserConversation,
} from "../../types/messages";
import { useEffect, useState } from "react";
import { displayNotifications } from "../../utilities/notification/displayNotifications";
import { ChatBubble } from "./ChatBubble";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useMessageStore } from "../../zustand/messageStore/useMessageStore";
import { SystemMessage } from "./SystemMessage";
import { TypingIndicator } from "./TypingIndicator";
interface messageListProps {
  messages: conversationMessage;
}
export const MessageList = ({ messages }: messageListProps) => {
  const { setMessage, messages: messageList } = useMessageStore();
  useEffect(() => {
    if (!messages) return;
    setMessage(messages.messages);
  }, [messages]);

  const userId = useAuthStore.getState().authUser?.id;
  const isTyping = useMessageStore((s) => s.isTyping);
  return (
    <>
      {messageList?.map((message) => {
        if (message.messageType === "system") {
          return <SystemMessage message={message} />;
        }

        return (
          <ChatBubble
            key={message.id}
            message={message}
            isUser={message.senderId === userId}
          />
        );
      })}
      {isTyping && <TypingIndicator />}
    </>
  );
};
