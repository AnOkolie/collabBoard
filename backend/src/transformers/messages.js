export const formatAttachments = (attachments) => {
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

export const formatOutgoingMessage = (result) => {
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
