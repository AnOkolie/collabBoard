import { useSocket } from "./SocketContext";
import { useFriendRequestNotifications } from "../hooks/useFriendRequestNotification";
import {
  useBoardInviteHandler,
  useTypedBoardMessage,
} from "../hooks/useBoardInvitations";
import { useMessage } from "../hooks/useMessage";
import { useSocketEvents } from "../hooks/useSocketEvents";
export const SocketListeners = () => {
  const { lastJsonMessage, sendJsonMessage } = useSocket();

  const typedMessage = useTypedBoardMessage(lastJsonMessage);

  // useFriendRequestNotifications(typedMessage);
  // useBoardInviteHandler(typedMessage, sendJsonMessage);
  useSocketEvents(typedMessage, sendJsonMessage);
  useMessage();
  return null;
};
