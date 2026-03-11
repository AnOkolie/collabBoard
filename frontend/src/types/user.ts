export type userObject = {
  id: string;
  email: string;
  createdAt: Date;
  username: string;
  profilepic: string;
};

export type findUserResponse = {
  message: string;
  data: findUserBody[];
};

export type findUserBody = {
  id: string;
  email: string;
  username: string;
  profilepic: string;
};

export type SearchResponse = {
  data?: findUserBody[];
  error?: { error: string };
};
