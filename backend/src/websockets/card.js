import { updateCards } from "../controllers/card.controller.js";
import { formatCardUpdateResponse } from "../transformers/card.js";
import { userSocketMap } from "./socket.js";
import { getBoardRoom } from "./room.js";
import { broadcastBoard } from "./boards.js";
export const updateCardDetails = async (board_id, card, ws) => {
  if (!board_id || !card) {
    ws.send(
      JSON.stringify({
        type: "card:error",
        error: "Missing required fields",
      }),
    );
    return;
  }
  try {
    const result = await updateCards(card, board_id);
    if (result.error) {
      ws.send(
        JSON.stringify({
          type: "card:error",
          error: result.error,
        }),
      );
      return;
    }
    const message = {
      type: "card:updated",
      payload: {
        card: formatCardUpdateResponse(result.data),
      },
    };
    await broadcastBoard(board_id, message);
  } catch (err) {
    console.error("error updating card", err);
    ws.send(
      JSON.stringify({
        type: "card:error",
        error: "Error updating card details",
      }),
    );
  }
};
