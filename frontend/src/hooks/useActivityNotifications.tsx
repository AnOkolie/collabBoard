import { useActivityCentreStore } from "../zustand/activityCentreStore/useActivityCentreStore";

export const useActivityHook = () => {
  const boardInvites = useActivityCentreStore((s) => s.boardActivity);
  const friendRequests = useActivityCentreStore((s) => s.friendActivity);

  return {
    activityNotif: {
      boardInvites,
      friendRequests,
    },
  };
};
