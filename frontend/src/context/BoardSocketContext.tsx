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
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    "ws://localhost:3000",
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
    console.log("handle invite response");
    const myId = useAuthStore.getState().authUser?.id;
    if (!requestBoardId.current || !requestUserId.current || !myId) return;
    console.log("sending invite response...");
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
        console.log("board_invite: ", typedLastJsonMessage);
        const boardId = typedLastJsonMessage.payload.board_id;
        const host_id = typedLastJsonMessage.payload.host_id;
        console.log(`board_id: ${boardId} and host_id: ${host_id}`);
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
        console.log("board:joined message");
        const { message } = typedLastJsonMessage;
        displayNotifications("Accepted", message, "green");
        break;
      case "error":
        console.log(typedLastJsonMessage.message);
        displayNotifications(
          "Board Invitation",
          typedLastJsonMessage.message,
          "red",
        );
        break;
      default:
        console.log("invalid case");
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
