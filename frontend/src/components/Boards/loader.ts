import { redirect } from "react-router-dom";
import { getBoards, boardHistory } from "../../api/boardpage";
import { checkAuth, checkAuthOnLoad } from "../../api/auth";
import { boardResponse, BoardHistoryResponse } from "../../types/boards";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
type combinedLoader = {
  data: {
    boards: boardResponse;
    stats: BoardHistoryResponse;
  };
  error: boolean;
};

export const boardLoader = async () => {
  const checkAuth = await checkAuthOnLoad();
  const { id } = useAuthStore.getState().authUser || {};

  if (!checkAuth || checkAuth.data?.message !== "User is authenticated") {
    throw redirect("/login");
  }

  const [boardRes, boardHistoryRes] = await Promise.all([
    getBoards(),
    boardHistory(id!),
  ]);
  return {
    boards: boardRes.data,
    stats: boardHistoryRes.data,
  };
};
