export const formatGetBoard = (boards) => {
  if (!boards) return;
  try {
    const boardList = boards.map((board) => {
      console.log("id", board.id);
      return {
        id: board.id,
        title: board.title,
        ownerId: board.owner_id,
        createdAt: board.created_at,
        updatedAt: board.updated_at,
        progress: board.progress,
        role: board.board_members.role,
        conversationId: board.conversations.id,
        boardMembers: board.board_members,
      };
    });
    return boardList;
  } catch (err) {
    console.error("formatting error", err);
  }
};

export const generateUserJoinSystemMessage = (user) => {
  return `${user.username} has joined this message channel!`;
};
