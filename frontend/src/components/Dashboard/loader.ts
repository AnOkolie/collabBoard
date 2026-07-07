import {
  getCompleteTasks,
  getDashboardStats,
  getIncompleteTask,
} from "../../api/dashboard";
import { boardHistory } from "../../api/boardpage";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
export const dashboardLoader = async () => {
  const lastWeekDate = new Date(
    Date.now() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const id = useAuthStore.getState().authUser?.id;
  if (!id) return;
  const [completeTasks, inCompleteTasks, boardHistoryRes, dashboardStats] =
    await Promise.all([
      getCompleteTasks(id, lastWeekDate),
      getIncompleteTask(id),
      boardHistory(id),
      getDashboardStats(id),
    ]);
  return {
    completeTasks: completeTasks.data,
    inCompleteTasks: inCompleteTasks.data,
    stats: boardHistoryRes.data,
    dashboardStats: dashboardStats.data,
  };
};
