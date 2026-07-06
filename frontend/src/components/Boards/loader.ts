import { getBoards, boardHistory, getTasks } from "../../api/boardpage";
import { boardResponse, BoardHistoryResponse } from "../../types/boards";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { tasks } from "../../types/cards";
type combinedLoader = {
  data: {
    boards: boardResponse;
    stats: BoardHistoryResponse;
    tasks: tasks;
  };
  error: boolean;
};

export const boardLoader = async () => {
  const id = useAuthStore.getState().authUser?.id;
  if (!id) return;
  const [boardRes, boardHistoryRes, boardTasks] = await Promise.all([
    getBoards(id),
    boardHistory(id),
    getTasks(),
  ]);
  return {
    boards: boardRes.data,
    stats: boardHistoryRes.data,
    tasks: boardTasks.data,
  };
};
