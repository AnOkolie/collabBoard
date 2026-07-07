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
            columnId: card.column_id,
            content: card.content,
            updatedAt: card.updated_at,
            dueDate: card.due_date,
            state: card.state,
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
