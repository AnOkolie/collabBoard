import { getConversationMembers } from "../controllers/conversations.controller.js";
import { createMessage } from "../controllers/messages.controller.js";
import { userSocketMap } from "./socket.js";
import {
  formatOutgoingMessage,
  formatAttachments,
} from "../transformers/messages.js";
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
