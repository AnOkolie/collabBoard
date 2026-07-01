import { useFetcher } from "react-router-dom";
import { BoardInvitesStructure } from "../types/boards";
import { useEffect, useState } from "react";
import { useAuthStore } from "../zustand/authStore/useAuthStore";
import { FriendRequestStructure } from "../types/friends";
import { useSocket } from "../context/SocketContext";
import { ActivityData } from "../types/activity";
import { useActivityCentreStore } from "../zustand/activityCentreStore/useActivityCentreStore";

export const useActivityHook = () => {
  const fetcher = useFetcher<ActivityData>();
  const { lastJsonMessage } = useSocket();

  const userId = useAuthStore((s) => s.authUser?.id);
  const { setBoardActivity, setFriendActivity } = useActivityCentreStore();
  const [activityNotif, setActivityNotif] = useState<ActivityData>({
    boardInvites: [],
    friendRequests: [],
  });
  useEffect(() => {
    if (!userId) return;

    fetcher.load(`/activity/${userId}`);
  }, [userId]);

  useEffect(() => {
    if (!fetcher.data) return;
    setActivityNotif(fetcher.data);
    setBoardActivity(fetcher.data.boardInvites ?? []);
    setFriendActivity(fetcher.data.friendRequests ?? []);
  }, [fetcher.data]);

  return {
    activityNotif,
    setActivityNotif,
    isLoading: fetcher.state !== "idle",
  };
};
