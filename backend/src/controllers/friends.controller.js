import { prisma } from "../db/prisma.js";
import { formatAllFriendsResponse } from "../transformers/friends.js";
export const pendingFriend = async (user_id, friend_id) => {
  if (!user_id || !friend_id) {
    return { error: "Required fields are missing" };
  }
  try {
    const result = await prisma.friendship_requests.create({
      data: {
        user_id: user_id,
        friend_id: friend_id,
      },
    });

    if (!result) {
      return { message: "Failed to create a pending friend request" };
    }
    return {
      message: "Friend status has been updated to pending",
      data: result,
    };
  } catch (error) {
    console.error("Error creating pending request: ", error);
    return { error: error };
  }
};

export const updateFriendship = async (user_id, friend_id, status) => {
  if (!user_id || !friend_id) return;

  try {
    const deleted = await prisma.friendship_requests.deleteMany({
      where: {
        OR: [
          { user_id, friend_id },
          { user_id: friend_id, friend_id: user_id },
        ],
      },
    });

    if (deleted.count === 0) return;

    if (status !== "accepted") return;

    const friendship = await prisma.$transaction(async (tx) => {
      const conversation = await tx.conversations.create({
        data: {
          type: "direct",
          created_by: user_id,
          conversation_members: {
            create: [
              {
                user_id,
                joined_at: new Date(),
                role: "admin",
              },
              {
                user_id: friend_id,
                joined_at: new Date(),
                role: "admin",
              },
            ],
          },
        },
        select: { id: true },
      });

      const newFriend = await tx.friends.create({
        data: {
          user_id,
          friend_id,
          conversation_id: conversation.id,
        },
      });

      const friendUser = await tx.users.findUnique({
        where: { id: friend_id },
        select: { username: true },
      });

      return friendUser;
    });

    return {
      message: `You are now friends with ${friendship?.username ?? "user"}`,
    };
  } catch (error) {
    console.error("Error updating friend request: ", error);
    return { error };
  }
};

export const getFriendRequestReceived = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: "Required fields are missing" });
  }
  try {
    const result = await prisma.friendship_requests.findMany({
      where: {
        user_id: user_id,
      },
    });
    return res
      .status(200)
      .json({ message: "Friend Requests retrieved", data: result });
  } catch (err) {
    console.error("Error retrieving friend requests", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const rejectFriendship = async (user_id, friend_id) => {
  if (!user_id || !friend_id) {
    return { error: "Required fields are missing" };
  }
  try {
    const result = await prisma.friendship_requests.delete({
      where: {
        user_id: user_id,
        friend_id: friend_id,
      },
    });
    if (!result) {
      return { error: "Error rejecting friend request" };
    }
    return { message: "Friend Requests deleted", data: result };
  } catch (err) {
    console.error("Error retrieving friend requests", err);
    return { error: "Internal server error" };
  }
};

export const dropFriendship = async (user_id, friend_id) => {
  if (!user_id || !friend_id) {
    return { error: "Missing required fields" };
  }
  try {
    const friendship = await prisma.friendship_requests.findFirst({
      where: {
        user_id: user_id,
        friend_id: friend_id,
      },
      select: {
        user_id: true,
        friend_id: true,
      },
    });
    if (!friendship) {
      return { error: "No friendship object exists" };
    }

    const recipient = await prisma.users.findUnique({
      where: { id: friendship.friend_id },
      select: { username: true },
    });
    const res = await prisma.friendship_requests.delete({
      where: {
        user_id_friend_id: {
          user_id: user_id,
          friend_id: friend_id,
        },
      },
    });
    if (!res) {
      return { error: "No friendship object exists" };
    }
    return { message: `You've unfollowed user ${recipient.username}` };
  } catch (err) {
    console.error("Error removing pending friendhsip", err);
    return { error: "Internal server error" };
  }
};

function getRecipient(userId, friendId, senderId) {
  return senderId === userId ? friendId : userId;
}

export const getAllFriends = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const friends = await prisma.users.findFirst({
      where: {
        id: user_id,
      },
      select: {
        friendshipRequestsReceived: {
          select: {
            requester: {
              select: {
                username: true,
                email: true,
                profilepic: true,
                id: true,
              },
            },
            status: true,
          },
        },
        friendshipRequestsSent: {
          select: {
            recipient: {
              select: {
                username: true,
                email: true,
                profilepic: true,
                id: true,
              },
            },
            status: true,
            user_id: true,
          },
        },
        friendsInitiated: {
          select: {
            friend: {
              select: {
                username: true,
                email: true,
                profilepic: true,
                id: true,
              },
            },
            status: true,
            conversation_id: true,
          },
        },
        friendsReceived: {
          select: {
            user: {
              select: {
                username: true,
                email: true,
                profilepic: true,
                id: true,
              },
            },
            status: true,
            conversation_id: true,
          },
        },
      },
    });

    const friendsCombined = [
      ...friends.friendsInitiated,
      ...friends.friendsReceived,
      ...friends.friendshipRequestsReceived,
      ...friends.friendshipRequestsSent,
    ];

    return res.status(200).json({
      message: "User friendships",
      friends: formatAllFriendsResponse(friendsCombined),
    });
  } catch (err) {
    console.error("Error finding users friends", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
