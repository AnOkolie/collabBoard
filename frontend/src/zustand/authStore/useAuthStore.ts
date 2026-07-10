import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { userObject } from "../../types/user";
import { logout } from "../../api/logout";

interface AuthState {
  authUser: userObject | null;
  isCheckingAuth: boolean;
  hasHydrated: boolean;
  setAuthUser: (user: userObject | null) => void;
  logout: () => void;
  token: string;
  setToken: (token: string) => void;
  deleteToken: () => void;
  setCheckingAuth: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      authUser: null,
      isCheckingAuth: false,
      hasHydrated: false,
      token: "",
      setToken: (token) => set(() => ({ token: token })),
      deleteToken: () => set(() => ({ token: "" })),
      setCheckingAuth: (state) => set(() => ({ isCheckingAuth: state })),
      setAuthUser: (user) => set({ authUser: user }),
      logout: () => () => logout(),
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
