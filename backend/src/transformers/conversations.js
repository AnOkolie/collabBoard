import { getUserConversations } from "../controllers/conversations.controller.js";
import { getActiveStatus } from "../services/activeStatus.js";
export const formattedConversation = (convo) => {
  if (!convo) return;
  return {
    id: convo.id,
    displayPicture: convo.displayPicture,
    name: convo.name,
    type: convo.type,
  };
};
import {
  getDisplayPicture,
  getConversationName,
} from "../utils/conversation.js";

export const formatDirectConversation = (convo, message_type = "direct") => {
  return {
    id: convo.id,
    type: convo.type,
    displayPicture:
      convo.displayPicture ??
      convo.conversation_members.map((user) => user.users.profilepic),
    lastMessageId: convo.last_message_id,
    conversationMembers: convo.conversation_members,
    conversationReads: convo.conversation_reads,
    messages: convo.messages,
    name:
      convo.name ??
      convo.conversation_members.map((user) => user.users.username),
    activeStatus: getActiveStatus(convo.conversation_members[0].users.id),
  };
};

export const formatGroupConversation = (conversation) => {
  return {
    id: conversation.id,
    type: conversation.type,
    displayPicture: conversation.displayPicture,
    lastMessageId: conversation.last_message_id,
    name: conversation.name,
    conversationMemebers: conversation.conversation_members.map((user) => {
      return {
        username: user.username,
        profilepic: user.profilepic,
        id: user.id,
      };
    }),
    conversationReads: conversation.conversation_reads.map((read) => {
      return {
        userId: read.userId,
        lastReadMessageId: read.last_read_message_id,
        updatedAt: read.updated_at,
      };
    }),
    messages: conversation.messages.map((message) => {
      return {
        id: message.id,
        content: message.content,
        senderId: message.sender_id,
        messageType: message.message_type,
        createdAt: message.created_at,
        editedAt: message.edited_at,
        deletedAt: message.deleted_at,
        users: message.users,
        attachments: message.attachments,
        messageReactions: message.message_reactions,
      };
    }),
  };
};

export const formatUserConversations = (conversations) => {
  return conversations.map((convo) => {
    return {
      id: convo.id,
      type: convo.type,
      name: getConversationName(convo),
      displayPicture: getDisplayPicture(convo),
      user: convo.conversation_members.map((u) => {
        return {
          id: u.users.id,
          username: u.users.username,
          profilePicture: u.users.profilepic,
          role: u.role,
        };
      }),
    };
  });
};

export const formatConversation = (conversation, user_id) => {
  if (!conversation) return null;
  console.log("user name", conversation.conversation_members[0].users.username);
  return {
    id: conversation.id,
    type: conversation.type,
    displayPicture: getDisplayPicture(conversation),
    lastMessageId: conversation.last_message_id,
    name: getConversationName(conversation),

    senderId: conversation.messages.map((convo) => convo.sender_id),
    conversationMembers: conversation.conversation_members
      .filter((member) => member.users.id !== user_id)
      .map((member) => ({
        id: member.users.id,
        username: member.users.username,
        profilePicture: member.users.profilepic,
      })),

    conversationReads:
      conversation.conversation_reads?.map((read) => ({
        userId: read.user_id,
        lastReadMessageId: read.last_read_message_id,
        updatedAt: read.updated_at,
      })) ?? [],

    messages:
      conversation.messages?.map((msg) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.sender_id,
        messageType: msg.message_type,
        createdAt: msg.created_at,
        editedAt: msg.edited_at,
        deletedAt: msg.deleted_at,
        sender: conversation.conversation_members.find(
          (user) => user.users.id === msg.sender_id,
        ).users,
        users: msg.users
          ? {
              id: msg.users.id,
              username: msg.users.username,
              profilePicture: msg.users.profilepic,
            }
          : null,

        attachments:
          msg.attachments?.map((att) => ({
            fileName: att.file_name,
            fileSize: att.file_size,
            fileUrl: att.file_url,
            createdAt: att.created_at,
            deletedAt: att.deleted_at,
          })) ?? [],

        messageReactions:
          msg.message_reactions?.map((r) => ({
            userId: r.user_id,
            reaction: r.reaction,
            createdAt: r.created_at,
          })) ?? [],
      })) ?? [],
  };
};
