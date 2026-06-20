import { userObject } from "./user";

export type UserConversation = {
  id: string;
  name: string;
  type: string;
  displayPicture: string;
  directConversationKey: string;
  user: {
    username: string;
    profilePicture: string;
    id: string;
    role: string;
  };
};

export type directConversation = {
  message: string;
  conversation: {
    id: string;
    type: string;
    display_picture: string;
    name: string;
  };
};
export type fullConversation = {
  userId: string;
  conversationId: string;
  role: ["member", "owner", "admin"];
  type: ["direct", "group"];
  name: string;
  createdBy: string;
  displayPicture: string;
  directConversationKey: ["direct"];
  conversationMembers: userObject[];
  messages: messagesResponse;
  conversationReads: conversation_reads;
};

export type conversationMessage = {
  id: string;
  conversationMembers: {
    users: conversationUsersBody;
  }[];
  type: string;
  messages: {
    id: string;
    content: string;
    senderId: string;
    messageType: string;
    createdAt: string;
    editedAt: string;
    deletedAt: string;
    users: conversationUsersBody;
    attachments: {
      fileName: string;
      fileSize: number;
      fileUrl: string;
      createdAt: string;
      deletedAt: string;
    }[];
    messageReactions: {
      userId: string;
      reaction: string;
      createdAt: string;
    }[];
  }[];
  directConversationKey: string;
  displayPicture: string;
  conversationReads: {
    userId: string;
    lastReadMessageId: string;
    updatedAt: string;
  }[];
  lastMessageId: string;
  name: string;
};

type conversationUsersBody = {
  username: string;
  profilepic: string;
  id: string;
};

export type messageBody = {
  conversationId: string;
  senderId: string;
  content: string;
  messageType: string[];
  attachments: attachmentBody[];
};

export type attachmentBody = {
  fileName: string;
  fileSize: number;
};

export type messagesResponse = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: string[];
  createdAt: Date;
  editedAt: Date;
  deletedAt: Date;
  attachments: attachments;
  conversation_reads: conversation_reads;
  messageReactions: message_reactions;
};

type attachments = {
  id: string;
  messageId: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: Number;
};

type message_reactions = {
  messageId: string;
  userId: string;
  reaction: string;
  createdAt: string;
};

type conversation_reads = {
  conversationId: string;
  userId: string;
  lastReadMessageId: string;
  updatedAt: string;
};

export type combinedLoader = {
  data: {
    conversations: UserConversation[];
    messages: messagesResponse[];
  };
  error: boolean;
};
