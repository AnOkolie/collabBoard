import { request } from "../utilities/requests";
import {
  BoardCreateRequest,
  BoardHistoryResponse,
  boardResponse,
} from "../types/boards";
import { RequestMethods } from "../types/requests";
import { useAuthStore } from "../zustand/authStore/useAuthStore";
import { RequestResolve } from "../types/requests";

export const getBoards = async (): Promise<RequestResolve<boardResponse>> =>
  await request(
    RequestMethods.GET,
    `boards/${useAuthStore.getState().authUser?.id}`,
  );

export const addBoard = async (
  boardTitle: string,
): Promise<RequestResolve<BoardCreateRequest>> =>
  await request(
    RequestMethods.POST,
    `boards/${useAuthStore.getState().authUser?.id}`,
    undefined,
    JSON.stringify({ title: boardTitle }),
  );

export const renameBoard = async (
  boardId: string,
  newTitle: string,
): Promise<RequestResolve<BoardCreateRequest>> =>
  await request(
    RequestMethods.PUT,
    `boards/${boardId}`,
    undefined,
    JSON.stringify({ title: newTitle }),
  );

export const deleteBoard = async (boardId: string) =>
  await request(RequestMethods.DELETE, `boards/${boardId}`);

export const boardHistory = async (
  userId: string,
): Promise<RequestResolve<BoardHistoryResponse>> =>
  await request(RequestMethods.GET, `board-history-summary/${userId}`);
