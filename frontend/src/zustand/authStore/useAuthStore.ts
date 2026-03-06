import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { userObject } from "../../types/user";
import { checkAuth } from "../../api/auth";

interface AuthState {
  authUser: userObject | null;
  isCheckingAuth: boolean;
  hasHydrated: boolean;
  setAuthUser: (user: userObject | null) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authUser: null,
      isCheckingAuth: false,
      hasHydrated: false,

      setAuthUser: (user) => set({ authUser: user }),

      checkAuth: async () => {
        try {
          set({ isCheckingAuth: true });
          const user = get().authUser;
          if (!user) return;

          const res = await checkAuth(user);
          set({ authUser: res.data?.user ?? null });
        } catch {
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },
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
