export type FriendRequestStructure = {
  user_id: string;
  friend_id: string;
  message: string;
  requester: {
    username: string;
  };
};
