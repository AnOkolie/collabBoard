// useFriendSocket.ts
import { useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuthStore } from "../zustand/authStore/useAuthStore";

export const useFriendSocket = () => {
  const { sendJsonMessage, isConnected } = useSocket();

  const currentUserId = useAuthStore((state) => state.authUser?.id);

  const sendFriendRequest = useCallback(
    (friendId: string) => {
      if (!currentUserId || !friendId || !isConnected) return;

      sendJsonMessage({
        type: "friend-request:sent",
        user_id: currentUserId,
        friend_id: friendId,
        message: "Lets be friends please",
      });
    },
    [currentUserId, isConnected, sendJsonMessage],
  );

  const respondToFriendRequest = useCallback(
    (requesterId: string, response: "accepted" | "declined") => {
      if (!currentUserId || !requesterId || !isConnected) return;

      sendJsonMessage({
        type: "friend-request:response",
        user_id: requesterId,
        friend_id: currentUserId,
        response,
      });
    },
    [currentUserId, isConnected, sendJsonMessage],
  );

  return {
    sendFriendRequest,
    respondToFriendRequest,
  };
};
