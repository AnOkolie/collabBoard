export type FriendRequestStructure = {
  user_id: string;
  friend_id: string;
  message: string;
  requester: {
    username: string;
  };
};

export type allFriends = {
  id: string;
  username: string;
  email: string;
  profilepic: string;
  sender: string;
  friendshipStatus: "friends" | "pending" | "blocked" | null;
};
