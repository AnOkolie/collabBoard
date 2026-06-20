import { createContext, useContext, useMemo, type ReactNode } from "react";
import { ReadyState } from "react-use-websocket";
import { useSocketConnection } from "../hooks/useSocketConnection";
import {
  useBoardInviteHandler,
  useTypedBoardMessage,
} from "../hooks/useBoardInvitations";

import { BoardSocketContextValue } from "../types/socket";
import { useFriendRequestNotifications } from "../hooks/useFriendRequestNotification";

const SocketContext = createContext<BoardSocketContextValue | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { sendJsonMessage, lastJsonMessage, readyState } =
    useSocketConnection();

  const typedMessage = useTypedBoardMessage(lastJsonMessage);

  const value = useMemo(
    () => ({
      sendJsonMessage,
      lastJsonMessage: typedMessage,
      readyState,
      isConnected: readyState === ReadyState.OPEN,
    }),
    [sendJsonMessage, typedMessage, readyState],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }

  return context;
};
