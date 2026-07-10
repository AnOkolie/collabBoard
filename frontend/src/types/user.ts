export type userObject = {
  id: string;
  email: string;
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
  friendshipStatus: "friends" | "pending" | "blocked" | null;
  sender: string;
};

export type SearchResponse = {
  data?: findUserBody[];
  error?: { error: string };
};

export type OnlineUsers = {
  activity: string;
  id: string;
  profilepic: string;
  username: string;
};

export type userProfileResponse = {
  data: profile;
};
export type profile = {
  id: string;
  username: string;
  profilepic: string;
  createdAt: string;
  email: string;
  friendshipStatus: "friends" | "pending" | "blocked" | null;
  sender: string;
  boards: profileBoards[];
  friends: profileFriends[];
  mutuals: profileMutuals[];
};

export type profileBoards = {
  id: string;
  title: string;
  createdAt: string;
  userId: string;
  progress: number;
  ownerId: string;
};

export type profileFriends = {
  id: string;
  userId: string;
  createdAt: string;
  user: userObject;
  status: string;
  conversationId: string;
};

export type profileMutuals = {
  id: string;
  userId: string;
  createdAt: string;
  status: string;
  conversationId: string;
  user: userObject;
};
