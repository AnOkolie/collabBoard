import { useSocket } from "./SocketContext";
import { useFriendRequestNotifications } from "../hooks/useFriendRequestNotification";
import { useTypedBoardMessage } from "../hooks/useBoardInvitations";
export const SocketListeners = () => {
  const { lastJsonMessage, sendJsonMessage } = useSocket();

  const typedMessage = useTypedBoardMessage(lastJsonMessage);

  useFriendRequestNotifications(typedMessage);

  return null;
};
