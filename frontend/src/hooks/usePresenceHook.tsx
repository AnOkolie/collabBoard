import { useEffect } from "react";
import { useColumnHook } from "./useColumnHook";
import { useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { useColumnStore } from "../zustand/columnStore/useColumnStore";

export const usePresenceHook = () => {
  const { sendJsonMessage, lastJsonMessage, isConnected } = useSocket();
  const { boardId } = useColumnStore();
  useEffect(() => {
    if (!boardId || !isConnected) return;

    sendJsonMessage({
      type: "board:join",
      payload: {
        board_id: boardId,
      },
    });

    return () => {
      sendJsonMessage({
        type: "board:leave",
        payload: {
          board_id: boardId,
        },
      });
    };
  }, [boardId, isConnected, sendJsonMessage]);
};
