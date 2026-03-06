import { getBoardColumns } from "../../api/columnview";
import { LoaderFunctionArgs } from "react-router-dom";

export const columnLoader = async ({ params }: LoaderFunctionArgs) => {
  console.log("column loader called with params:", params);
  const boardId = params.board_id;
  if (!boardId) {
    return { error: "Board ID is required", status: 400 };
  }
  console.log("column loading for board id:", boardId);
  const res = await getBoardColumns(boardId);
  if (res.data) {
    console.log("boards", res.data);
    return { data: res.data };
  }
  return { error: true };
};
