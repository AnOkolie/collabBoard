// useFriendSocket.ts
import { useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuthStore } from "../zustand/authStore/useAuthStore";
import { useNavigate } from "react-router-dom";

export const useFriendSocket = () => {
  const { sendJsonMessage, isConnected } = useSocket();

  const currentUserId = useAuthStore((state) => state.authUser?.id);
  const navigate = useNavigate();
  const sendFriendRequest = useCallback(
    (friendId: string) => {
      if (!currentUserId || !friendId || !isConnected) return;

      sendJsonMessage({
        type: "friend:request-sent",
        user_id: currentUserId,
        friend_id: friendId,
        message: "Lets be friends please",
      });
    },
    [currentUserId, isConnected, sendJsonMessage],
  );

  const respondToFriendRequest = useCallback(
    (requesterId: string, response: "accepted" | "decline") => {
      if (!currentUserId || !requesterId || !isConnected) return;
      sendJsonMessage({
        type: `friend:request-response`,
        user_id: requesterId,
        friend_id: currentUserId,
        response,
      });
    },
    [currentUserId, isConnected, sendJsonMessage],
  );
  const viewUserProfile = (userId: string, friendId: string) => {
    navigate(`/profile/${getFriendId(friendId, userId)}`);
  };
  const getFriendId = (userId: string, friendId: string) => {
    return userId === currentUserId ? friendId : userId;
  };
  return {
    viewUserProfile,
    sendFriendRequest,
    respondToFriendRequest,
  };
};
