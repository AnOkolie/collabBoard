import { add } from "@dnd-kit/utilities";
import { addBoard, deleteBoard, renameBoard } from "../../api/boardpage";
import { rename } from "node:fs";

const addBoardAction = async (boardTitle: string) => {
  console.log("boardAction called with title:", boardTitle);
  if (typeof boardTitle !== "string" || !boardTitle.trim()) {
    return { error: "Board title is required", status: 400 };
  }
  return addBoard(boardTitle);
};

const renameAction = async (boardId: string, newTitle: string) => {
  console.log(
    "renameAction called with boardId:",
    boardId,
    "newTitle:",
    newTitle,
  );
  if (typeof newTitle !== "string" || !newTitle.trim()) {
    return { error: "New title is required", status: 400 };
  }
  return renameBoard(boardId, newTitle);
  // Implement rename logic here, e.g. call API to rename the board
};

const deleteAction = async (boardId: string) => {
  console.log("deleteAction called with boardId:", boardId);
  return deleteBoard(boardId);
  // Implement delete logic here, e.g. call API to delete the board
};

export const boardAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  switch (intent) {
    case "add-board":
      const boardTitle = formData.get("boardTitle");
      return await addBoardAction(boardTitle as string);
      break;
    case "rename-action":
      console.log("rename action triggered");
      return await renameAction(
        formData.get("boardId") as string,
        formData.get("newTitle") as string,
      );
    case "delete-action":
      console.log("delete action triggered");
      return await deleteAction(formData.get("boardId") as string);
    default:
      return { error: "Unknown action", status: 400 };
  }
};
