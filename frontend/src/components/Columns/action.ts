import { addBoardColumn } from "../../api/columnview";
import { createCard } from "../../api/card";

export const columnAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  switch (intent) {
    case "add-column":
      return await addBoard(
        formData.get("boardId") as string,
        formData.get("columnTitle") as string,
        formData.get("userId") as string,
      );
    case "add-card":
      return await addCard(
        formData.get("cardTitle") as string,
        formData.get("columnId") as string,
        formData.get("cardContent") as string,
        formData.get("boardId") as string,
        formData.get("due-date") as string,
      );
    default:
      return { error: true };
  }
};

const addBoard = async (
  boardId: string,
  columnTitle: string,
  userId: string,
) => {
  return addBoardColumn(columnTitle, boardId, userId);
};

const addCard = async (
  cardTitle: string,
  columnId: string,
  cardContent: string,
  boardId: string,
  dueDate: string,
) => {
  return await createCard(cardTitle, columnId, cardContent, boardId, dueDate);
};
