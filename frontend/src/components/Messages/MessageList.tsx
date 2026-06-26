import { Text } from "@mantine/core";
import { useLoaderData } from "react-router-dom";
import {
  combinedLoader,
  conversationMessage,
  messagesResponse,
  UserConversation,
} from "../../types/messages";
import { useEffect, useState } from "react";
import { displayNotifications } from "../../utilities/displayNotifications";
import { ChatBubble } from "./ChatBubble";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useMessageStore } from "../../zustand/messageStore/useMessageStore";
interface messageListProps {
  messages: conversationMessage;
}
export const MessageList = ({ messages }: messageListProps) => {
  const { setMessage, messages: messageList } = useMessageStore();
  console.log("api messages:", messages);
  console.log(messageList);
  useEffect(() => {
    if (!messages) return;
    setMessage(messages.messages);
  }, [messages]);

  const userId = useAuthStore.getState().authUser?.id;
  return (
    <>
      {messageList &&
        messageList.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            isUser={message.senderId === userId}
          />
        ))}
    </>
  );
};
