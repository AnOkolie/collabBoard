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
interface messageListProps {
  messages: conversationMessage;
}
export const MessageList = ({ messages }: messageListProps) => {
  const loaderData = useLoaderData<combinedLoader>();

  const userId = useAuthStore.getState().authUser?.id;
  return (
    <>
      {messages &&
        messages.messages.map((message) => (
          <ChatBubble
            message={message.content}
            isUser={message.senderId === userId}
          />
        ))}
    </>
  );
};
