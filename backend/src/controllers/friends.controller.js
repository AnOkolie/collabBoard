import { prisma } from "../db/prisma.js";
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
    console.log("Error creating pending request: ", error);
    return { error: error };
  }
};

export const updateFriendship = async (user_id, friend_id, status) => {
  if (!user_id || !friend_id) {
    return;
  }
  try {
    const acceptRequest = await prisma.friendship_requests.deleteMany({
      where: {
        OR: [
          {
            user_id,
            friend_id,
          },
          {
            user_id: friend_id,
            friend_id: user_id,
          },
        ],
      },
    });
    if (!acceptRequest) {
      return;
    }
    if (status === "accepted") {
      const makeFriends = await prisma.friends.create({
        data: {
          friend_id: friend_id,
          user_id: user_id,
        },
      });
      const new_friend = await prisma.users.findUnique({
        where: {
          id: friend_id,
        },
        select: {
          username: true,
        },
      });
      if (!makeFriends) {
        return { message: "Failed to update friend request" };
      }
      return { message: `You are now friends with ${new_friend.username}` };
    }
  } catch (error) {
    console.log("Error updating friend request: ", error);
    return { error: error };
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
  console.log("rejecting friendship...");
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
    console.log(friends.friendsReceived);

    return res.status(200).json({
      message: "User friendships",
      friends: formatResponse(friendsCombined),
    });
  } catch (err) {
    console.error("Error finding users friends", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const formatResponse = (friends) => {
  const result = friends.map((friend) => {
    return {
      id:
        friend.requester?.id ??
        friend.recipient?.id ??
        friend.friend?.id ??
        friend.user?.id,
      username:
        friend.requester?.username ??
        friend.recipient?.username ??
        friend.friend?.username ??
        friend.user?.username,
      email:
        friend.requester?.email ??
        friend.recipient?.email ??
        friend.friend?.email ??
        friend.user?.email,
      profilepic:
        friend.requester?.profilepic ??
        friend.recipient?.profilepic ??
        friend.friend?.profilepic ??
        friend.user?.profilepic,
      friendshipStatus: friend.status,
      sender:
        friend.requester?.id ??
        friend.user_id ??
        friend.user?.id ??
        friend.friend?.id,
    };
  });
  return result;
};
