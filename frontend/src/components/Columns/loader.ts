import { useColumnStore } from "../../zustand/columnStore/useColumnStore";
import { getBoardColumns, getBoardMembers } from "../../api/columnview";
import { LoaderFunctionArgs } from "react-router-dom";

export const columnLoader = async ({ params }: LoaderFunctionArgs) => {
  const boardId = params.board_id;
  if (!boardId) {
    return { error: "Board ID is required", status: 400 };
  }
  const [columns, members] = await Promise.all([
    getBoardColumns(boardId),
    getBoardMembers(boardId),
  ]);
  const setBoardId = useColumnStore.getState().setBoardId;
  const firstColumn = columns.data?.columns[0];
  if (firstColumn?.boardId) {
    setBoardId(firstColumn.boardId);
  }
  return {
    columns: columns.data,
    members: members.data,
  };
};
