export const formatGetColumns = (columns) => {
  try {
    return columns.map((column) => {
      return {
        id: column.id,
        boardId: column.board_id,
        title: column.title,
        cards: column.cards.map((card) => {
          return {
            id: card.id,
            columnId: card.columnId,
            content: card.content,
            updatedAt: card.updated_at,
            dueDate: card.due_date,
            state: column.title,
            title: card.title,
            createdAt: card.created_at,
          };
        }),
      };
    });
  } catch (err) {
    console.error("error getting columns", err);
  }
};
