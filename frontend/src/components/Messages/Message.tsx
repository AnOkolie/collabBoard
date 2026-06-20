import { AppShell, Flex, Box, ScrollArea, Text, Paper } from "@mantine/core";
import { ChatBubble } from "./ChatBubble";
import { ChannelList } from "./ChannelList";
import { MessageList } from "./MessageList";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { useConversation } from "../../hooks/useConversation";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import {
  conversationMessage,
  messagesResponse,
  UserConversation,
} from "../../types/messages";
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { EmptyConversation } from "./EmptyConversation";
type loaderDataType = {
  data: {
    messages: {
      data: conversationMessage;
    };
  };
};
export const Message = () => {
  // const channel = {
  //   id: "st",
  //   name: "string",
  //   type: "string",
  //   displayPicture: "string",
  //   directConversationKey: "string",
  //   user: {
  //     username: "string",
  //     profilePicture: "string",
  //     id: "string",
  //     role: "string",
  //   },
  // };
  // const { channel } = useOutletContext<OutletContext>();
  const [channel, setChannel] = useState<UserConversation[]>([]);
  const [message, setMessages] = useState<conversationMessage>();
  const loaderData = useLoaderData() as loaderDataType;
  useEffect(() => {
    if (!loaderData) return;
    console.log("loader data messages", loaderData.data.messages.data);
    // setChannel(loaderData.data.conversations);
    setMessages(loaderData.data.messages.data);
  }, [loaderData]);
  useEffect(() => {
    console.log("channel", channel);
    console.log("message", message);
  }, [channel, message]);
  return (
    <>
      {!message && <EmptyConversation />}
      {/* MAIN CHAT */}
      <Flex direction="column" style={{ flex: 1 }}>
        {/* HEADER */}
        <Box h={60} bd="1px solid var(--mantine-color-default-border)">
          <ChatHeader
            name={message?.name!}
            displayPicture={message?.displayPicture!}
          />
        </Box>
        {/* MESSAGES */}
        <ScrollArea
          style={{
            flex: 1,
          }}
          bg="gray.0"
        >
          <MessageList messages={message!} />
        </ScrollArea>

        {/* INPUT */}
        <Box p="sm" bd="1px solid var(--mantine-color-default-border)">
          <MessageInput conversation={channel[0]} />
        </Box>
      </Flex>
    </>
  );
};
