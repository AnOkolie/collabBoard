import { JwtPayload, Jwt } from "jsonwebtoken";
import { jwtDecode } from "jwt-decode";
import { RequestMethods } from "../types/requests";
import { request } from "../utilities/requests";
import { useEffect } from "react";
import { useAuthStore } from "../zustand/authStore/useAuthStore";
import { refreshResponse } from "../types/auth";
export const useRefreshToken = () => {
  const token = useAuthStore((s) => s.token);
  const setToken = useAuthStore((s) => s.setToken);

  useEffect(() => {
    if (!token) return;

    const { exp } = jwtDecode<{ exp: number }>(token);

    const refreshIn = Math.max(exp * 1000 - Date.now() - 60_000, 0);

    const timer = setTimeout(async () => {
      const res = await request<refreshResponse>(
        RequestMethods.POST,
        "auth/refresh",
      );
      const newToken = res.data?.accessToken;

      if (!newToken) {
        useAuthStore.getState().logout();
        return;
      }

      setToken(newToken);
    }, refreshIn);

    return () => clearTimeout(timer);
  }, [token, setToken]);
};
