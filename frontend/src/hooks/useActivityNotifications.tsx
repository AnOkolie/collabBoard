import { useFetcher } from "react-router-dom";
import { BoardInvitesStructure } from "../types/boards";
import { useEffect, useState } from "react";
import { useAuthStore } from "../zustand/authStore/useAuthStore";
import { FriendRequestStructure } from "../types/friends";
import { useSocket } from "../context/SocketContext";

type ActivityData = {
  boardInvites?: BoardInvitesStructure[];
  friendRequests?: FriendRequestStructure[];
};

export const useActivityHook = () => {
  const fetcher = useFetcher<ActivityData>();
  const { lastJsonMessage } = useSocket();

  const userId = useAuthStore((s) => s.authUser?.id);
  const [activityNotif, setActivityNotif] = useState<ActivityData>({
    boardInvites: [],
    friendRequests: [],
  });
  useEffect(() => {
    if (!userId) return;

    fetcher.load(`/activity/${userId}`);
  }, [userId]);

  useEffect(() => {
    if (!lastJsonMessage) return;

    switch (lastJsonMessage.type) {
      case "friend-request:received":
        setActivityNotif((prev) => ({
          ...prev,
          friendRequests: [
            ...(prev.friendRequests ?? []),
            lastJsonMessage.payload,
          ],
        }));
        break;

      case "board-invite":
        setActivityNotif((prev) => ({
          ...prev,
          boardInvites: [
            ...(prev?.boardInvites ?? []),
            lastJsonMessage.payload,
          ],
        }));
        break;

      default:
        break;
    }
  }, [lastJsonMessage]);
  useEffect(() => {
    if (!fetcher.data) return;

    setActivityNotif(fetcher.data);
  }, [fetcher.data]);

  return {
    activityNotif,
    isLoading: fetcher.state !== "idle",
  };
};
