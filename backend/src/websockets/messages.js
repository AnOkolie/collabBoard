import { createMessage } from "../controllers/messages.controller.js";
import { userSocketMap } from "./socket.js";

export const broadcastMessage = async (ws, conversation_id, message) => {
  const { senderId, content, messageType, metadata, attachments } = message;
  console.log(senderId, conversation_id, content, messageType, attachments);
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
    console.log(result.error);
    return;
  }
  console.log("data:", result.data);
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
    created_at: result.created_at,
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
  };
  return message;
};
