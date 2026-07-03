import { create } from "zustand";
import { BoardType } from "~/types/boards";

type boardStore = {
  boardId: string;
  setBoardId: (boardId: string) => void;
  userBoards: BoardType[];
  setUserBoards: (boards: BoardType[]) => void;
  addUserBoard: (board: BoardType) => void;
  removeUserBoard: (board: BoardType) => void;
};

export const useBoardStore = create<boardStore>()((set) => ({
  boardId: "",
  userBoards: [],
  setBoardId: (board_id: string) => set(() => ({ boardId: board_id })),
  setUserBoards: (boards) => set({ userBoards: boards }),
  addUserBoard: (board) =>
    set((state) => ({ userBoards: [...state.userBoards, board] })),
  removeUserBoard: (board) =>
    set((state) => ({
      userBoards: state.userBoards.filter(
        (currBoard) => currBoard.id != board.id,
      ),
    })),
}));
