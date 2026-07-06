import { CardType } from "../types/columns";
import { useSocket } from "../context/SocketContext";

export const useCardHook = () => {
  const { sendJsonMessage } = useSocket();
  const updateCardDetails = (card: CardType, boardId: string) => {
    sendJsonMessage({
      type: "card:update",
      payload: {
        boardId: boardId,
        card: card,
      },
    });
  };
  return {
    updateCardDetails,
  };
};
