import { RequestMethods } from "../types/requests";
import { request } from "../utilities/requests";
import { RequestResolve } from "../types/requests";
import { addCardBody } from "../types/cards";
import { useAuthStore } from "../zustand/authStore/useAuthStore";

export const createCard = async (
  cardTitle: string,
  columnId: string,
  cardContent: string,
  boardId: string,
  dueDate: string,
): Promise<RequestResolve<addCardBody>> =>
  await request(
    RequestMethods.POST,
    `column/${columnId}/cards`,
    undefined,
    JSON.stringify({
      title: cardTitle,
      content: cardContent,
      board_id: boardId,
      due_date: dueDate,
    }),
  );

export const moveCard = async (
  cardId: string,
  columnId: string,
  boardId: string,
): Promise<RequestResolve<addCardBody>> => {
  const userId = useAuthStore.getState().authUser?.id;
  if (!userId) throw new Error("User not authenticated");
  return await request(
    RequestMethods.PATCH,
    `cards/${cardId}/move`,
    undefined,
    JSON.stringify({ column_id: columnId, board_id: boardId, user_id: userId }),
  );
};
