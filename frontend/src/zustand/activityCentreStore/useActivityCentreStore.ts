import { create } from "zustand";
import { activityCenter, ActivityData } from "../../types/activity";
import { BoardInvitesStructure } from "~/types/boards";
import { FriendRequestStructure } from "~/types/friends";
import { BoardInvites } from "~/components/ActivityCenter/BoardInvites";

type ActivityCentreState = {
  friendActivity: FriendRequestStructure[];
  boardActivity: BoardInvitesStructure[];
  setFriendActivity: (activity: FriendRequestStructure[]) => void;
  setBoardActivity: (activity: BoardInvitesStructure[]) => void;
  addFriendActivity: (activity: FriendRequestStructure) => void;
  addBoardActivity: (activity: BoardInvitesStructure) => void;
  removeFriendActivity: (activity: FriendRequestStructure) => void;
  removeBoardActivity: (activity: BoardInvitesStructure) => void;
};

export const useActivityCentreStore = create<ActivityCentreState>()((set) => ({
  friendActivity: [],
  boardActivity: [],
  setFriendActivity: (activities) => set({ friendActivity: activities }),
  setBoardActivity: (activities) => set({ boardActivity: activities }),
  addFriendActivity: (newActivity) =>
    set((state) => ({
      friendActivity: {
        ...state.friendActivity,
        newActivity,
      },
    })),
  addBoardActivity: (newActivity) =>
    set((state) => ({
      boardActivity: {
        ...state.boardActivity,
        newActivity,
      },
    })),
  removeFriendActivity: (oldActivity) =>
    set((state) => ({
      friendActivity: state.friendActivity.filter(
        (notif) => notif !== oldActivity,
      ),
    })),
  removeBoardActivity: (oldActivity) =>
    set((state) => ({
      boardActivity: state.boardActivity.filter(
        (notif) => notif !== oldActivity,
      ),
    })),
}));
