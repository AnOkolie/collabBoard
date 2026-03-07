export type ColumnResponse = {
  data: ColumnType[];
};

export type ColumnType = {
  id: string;
  title: string;
  board_id: string;
  status: "In Progress" | "Completed" | "To Do";
  createdAt: Date;
  cards: CardType[];
};

export type CardType = {
  id: string;
  column_id: string;
  content: string;
  updated_at: Date;
  state: string | null;
  title: string;
};
