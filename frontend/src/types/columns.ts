export type ColumnResponse = {
  data: ColumnType[];
};

export type ColumnType = {
  id: string;
  title: string;
  boardId: string;
  status: "In Progress" | "Completed" | "To Do";
  createdAt: Date;
  cards: CardType[];
};

export type CardType = {
  id: string;
  columnId: string;
  content: string;
  updatedAt: Date;
  state: string | null;
  title: string;
  dueDate: Date;
  assignee: string;
};
