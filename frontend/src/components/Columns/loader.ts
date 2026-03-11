import { ColumnResponse } from "../../types/columns";
import { getBoardColumns, getBoardMembers } from "../../api/columnview";
import { LoaderFunctionArgs } from "react-router-dom";
import { BoardMembers } from "~/types/boards";

export const columnLoader = async ({ params }: LoaderFunctionArgs) => {
  console.log("column loader called with params:", params);
  const boardId = params.board_id;
  if (!boardId) {
    return { error: "Board ID is required", status: 400 };
  }
  console.log("column loading for board id:", boardId);
  const [columns, members] = await Promise.all([
    getBoardColumns(boardId),
    getBoardMembers(boardId),
  ]);
  return {
    data: {
      columns: columns.data,
      members: members.data,
    },
  };
};
