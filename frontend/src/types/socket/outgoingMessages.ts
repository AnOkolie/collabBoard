import { CardType, ColumnType } from "../columns";
import { messageBody } from "../messages";

export type OutgoingMessage =
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
      type: "friend-request:sent";
      user_id: string;
      friend_id: string;
      message: string;
    }
  | {
      type: "friend-request:response";
      user_id: string;
      friend_id: string;
      response: string;
    }
  | {
      type: "friend-request:unsend";
      user_id: string;
      friend_id: string;
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
    }
  | {
      type: "board-invitation-response";
      board_id: string;
      user_id: string;
      host_id: string;
      response: string;
    }
  | {
      type: "board:joined";
      board_id: string;
      user_id: string;
    }
  | {
      type: "card:created";
      payload: {
        boardId: string;
        columnId: string;
        card: CardType;
      };
    }
  | {
      type: "card:moved";
      payload: {
        boardId: string;
        cardId: string;
        fromColumnId: string;
        toColumnId: string;
      };
    }
  | {
      type: "card:updated";
      payload: {
        boardId: string;
        card: CardType;
      };
    }
  | {
      type: "card:deleted";
      payload: {
        boardId: string;
        cardId: string;
        columnId: string;
      };
    }
  | { type: "column:created" }
  | { type: "column:updated" }
  | { type: "column:deleted" }
  | {
      type: "board:leave";
      payload: {
        board_id: string;
      };
    }
  | {
      type: "board:join";
      payload: {
        board_id: string;
      };
    }
  | {
      type: "updateOnline";
      payload: {
        user_id: string;
        profilePic: string;
        activity: string;
      };
    }
  | {
      type: "message:sent";
      payload: {
        conversation_id: string;
        message: messageBody;
      };
    }
  | {
      type: "messages:fetch";
      payload: {
        user_id: string;
        recipient_id: string[];
        type: string;
      };
    }
  | {
      type: "typing:true";
      payload: {
        conversation_id: string;
        sender_id: string;
      };
    }
  | {
      type: "typing:false";
      payload: {
        conversation_id: string;
        sender_id: string;
      };
    };
