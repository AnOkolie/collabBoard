import { useMemo, useRef, useEffect, useCallback } from "react";
import { IncomingBoardEvent } from "../types/socket/incomingMessages";
import { useAuthStore } from "../zustand/authStore/useAuthStore";
import { displayNotifications } from "../utilities/notification/displayNotifications";
import { Box, Button, Group } from "@mantine/core";
import { BoardType } from "../types/boards";
import { useBoardStore } from "../zustand/useBoardStore/useBoardStore";
import { BoardInvites } from "~/components/ActivityCenter/BoardInvites";
export const useTypedBoardMessage = (lastJsonMessage: any) => {
  return useMemo(() => {
    if (
      !lastJsonMessage ||
      typeof lastJsonMessage !== "object" ||
      !("type" in lastJsonMessage)
    ) {
      return null;
    }

    return lastJsonMessage as IncomingBoardEvent;
  }, [lastJsonMessage]);
};

export const useBoardInviteHandler = (
  message: IncomingBoardEvent | null,
  sendJsonMessage: (msg: any) => void,
) => {
  const requestUserId = useRef<string | null>(null);
  const requestBoardId = useRef<string | null>(null);

  const handleClick = (response: "accepted" | "declined") => {
    const myId = useAuthStore.getState().authUser?.id;

    if (!requestBoardId.current || !requestUserId.current || !myId) return;

    sendJsonMessage({
      type: "board-invitation-response",
      board_id: requestBoardId.current,
      user_id: myId,
      host_id: requestUserId.current,
      response,
    });
  };

  useEffect(() => {
    if (!message) return;

    switch (message.type) {
      case "board-invite": {
        const { board_id, host_id } = message.payload;
        if (!board_id || !host_id) return;

        requestBoardId.current = board_id;
        requestUserId.current = host_id;

        displayNotifications(
          "Board Invitation",
          <Group mt="sm">
            <Button size="xs" onClick={() => handleClick("accepted")}>
              Accept
            </Button>
            <Button
              size="xs"
              variant="outline"
              onClick={() => handleClick("declined")}
            >
              Decline
            </Button>
          </Group>,
          "green",
        );

        break;
      }

      case "board:joined":
        displayNotifications("Accepted", message.message, "green");
        break;

      case "boards:error":
        displayNotifications("Board Invitation", message.message, "red");
        break;
    }
  }, [message]);

  const updateCurrentBoard = useCallback((board: BoardType) => {
    const { setCurrBoard } = useBoardStore();
    setCurrBoard(board);
  }, []);
  return {
    updateCurrentBoard,
  };
};
