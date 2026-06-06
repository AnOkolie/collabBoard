import { ReadyState } from "react-use-websocket";
import { CardType, ColumnType } from "./columns";
import { BoardType } from "./boards";
import { OnlineUsers } from "./user";

export type SocketMessage =
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
    };

export type BoardSocketMessage = {
  type: string;
  payload: { user_id: string; board_id?: string; host_id: string };
  message: string;
};

export type BoardSocketContextValue = {
  sendJsonMessage: (message: SocketMessage) => void;
  lastJsonMessage: IncomingBoardEvent | null;
  readyState: ReadyState;
  isConnected: boolean;
};

export type IncomingBoardEvent =
  | {
      type: "board-invite";
      payload: {
        board_id: string;
        host_id: string;
        title: string;
        id: string;
        alert: string;
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
      type: "online-users:update";
      data: OnlineUsers;
    }
  | {
      type: "offline-users:update";
      data: OnlineUsers;
    }
  | {
      type: "online-users:list";
      data: OnlineUsers[];
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
      type: "error";
      message: string;
    };
