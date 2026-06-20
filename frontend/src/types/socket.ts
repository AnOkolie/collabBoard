import { ReadyState } from "react-use-websocket";
import { OutgoingMessage } from "./socket/outgoingMessages";
import { IncomingBoardEvent } from "./socket/incomingMessages";

export type BoardSocketContextValue = {
  sendJsonMessage: (message: OutgoingMessage) => void;
  lastJsonMessage: IncomingBoardEvent | null;
  readyState: ReadyState;
  isConnected: boolean;
};
