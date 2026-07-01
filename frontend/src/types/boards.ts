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
  ownerId: string;
  conversationId: string;
};

export type BoardCreateRequest = {
  message: string;
  board: BoardType[];
};

export type BoardHistoryResponse = {
  message: string;
  data: Record<string, number>;
};

export type BoardMembers = {
  id: string;
  username: string;
  email: string;
  profilepic: string;
  role: "owner" | "member" | "admin";
};

export type BoardMembersResponse = {
  message: string;
  data: BoardMembers[];
};

export type GetBoardInvites = {
  message: string;
  data: BoardInvitesStructure[];
};

export type BoardInvitesStructure = {
  title: string;
  host_id: string;
  board_id: string;
  id: string;
  alert: string;
  boards: {
    title: string;
  };
};
