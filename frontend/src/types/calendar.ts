export type eventsResponse = {
  boardId: string;
  cards: cardEntry[];
};

type cardEntry = {
  cardId: string;
  title: string;
  content: string;
  dueDate: string;
};

export type loaderData = {
  data: eventsResponse[];
};
