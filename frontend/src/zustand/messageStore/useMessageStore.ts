import { create } from "zustand";
import {
  conversationMessage,
  fullMessageResponse,
  messageBody,
} from "../../types/messages";

type MessageState = {
  messages: fullMessageResponse[];
  addMessage: (message: fullMessageResponse) => void;
  setMessage: (messages: fullMessageResponse[]) => void;
};

export const useMessageStore = create<MessageState>()((set) => ({
  messages: [],
  addMessage: (message: fullMessageResponse) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessage: (message: fullMessageResponse[]) =>
    set(() => ({ messages: message })),
}));
