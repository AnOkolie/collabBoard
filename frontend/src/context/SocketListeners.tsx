import { useSocket } from "./SocketContext";
import { useTypedBoardMessage } from "../hooks/useBoardInvitations";
import { useMessage } from "../hooks/useMessage";
import { useSocketEvents } from "../hooks/useSocketEvents";
export const SocketListeners = () => {
  const { lastJsonMessage, sendJsonMessage } = useSocket();

  const typedMessage = useTypedBoardMessage(lastJsonMessage);

  useSocketEvents(typedMessage, sendJsonMessage);
  useMessage();
  return null;
};
