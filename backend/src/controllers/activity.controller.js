import { prisma } from "../db/prisma.js";

export const getActivity = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const friendRequests = await prisma.friendship_requests.findMany({
      select: {
        friend_id: true,
        user_id: true,
        requester: {
          select: {
            username: true,
          },
        },
        created_at: true,
      },
      where: {
        friend_id: user_id,
        status: "pending",
      },
    });

    const boardInvites = await prisma.board_invitations.findMany({
      where: {
        invited_user_id: user_id,
        status: "pending",
      },
      select: {
        id: true,
        board_id: true,
        host_id: true,
        boards: {
          select: {
            title: true,
            conversations: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    return res.status(200).json({
      message: "Notifications retrieved",
      friendRequests,
      boardInvites,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
