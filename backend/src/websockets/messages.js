import { getConversationMembers } from "../controllers/conversations.controller.js";
import { createMessage } from "../controllers/messages.controller.js";
import { userSocketMap } from "./socket.js";

export const broadcastMessage = async (ws, conversation_id, message) => {
  const { senderId, content, messageType, metadata, attachments } = message;
  const result = await createMessage(
    senderId,
    conversation_id,
    content,
    messageType,
    formatAttachments(attachments),
  );
  if (result.error) {
    ws.send(
      JSON.stringify({
        type: "message:error",
        message: result.error,
      }),
    );
    return;
  }
  const friends = result.data.conversations.conversation_members;
  for (const friend of friends) {
    const friendWs = userSocketMap.get(friend.users.id);
    if (friendWs && friendWs.readyState === friendWs.OPEN) {
      friendWs.send(
        JSON.stringify({
          type: "message:received",
          payload: formatOutgoingMessage(result.data),
        }),
      );
    }
  }
};

const formatAttachments = (attachments) => {
  const attachment = attachments.map((file) => {
    return {
      file_name: file.fileName,
      file_size: file.fileSize,
      mime_type: file.mimeType,
      file_url: file.fileUrl,
    };
  });
  return attachment;
};

const formatOutgoingMessage = (result) => {
  const message = {
    id: result.id,
    content: result.content,
    senderId: result.sender_id,
    messageType: result.message_type,
    createdAt: result.created_at,
    conversationId: result.conversation_id,
    edited_at: result.edited_at,
    users: result.conversations.conversation_members,
    attachments: result.attachments.map((file) => {
      return {
        fileName: file.file_name,
        fileUrl: file.file_url,
        fileSize: file.file_size,
        mimeType: file.mime_type,
      };
    }),
    messageReactions: result.message_reactions,
    sender: {
      username: result.users.username,
      profilepic: result.users.profilepic,
    },
  };
  return message;
};

export const broadcastTypingIcon = async (
  ws,
  conversation_id,
  sender_id,
  type,
) => {
  const typingForm = type.split(":")[1] === "true" ? "start" : "stop";
  if (!conversation_id || !sender_id) {
    ws.send(
      JSON.stringify({
        type: "typing:error",
      }),
    );
  }
  try {
    const result = await getConversationMembers(conversation_id, sender_id);
    const members = result.data;
    const users = result.user.users;
    if (members) {
      members.map((member) => {
        const friendWs = userSocketMap.get(member.user_id);
        if (friendWs && friendWs.readyState === friendWs.OPEN) {
          friendWs.send(
            JSON.stringify({
              type: `typing:${typingForm}`,
              conversationId: conversation_id,
              sender_id: sender_id,
              users: users,
            }),
          );
        }
      });
    }
  } catch (err) {
    console.error("Error sending typing message", err);
  }
};
