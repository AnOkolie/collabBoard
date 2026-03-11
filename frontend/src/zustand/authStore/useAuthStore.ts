import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { userObject } from "../../types/user";
import { checkAuth } from "../../api/auth";

interface AuthState {
  authUser: userObject | null;
  isCheckingAuth: boolean;
  hasHydrated: boolean;
  setAuthUser: (user: userObject | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authUser: null,
      isCheckingAuth: false,
      hasHydrated: false,

      setAuthUser: (user) => set({ authUser: user }),
    }),
    {
      name: "auth-store",
      onRehydrateStorage: () => (state) => {
        // runs after state is loaded from localStorage
        state?.setAuthUser(state.authUser); // optional; forces state update
        state && (state.hasHydrated = true); // ⚠️ don’t mutate like this in strict TS setups
      },
    },
  ),
);
