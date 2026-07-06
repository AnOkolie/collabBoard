import { useSocket } from "../context/SocketContext";
import { useColumnStore } from "../zustand/columnStore/useColumnStore";
import { useCallback, useEffect } from "react";
import { moveCard as moveApi } from "../api/card";
import { useAuthStore } from "../zustand/authStore/useAuthStore";
export const useColumnHook = () => {
  const { sendJsonMessage, lastJsonMessage } = useSocket();
  const {
    boardId,
    addCard,
    addColumn,
    updateCard,
    updatedColumn,
    deleteCard,
    deleteColumn,
    moveCard,
    rollbackCardMove,
  } = useColumnStore();
  const userId = useAuthStore((s) => s.authUser?.id);
  useEffect(() => {
    if (!lastJsonMessage) return;
    const { type } = lastJsonMessage;
    switch (type) {
      case "column:created": {
        const { payload } = lastJsonMessage;
        const newColumn = payload;
        addColumn(newColumn);
        break;
      }
      case "column:deleted": {
        const { payload } = lastJsonMessage;
        const deletedColumn = payload;
        deleteColumn(deletedColumn);
        break;
      }
      case "column:updated": {
        const { payload } = lastJsonMessage;
        const newColumn = payload;
        updatedColumn(newColumn);
        break;
      }
      case "card:created": {
        const { payload } = lastJsonMessage;
        const { card } = payload;

        addCard(card);
        break;
      }

      case "card:moved": {
        const { payload } = lastJsonMessage;
        const { cardId, fromColumnId, toColumnId, userId: currUser } = payload;
        if (userId === currUser) return;
        moveCard(cardId, fromColumnId, toColumnId);
        break;
      }

      case "card:updated": {
        const { payload } = lastJsonMessage;
        const { card } = payload;

        updateCard(card);
        break;
      }

      case "card:deleted": {
        const { payload } = lastJsonMessage;
        const { cardId, columnId } = payload;

        deleteCard(cardId, columnId);
        break;
      }

      default:
        break;
    }
  }, [lastJsonMessage]);

  const sendWelcomeMessage = useCallback(() => {
    sendJsonMessage({
      type: "board:join",
      payload: {
        board_id: boardId,
      },
    });
  }, [sendJsonMessage]);

  const sendGoodbyeMessage = useCallback(() => {
    sendJsonMessage({
      type: "board:leave",
      payload: {
        board_id: boardId,
      },
    });
  }, [sendJsonMessage]);

  const sendBoardInvite = useCallback(
    (friendId: string) => {
      if (!userId || !friendId) return;
      sendJsonMessage({
        type: "board-invite",
        user_id: userId,
        friend_id: friendId,
        board_id: boardId,
        message: "Board invitation",
      });
    },
    [userId],
  );
  const rollbackMove = (cardId: string, fromId: string, toId: string) => {
    rollbackCardMove(cardId, fromId, toId);
  };
  const optimisticMoveCard = async (
    cardId: string,
    fromColumnId: string,
    toColumnId: string,
  ) => {
    moveCard(cardId, fromColumnId, toColumnId);
    try {
      const res = await moveApi(cardId, toColumnId, boardId);
      if (res.error) {
        throw new Error("failed update");
      }
    } catch (err) {
      rollbackMove(cardId, toColumnId, fromColumnId);
    }
  };
  return {
    moveCard,
    rollbackMove,
    optimisticMoveCard,
    sendBoardInvite,
    sendWelcomeMessage,
    sendGoodbyeMessage,
  };
};
