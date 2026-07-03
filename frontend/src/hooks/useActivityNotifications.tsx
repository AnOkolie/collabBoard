import { useFetcher } from "react-router-dom";
import { BoardInvitesStructure } from "../types/boards";
import { useEffect, useState } from "react";
import { useAuthStore } from "../zustand/authStore/useAuthStore";
import { FriendRequestStructure } from "../types/friends";
import { useSocket } from "../context/SocketContext";
import { ActivityData } from "../types/activity";
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
