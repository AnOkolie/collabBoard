import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { displayNotifications } from "../utilities/displayNotifications";
import { Button, Group } from "@mantine/core";
import { useAuthStore } from "../zustand/authStore/useAuthStore";
import {
  BoardSocketContextValue,
  BoardSocketMessage,
  IncomingBoardEvent,
} from "../types/socket";

const BoardSocketContext = createContext<BoardSocketContextValue | null>(null);

export const BoardSocketProvider = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  const socketUrl = `${import.meta.env.VITE_WS_URL}?token=${token}`;
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      share: true,
      shouldReconnect: () => true,
    },
  );
  const requestUserId = useRef<string | null>(null);
  const requestBoardId = useRef<string | null>(null);

  const typedLastJsonMessage =
    lastJsonMessage &&
    typeof lastJsonMessage === "object" &&
    "type" in lastJsonMessage
      ? (lastJsonMessage as IncomingBoardEvent)
      : null;

  const handleClick = (response: "accepted" | "declined") => {
    const myId = useAuthStore.getState().authUser?.id;
    if (!requestBoardId.current || !requestUserId.current || !myId) return;
    sendJsonMessage({
      type: "board-invitation-response",
      board_id: requestBoardId.current,
      user_id: myId,
      host_id: requestUserId.current,
      response: response,
    });
  };

  useEffect(() => {
    if (!typedLastJsonMessage) return;
    const type = typedLastJsonMessage.type;

    switch (type) {
      case "board-invite":
        const boardId = typedLastJsonMessage.payload.board_id;
        const host_id = typedLastJsonMessage.payload.host_id;
        if (!boardId || !host_id) return;
        requestBoardId.current = boardId;
        requestUserId.current = host_id;
        displayNotifications(
          "Board Invitation",
          <Group mt="sm">
            <Button
              size="xs"
              color="blue"
              onClick={() => handleClick("accepted")}
            >
              Accept
            </Button>
            <Button
              size="xs"
              color="gray"
              variant="outline"
              onClick={() => handleClick("declined")}
            >
              Decline
            </Button>
          </Group>,
          "green",
        );
        break;
      case "board:joined":
        const { message } = typedLastJsonMessage;
        displayNotifications("Accepted", message, "green");
        break;
      case "error":
        displayNotifications(
          "Board Invitation",
          typedLastJsonMessage.message,
          "red",
        );
        break;
      default:
    }
  }, [typedLastJsonMessage]);

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
