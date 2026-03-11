import { createContext, useContext, useMemo, type ReactNode } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

type SocketMessage =
  | {
      type: "card:moved";
      cardId: string;
      boardId: string;
      fromColumnId: string;
      toColumnId: string;
    }
  | {
      type: "card:created";
      boardId: string;
      columnId: string;
      card: unknown;
    }
  | {
      type: "ping";
    }
  | {
      type: "friend-request";
      user_id: string;
      friend_id: string;
      message: string;
    }
  | {
      type: "accept-friend-request";
      user_id: string;
      friend_id: string;
    }
  | {
      type: "board-invite";
      user_id: string;
      friend_id: string;
      board_id: string;
      message: string;
    };

type BoardSocketMessage = {
  type: string;
  payload: unknown;
  message: string;
};

type BoardSocketContextValue = {
  sendJsonMessage: (message: SocketMessage) => void;
  lastJsonMessage: BoardSocketMessage | null;
  readyState: ReadyState;
  isConnected: boolean;
};

const BoardSocketContext = createContext<BoardSocketContextValue | null>(null);

export const BoardSocketProvider = ({ children }: { children: ReactNode }) => {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    "ws://localhost:3000",
    {
      share: true,
      shouldReconnect: () => true,
    },
  );

  const typedLastJsonMessage =
    lastJsonMessage &&
    typeof lastJsonMessage === "object" &&
    "type" in lastJsonMessage
      ? (lastJsonMessage as BoardSocketMessage)
      : null;

  const value = useMemo(
    () => ({
      sendJsonMessage,
      lastJsonMessage: typedLastJsonMessage,
      readyState,
      isConnected: readyState === ReadyState.OPEN,
    }),
    [sendJsonMessage, typedLastJsonMessage, readyState],
  );

  return (
    <BoardSocketContext.Provider value={value}>
      {children}
    </BoardSocketContext.Provider>
  );
};

export const useBoardSocket = () => {
  const context = useContext(BoardSocketContext);

  if (!context) {
    throw new Error("useBoardSocket must be used inside BoardSocketProvider");
  }

  return context;
};
