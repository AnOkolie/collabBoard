export const formatAllFriendsResponse = (friends) => {
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
      conversationId:
        friend.user?.conversation_id ?? friend.friend?.conversation_id,
    };
  });
  return result;
};
