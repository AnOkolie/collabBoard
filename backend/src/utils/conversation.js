export const getDisplayPicture = (convo) => {
  if (!convo) return;
  try {
    if (convo.type === "group") {
      return convo.display_picture;
    }
    return convo.conversation_members.map((member) => member.users.profilepic);
  } catch (err) {
    console.error("error getting display picture", err);
  }
};

export const getConversationName = (convo) => {
  if (!convo) return;
  try {
    if (convo.type === "group") {
      return convo.name;
    }
    return convo.conversation_members[0].users.username;
  } catch (err) {
    console.error("error getting display picture", err);
  }
};
