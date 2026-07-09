import { create } from "zustand";
import { fullMessageResponse } from "../../types/messages";
import { userObject } from "../../types/user";

type MessageState = {
  messages: fullMessageResponse[];
  isTyping: boolean;
  typingUsers: userObject[];
  currentConversation: string;
  addMessage: (message: fullMessageResponse) => void;
  setMessage: (messages: fullMessageResponse[]) => void;
  setIsTyping: (state: boolean) => void;
  setCurrentConversation: (newId: string) => void;
  addTypingUser: (user: userObject) => void;
  removeTypinguser: (user: userObject) => void;
};

export const useMessageStore = create<MessageState>()((set) => ({
  messages: [],
  isTyping: false,
  typingUsers: [],
  currentConversation: "",
  addMessage: (message: fullMessageResponse) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessage: (message: fullMessageResponse[]) =>
    set(() => ({ messages: message })),
  setIsTyping: (state) => set(() => ({ isTyping: state })),
  setCurrentConversation: (newId) => set({ currentConversation: newId }),
  addTypingUser: (user) =>
    set((state) => ({ typingUsers: [...state.typingUsers, user] })),
  removeTypinguser: (user) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter(
        (currUser) => user.id !== currUser.id,
      ),
    })),
}));
