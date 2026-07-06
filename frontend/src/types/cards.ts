export type addCardBody = {
  id: string;
  column_id: string;
  content: string;
  updated_at: Date;
  state: string | null;
  title: string;
};

export type tasks = {
  id: string;
  columnId: string;
  content: string;
  updatedAt: Date;
  state: string | null;
  title: string;
  dueDate: Date;
  assignee: string;
  boardId: string;
  conversationId: string;
};
