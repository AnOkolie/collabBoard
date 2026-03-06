export type boardResponse = {
  data: BoardType[];
};

export type BoardType = {
  id: string;
  title: string;
  description: string;
  user_id: string;
  progress: number;
  createdAt: Date;
};

export type BoardCreateRequest = {
  message: string;
  board: BoardType[];
};
