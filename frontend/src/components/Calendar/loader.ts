import { getTaskDetails } from "../../api/calendar";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";

export const calendarLoader = async () => {
  const userId = useAuthStore.getState().authUser?.id;
  if (!userId) return;
  const result = await getTaskDetails(userId);
  if (result.error) {
    console.error("error getting event details", result.error);
  }
  return result.data;
};
