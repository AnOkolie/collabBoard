import { useAuthStore } from "../zustand/authStore/useAuthStore";

export const useAuthUser = () => {
  const userId = useAuthStore((state) => state.authUser?.id);
  return {
    userId,
  };
};
