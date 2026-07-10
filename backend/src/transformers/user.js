import { formatGetBoard } from "./boards.js";

export const formatGetUserProfile = (data, allBoards, allFriends, mutuals) => {
  const status = formatFriendshipStatus(data.friendshipStatus);
  return {
    id: data.id,
    email: data.email,
    username: data.username,
    password: data.password,
    profilepic: data.profilepic,
    createdAt: data.created_at,
    boards: formatBoardObject(allBoards),
    friends: formatFriendsObject(allFriends),
    mutuals: formatMutualsObject(mutuals),
    friendshipStatus: status.status,
    sender: status.sender,
  };
};

const formatFriendsObject = (friends) => {
  const res = friends.map((friend) => {
    return {
      id: friend.id,
      userId: friend.user_id,
      createdAt: friend.created_at,
      user: friend.user,
      status: friend.status,
      conversationId: friend.conversation_id,
    };
  });
  return res;
};

const formatBoardObject = (boards) => {
  const res = boards.map((board) => {
    return {
      id: board.id,
      title: board.title,
      createdAt: board.created_at,
      userId: board.user_id,
      progress: board.progress,
      ownerId: board.owner_id,
      updated_at: board.updatedAt,
    };
  });
  return res;
};

const formatMutualsObject = (mutuals) => {
  const res = mutuals.map((mutual) => {
    return {
      id: mutual.id,
      userId: mutual.user_id,
      createdAt: mutual.created_at,
      status: mutual.status,
      conversationId: mutual.conversation_id,
      user: mutual.user,
    };
  });
  return res;
};

const formatFriendshipStatus = (data) => {
  return {
    status: data.status,
    sender: data.friend.id ?? data.requester.id,
  };
};
