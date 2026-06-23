import { BoardInvitesStructure } from "./boards";
import { FriendRequestStructure } from "./friends";
export type activityCenter = {
  boardInvites?: BoardInvitesStructure;
  friendInvites?: FriendRequestStructure;
};

export type ActivityData = {
  boardInvites?: BoardInvitesStructure[];
  friendRequests?: FriendRequestStructure[];
};
