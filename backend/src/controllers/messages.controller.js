import { prisma } from "../db/prisma.js";
export const getMessagesById = async (req, res) => {
  const { conversation_id, user_id } = req.params;
  console.log(user_id);
  try {
    const conversation = await prisma.conversations.findUnique({
      where: {
        id: conversation_id,
      },
      select: {
        id: true,
        conversation_members: {
          select: {
            users: {
              select: {
                username: true,
                profilepic: true,
                id: true,
              },
            },
          },
        },
        type: true,
        messages: {
          select: {
            id: true,
            message_reactions: {
              select: {
                user_id: true,
                reaction: true,
                created_at: true,
              },
            },
            content: true,
            sender_id: true,
            users: {
              select: {
                id: true,
                username: true,
                profilepic: true,
              },
            },
            attachments: {
              select: {
                file_name: true,
                file_size: true,
                file_url: true,
                created_at: true,
                deleted_at: true,
              },
            },
            edited_at: true,
            created_at: true,
            deleted_at: true,
            conversation_id: true,
            message_type: true,
          },
          orderBy: {
            created_at: "asc",
          },
          take: 50,
        },
        direct_conversation_key: true,
        display_picture: true,
        conversation_reads: {
          select: {
            user_id: true,
            last_read_message_id: true,
            updated_at: true,
            conversation_id: true,
          },
        },
        last_message_id: true,
        name: true,
      },
    });
    if (conversation && conversation.type === "direct") {
      conversation.conversation_members =
        conversation.conversation_members.filter(
          (member) => member.users.id !== user_id,
        );
      conversation.name = conversation.conversation_members[0].users.username;
    }
    return res.status(200).json({
      data: formatConversation(conversation),
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;

  try {
    const message = await prisma.messages.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      return res.status(404).json({
        error: "Message not found",
      });
    }

    if (message.sender_id !== userId) {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }

    await prisma.messages.update({
      where: {
        id: messageId,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return res.status(200).json({
      message: "Message deleted",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user.id;
  const { content } = req.body;

  try {
    const message = await prisma.messages.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      return res.status(404).json({
        error: "Message not found",
      });
    }

    if (message.sender_id !== userId) {
      return res.status(403).json({
        error: "Unauthorized",
      });
    }

    const updated = await prisma.messages.update({
      where: {
        id: messageId,
      },
      data: {
        content,
        edited_at: new Date(),
      },
    });

    return res.status(200).json({
      data: updated,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const createMessage = async (
  sender_id,
  conversation_id,
  content,
  message_type,
  attachments,
) => {
  try {
    const membership = await prisma.conversation_members.findUnique({
      where: {
        conversation_id_user_id: {
          conversation_id,
          user_id: sender_id,
        },
      },
    });

    if (!membership) {
      return { error: "Cant send message" };
    }

    const message = await prisma.$transaction(async (tx) => {
      const created = await tx.messages.create({
        data: {
          conversation_id,
          sender_id: sender_id,
          content,
          message_type,
          attachments: {
            create: attachments,
          },
        },
        select: {
          id: true,
          attachments: true,
          sender_id: true,
          conversation_id: true,
          content: true,
          message_type: true,
          conversations: {
            select: {
              conversation_members: {
                where: {
                  user_id: {
                    not: sender_id,
                  },
                },
                select: {
                  users: {
                    select: {
                      id: true,
                      username: true,
                    },
                  },
                },
              },
              conversation_reads: true,
              created_at: true,
              created_by: true,
            },
          },
          edited_at: true,
          deleted_at: true,
          message_reactions: true,
          metadata: true,
        },
      });

      await tx.conversations.update({
        where: {
          id: conversation_id,
        },
        data: {
          last_message_id: created.id,
          last_message_at: created.created_at,
          updated_at: new Date(),
        },
      });
      await tx.conversation_members.findMany({
        where: {
          conversation_id: conversation_id,
        },
      });
      return created;
    });

    return {
      data: message,
    };
  } catch (err) {
    console.error(err);

    return {
      error: "Internal server error",
    };
  }
};

export const addReaction = async (req, res) => {
  const { reactions, user_id } = req.body;
  const { message_id } = req.params;

  if (!message_id || reactions) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const result = await prisma.message_reactions.update({
      where: {
        message_id: message_id,
      },
      data: {
        reaction: reactions,
        user_id: user_id,
      },
    });
    if (!result) {
      return res.status(404).json({ message: "Message not found" });
    }
    return res
      .status(201)
      .json({ message: "Reaction added", reaction: result });
  } catch (err) {
    console.error("Error adding reaction", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteReaction = async (req, res) => {
  const { message_id, user_id } = req.params;
  if (!message_id || !user_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const result = prisma.message_reactions.delete({
      where: {
        message_id: message_id,
        user_id: user_id,
      },
    });
    if (!result) {
      return res.status(404).json({ error: "Message reaction not found" });
    }
    return res
      .status(200)
      .json({ message: "Reaction deleted successfully", data: result });
  } catch (err) {
    console.error("Error deleting reaction", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const formatConversation = (conversation) => {
  if (!conversation) return null;

  return {
    id: conversation.id,
    type: conversation.type,
    displayPicture: conversation.display_picture,
    directConversationKey: conversation.direct_conversation_key,
    lastMessageId: conversation.last_message_id,
    name: conversation.name,

    conversationMembers: conversation.conversation_members.map((member) => ({
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
