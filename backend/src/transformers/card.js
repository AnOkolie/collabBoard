export const formatCardUpdateResponse = (card) => {
  return {
    id: card.id,
    columnId: card.column_id,
    content: card.content,
    updatedAt: card.updated_at,
    dueDate: card.due_date,
    state: card.state,
    title: card.title,
    assignee: card.assignee,
    createdAt: card.created_at,
  };
};
