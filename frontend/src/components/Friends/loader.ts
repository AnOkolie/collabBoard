import { getAllFriends } from "../../api/friends";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";

export const friendLoader = async () => {
  const userId = useAuthStore.getState().authUser?.id;
  if (!userId) return;

  const result = await getAllFriends(userId);
  return result.data;
};
