import { create } from "zustand";
import { CardType, ColumnType } from "../../types/columns";

type columnStoreProps = {
  boardId: string;
  columns: ColumnType[];
  setBoardId: (id: string) => void;
  setColumns: (columns: ColumnType[]) => void;
  addColumn: (column: ColumnType) => void;
  updatedColumn: (column: ColumnType) => void;
  deleteColumn: (column: ColumnType) => void;
  addCard: (card: CardType) => void;
  moveCard: (card: string, fromColumnId: string, toColumnId: string) => void;
  rollbackCardMove: (
    card: string,
    fromColumnId: string,
    toColumnId: string,
  ) => void;
  updateCard: (card: CardType) => void;
  deleteCard: (cardId: string, columnId: string) => void;
};

export const useColumnStore = create<columnStoreProps>()((set) => ({
  columns: [],
  boardId: "",
  setBoardId: (id) => set({ boardId: id }),
  setColumns: (columns) => set({ columns: columns }),
  addColumn: (column) =>
    set((state) => ({ columns: [...state.columns, column] })),
  addCard: (card) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === card.columnId
          ? { ...col, cards: [...col.cards, card] }
          : col,
      ),
    })),
  updatedColumn: (column) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === column.id ? column : col,
      ),
    })),
  deleteColumn: (column) =>
    set((state) => ({
      columns: state.columns.filter((col) => col.id !== column.id),
    })),
  moveCard: (cardId, fromColumnId, toColumnId) =>
    set((state) => {
      const card = state.columns
        .find((col) => col.id === fromColumnId)
        ?.cards.find((c) => c.id === cardId);

      if (!card) return state;

      return {
        columns: state.columns.map((col) => {
          // remove from old column
          if (col.id === fromColumnId) {
            return {
              ...col,
              cards: col.cards.filter((c) => c.id !== cardId),
            };
          }

          // add to new column
          if (col.id === toColumnId) {
            return {
              ...col,
              cards: [...col.cards, card],
            };
          }

          return col;
        }),
      };
    }),
  rollbackCardMove: (cardId, fromId, toId) =>
    set((state) => {
      const card = state.columns
        .find((col) => col.id === fromId)
        ?.cards.find((card) => card.id === cardId);
      if (!card) return state;
      return {
        columns: state.columns.map((col) => {
          if (col.id === fromId) {
            return {
              ...col,
              cards: col.cards.filter((card) => card.id !== cardId),
            };
          }
          if (col.id === toId) {
            return {
              ...col,
              cards: [...col.cards, card],
            };
          }
          return col;
        }),
      };
    }),
  updateCard: (card) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === card.columnId
          ? {
              ...col,
              cards: col.cards.map((oldCard) =>
                oldCard.id === card.id ? card : oldCard,
              ),
            }
          : col,
      ),
    })),
  deleteCard: (cardId, columnId) =>
    set((state) => ({
      columns: state.columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.filter((oldCard) => cardId !== oldCard.id),
            }
          : col,
      ),
    })),
}));
