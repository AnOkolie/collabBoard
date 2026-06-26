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
        name: convo.name ?? convo.conversation_members[0].users.username,
        type: convo.type,
        displayPicture:
          convo.display_picture ??
          convo.conversation_members[0].users.profilepic ??
          null,
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
  console.log("url", req.url);
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

export const createDirectConversation = async (req, res) => {
  const currentUserId = req.user.id;
  const { friendId } = req.body;

  if (!friendId) {
    return res.status(400).json({
      error: "friendId required",
    });
  }

  try {
    const key = [currentUserId, friendId].sort().join(":");

    const existing = await prisma.conversations.findUnique({
      where: {
        direct_conversation_key: key,
      },
    });

    if (existing) {
      return res.status(200).json({
        data: existing,
      });
    }

    const conversation = await prisma.$transaction(async (tx) => {
      const created = await tx.conversations.create({
        data: {
          type: "direct",
          created_by: currentUserId,
          direct_conversation_key: key,
        },
      });

      await tx.conversation_members.createMany({
        data: [
          {
            conversation_id: created.id,
            user_id: currentUserId,
            role: "owner",
          },
          {
            conversation_id: created.id,
            user_id: friendId,
            role: "member",
          },
        ],
      });

      return created;
    });

    return res.status(201).json({
      data: conversation,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const createGroupConversation = async (req, res) => {
  const currentUserId = req.user.id;

  const { name, memberIds = [], display_picture } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "Group name required",
    });
  }

  try {
    const conversation = await prisma.$transaction(async (tx) => {
      const created = await tx.conversations.create({
        data: {
          type: "group",
          name,
          created_by: currentUserId,
          display_picture,
        },
      });

      await tx.conversation_members.createMany({
        data: [
          {
            conversation_id: created.id,
            user_id: currentUserId,
            role: "owner",
          },
          ...memberIds.map((id) => ({
            conversation_id: created.id,
            user_id: id,
            role: "member",
          })),
        ],
      });

      return created;
    });

    return res.status(201).json({
      data: conversation,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const formattedConversation = (convo) => {
  return {
    id: convo.id,
    displayPicture: convo.displayPicture,
    name: convo.name,
    type: convo.type,
  };
};

const formatDirectConversation = (convo) => {
  return {
    id: convo.id,
    type: convo.type,
    displayPicture:
      convo.displayPicture ?? convo.conversation_members.profilepic,
    directConversationKey: convo.direct_conversation_key,
    lastMessageId: convo.last_message_id,
    conversationMembers: convo.conversation_members,
    conversationReads: convo.conversation_reads,
    messages: convo.messages,
    name: convo.name ?? convo.conversation_members.username,
    activeStatus: getActiveStatus(convo.conversation_members.id),
  };
};
