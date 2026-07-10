export const generateMutualFriends = (
  currentUserFriends,
  targetUserFriends,
  currUser,
  targetUser,
) => {
  const currentUser = new Map();
  currentUserFriends.map((user) => {
    const id = user.user_id === currUser ? user.friend_id : user.user_id;
    currentUser.set(id, user);
  });
  const targetUserMap = new Map();
  targetUserFriends.map((user) => {
    const id = user.user_id === targetUser ? user.friend_id : user.user_id;
    targetUserMap.set(id, user);
  });

  if (currentUser.size < targetUserMap.size) {
    return compareFriends(currentUser, targetUserMap);
  }
  return compareFriends(targetUserMap, currentUser);
};

const compareFriends = (currUser, targetUser) => {
  //The first argument is the smaller map
  let mutuals = [];
  for (const [key, value] of currUser) {
    if (targetUser.has(key)) {
      const temp = targetUser.get(key);
      const user = {
        id: temp.id,
        user_id: key,
        created_at: temp.created_at,
        status: temp.status,
        conversation_id: temp.conversation_id,
        user: temp.user ?? temp.friend,
      };
      mutuals = [...mutuals, user];
    }
  }
  return mutuals;
};
