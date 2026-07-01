import { create } from "zustand";

type boardStore = {
  boardId: string;
  setBoardId: (boardId: string) => void;
};

export const useBoardStore = create<boardStore>()((set) => ({
  boardId: "",
  setBoardId: (board_id: string) => set(() => ({ boardId: board_id })),
}));
