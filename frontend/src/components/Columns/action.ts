import { addBoardColumn } from "../../api/columnview";

export const columnAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const columnTitle = formData.get("columnTitle") as string;
  const boardId = formData.get("boardId") as string;
  if (!columnTitle || !boardId) {
    return { error: true };
  }
  console.log(
    "columnAction called with columnTitle:",
    columnTitle,
    "boardId:",
    boardId,
  );
  return addBoardColumn(columnTitle, boardId);
};
