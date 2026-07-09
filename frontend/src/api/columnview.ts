import { RequestMethods, RequestResolve } from "../types/requests";
import { request } from "../utilities/requests";
import { ColumnResponse } from "../types/columns";
import { BoardMembersResponse } from "../types/boards";

export const getBoardColumns = async (
  boardId: string,
): Promise<RequestResolve<ColumnResponse>> =>
  await request(RequestMethods.GET, `boards/${boardId}/columns`);

export const addBoardColumn = async (
  columnTitle: string,
  boardId: string,
  userId: string,
): Promise<RequestResolve<ColumnResponse>> =>
  await request(
    RequestMethods.POST,
    `boards/${boardId}/columns`,
    undefined,
    JSON.stringify({ title: columnTitle, userId: userId }),
  );

export const getBoardMembers = async (
  boardId: string,
): Promise<RequestResolve<BoardMembersResponse>> =>
  await request(RequestMethods.GET, `boards/members/${boardId}`);
