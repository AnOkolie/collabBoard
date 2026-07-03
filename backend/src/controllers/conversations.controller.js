import { prisma } from "../db/prisma.js";
import { getActiveStatus } from "../services/activeStatus.js";
import {
  formatGroupConversation,
  formatDirectConversation,
  formattedConversation,
  formatUserConversations,
} from "../transformers/conversations.js";

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
    return res.status(200).json({
      data: formatUserConversations(conversations),
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
    console.error("error getting group conversations", err);
    return res.status(500).json({ error: "Internal server error" });
  }
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
