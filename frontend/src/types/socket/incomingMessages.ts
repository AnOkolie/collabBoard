import { ReadyState } from "react-use-websocket";
import { CardType, ColumnType } from "../columns";
import { BoardType } from "../boards";
import { OnlineUsers, userObject } from "../user";
import { fullMessageResponse, messagesResponse } from "../messages";

export type IncomingBoardEvent =
  | {
      type: "board-invite";
      payload: {
        board_id: string;
        host_id: string;
        title: string;
        id: string;
        alert: string;
        boards: {
          title: string;
        };
      };
      message: string;
    }
  | {
      type: "card:created";
      payload: {
        boardId: string;
        columnId: string;
        card: CardType;
      };
      message: string;
    }
  | {
      type: "card:moved";
      payload: {
        userId: string;
        boardId: string;
        cardId: string;
        fromColumnId: string;
        toColumnId: string;
      };
      message: string;
    }
  | {
      type: "card:updated";
      payload: {
        boardId: string;
        card: CardType;
      };
      message: string;
    }
  | {
      type: "card:deleted";
      payload: {
        boardId: string;
        cardId: string;
        columnId: string;
      };
      message: string;
    }
  | {
      type: "board:updated";
      payload: BoardType;
    }
  | {
      type: "board:deleted";
      payload: BoardType;
    }
  | {
      type: "board:joined";
      message: string;
      payload: BoardType;
    }
  | {
      type: "column:updated";
      payload: ColumnType;
    }
  | {
      type: "column:created";
      payload: ColumnType;
    }
  | {
      type: "column:deleted";
      payload: ColumnType;
    }
  | {
      type: "card:updated";
      payload: {
        card: CardType;
      };
    }
  | {
      type: "online-users:update";
      payload: OnlineUsers;
    }
  | {
      type: "offline-users:update";
      payload: OnlineUsers;
    }
  | {
      type: "online-users:list";
      payload: OnlineUsers[];
    }
  | {
      type: "user:joined";
      payload: OnlineUsers;
    }
  | {
      type: "user:left";
      payload: OnlineUsers;
    }
  | {
      type: "user-joined:init";
      user_id: string;
      payload: OnlineUsers[];
    }
  | {
      type: "friends:error";
      message: string;
    }
  | {
      type: "boards:error";
      message: string;
    }
  | {
      type: "message:received";
      payload: fullMessageResponse;
    }
  | {
      type: "friend-request:received";
      message: string;
      payload: {
        user_id: string;
        friend_id: string;
        message: string;
        requester: {
          username: string;
        };
      };
    }
  | {
      type: "friend-request:accepted";
      message: string;
    }
  | {
      type: "friend-request:removed";
      message: string;
    }
  | {
      type: "typing:start";
      user_id: string;
      conversationId: string;
      users: userObject;
    }
  | {
      type: "typing:stop";
      user_id: string;
      conversationId: string;
      users: userObject;
    }
  | {
      type: "typing:error";
      message: string;
    };
