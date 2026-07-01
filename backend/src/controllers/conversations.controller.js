import { prisma } from "../db/prisma.js";
import { getActiveStatus } from "../services/activeStatus.js";

export const getUserConversations = async (req, res) => {
  const { user_id } = req.params;

  try {
    const conversations = await prisma.conversations.findMany({
      where: {
        conversation_members: {
          some: {
            user_id: {
              in: [user_id],
            },
          },
        },
      },
      select: {
        conversation_members: {
          select: {
            users: {
              select: {
                id: true,
                username: true,
                profilepic: true,
              },
            },
            role: true,
          },
          where: {
            user_id: {
              not: user_id,
            },
          },
        },
        id: true,
        type: true,
        name: true,
        display_picture: true,
        direct_conversation_key: true,
      },
      orderBy: {
        last_message_at: "desc",
      },
    });
    if (!conversations) {
      return res.status(400).json({
        error: "Conversations not found",
      });
    }

    const formattedConversations = conversations.map((convo) => {
      return {
        id: convo.id,
        type: convo.type,
        name:
          convo.name ??
          convo.conversation_members.map((member) => member.users.username),
        displayPicture:
          convo.display_picture ??
          convo.conversation_members.map((member) => {
            member.users.profilepic;
          }),
        directConversationKey: convo.direct_conversation_key ?? null,
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
    return res.status(200).json({
      data: formattedConversations,
    });
  } catch (err) {
    console.error("error finding user conversations:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getDirectConversation = async (req, res) => {
  const friend_id = req.query.friend_id;
  const { user_id } = req.params;
  if (!friend_id || !user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const conversation = await prisma.conversations.findFirst({
      where: {
        type: "direct",
        conversation_members: {
          some: {
            user_id: {
              in: [user_id, friend_id],
            },
          },
        },
      },
      select: {
        id: true,
        type: true,
        conversation_members: {
          where: {
            user_id: friend_id,
          },
          select: {
            users: {
              select: {
                id: true,
                username: true,
                profilepic: true,
              },
            },
          },
        },
        name: true,
        direct_conversation_key: true,
        last_message_id: true,
        messages: {
          select: {
            id: true,
            conversation_id: true,
            sender_id: true,
            content: true,
            users: {
              select: {
                profilepic: true,
                username: true,
                id: true,
              },
            },
            message_type: true,
            message_reactions: true,
            conversation_reads: true,
            created_at: true,
            edited_at: true,
            metadata: true,
            attachments: true,
          },
          orderBy: {
            created_at: "asc",
          },
        },
        conversation_reads: true,
      },
    });
    if (!conversation) {
      const newConversation = await prisma.conversations.create({
        data: {
          created_by: user_id,
          conversation_members: {
            create: [
              { user_id: user_id, role: "member" },
              { user_id: friend_id, role: "member" },
            ],
          },
          type: "direct",
          direct_conversation_key:
            user_id < friend_id
              ? `${user_id}:${friend_id}`
              : `${friend_id}:${user_id}`,
        },
        select: {
          id: true,
          type: true,
          conversation_members: {
            where: {
              user_id: friend_id,
            },
            select: {
              users: {
                select: {
                  id: true,
                  username: true,
                  profilepic: true,
                },
              },
            },
          },
          name: true,
          direct_conversation_key: true,
          last_message_id: true,
          messages: true,
          conversation_reads: true,
        },
      });

      return res.status(201).json({
        message: "New conversation created",
        conversation: formatDirectConversation(newConversation),
      });
    }
    return res.status(200).json({
      message: "Conversation found",
      conversation: formatDirectConversation(conversation),
    });
  } catch (err) {
    console.error("Error retrieving conversations (direct)", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const getGroupConversation = async (req, res) => {
  const { board_id } = req.params;
  if (!board_id) {
    return res.status(400).json({ error: "Missing Required fields" });
  }
  try {
    const board = await prisma.boards.findUnique({
      where: {
        id: board_id,
      },
      include: {
        board_members: true,
        conversations: {
          include: {
            conversation_members: true,
            conversation_reads: true,
            messages: {
              orderBy: {
                created_at: "asc",
              },
              include: {
                users: {
                  select: {
                    id: true,
                    username: true,
                    profilepic: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!board) {
      return res.status(404).json({
        error: "Board not found",
      });
    }
    return res.status(200).json({
      message: "Group conversation found",
      data: formatGroupConversation(board.conversations) ?? null,
    });
  } catch (err) {
    console.log("error getting group conversations", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const formattedConversation = (convo) => {
  if (!convo) return;
  return {
    id: convo.id,
    displayPicture: convo.displayPicture,
    name: convo.name,
    type: convo.type,
  };
};

const formatDirectConversation = (convo, message_type = "direct") => {
  return {
    id: convo.id,
    type: convo.type,
    displayPicture:
      convo.displayPicture ??
      (message_type === "direct" && convo.conversation_members.profilepic),
    directConversationKey: convo.direct_conversation_key,
    lastMessageId: convo.last_message_id,
    conversationMembers: convo.conversation_members,
    conversationReads: convo.conversation_reads,
    messages: convo.messages,
    name: convo.name ?? convo.conversation_members.users[0].username,
    activeStatus: getActiveStatus(convo.conversation_members[0].users.id),
  };
};

const formatGroupConversation = (conversation) => {
  return {
    id: conversation.id,
    type: conversation.type,
    directConversationKey: conversation.direct_conversation_key,
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

export const getConversationMembers = async (conversation_id, sender_id) => {
  if (!conversation_id) {
    return { error: "Missing required fields" };
  }
  try {
    const members = await prisma.conversation_members.findMany({
      where: {
        conversation_id: conversation_id,
        user_id: {
          notIn: [sender_id],
        },
      },
      select: {
        user_id: true,
      },
    });
    const user = await prisma.conversation_members.findFirst({
      where: {
        conversation_id: conversation_id,
        user_id: sender_id,
      },
      select: {
        users: true,
      },
    });
    return { message: "Members found", data: members ?? [], user: user };
  } catch (err) {
    console.error("error retrieving members", err);
    return { error: "Internal server error" };
  }
};
