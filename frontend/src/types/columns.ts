export type ColumnResponse = {
  data: ColumnType[];
};

export type ColumnType = {
  id: string;
  title: string;
  board_id: string;
  status: "In Progress" | "Completed" | "To Do";
  createdAt: Date;
};
