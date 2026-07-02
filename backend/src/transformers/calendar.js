export const formatDueDatesResponse = (events) =>
  events.map((event) => ({
    boardId: event.id,
    cards: event.columns.flatMap((column) =>
      column.cards.map((card) => ({
        cardId: card.id,
        title: card.title,
        content: card.content,
        dueDate: card.due_date,
      })),
    ),
  }));
