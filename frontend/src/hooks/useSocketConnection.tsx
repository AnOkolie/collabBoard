import { useMemo, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { useAuthStore } from "../zustand/authStore/useAuthStore";
import { RequestMethods } from "../types/requests";
import { request } from "../utilities/requests";
import { refreshResponse } from "../types/auth";
export const useSocketConnection = () => {
  const token = useAuthStore((s) => s.token);
  const setToken = useAuthStore((s) => s.setToken);
  const refreshing = useRef(false);
  const socketUrl = useMemo(() => {
    if (!token) return null;

    return `${import.meta.env.VITE_WS_URL}?token=${token}`;
  }, [token]);

  return useWebSocket(socketUrl, {
    share: true,
    onClose: async (event) => {
      if (event.code === 4001 && !refreshing.current) {
        refreshing.current = true;

        try {
          const response = await request<refreshResponse>(
            RequestMethods.POST,

            "auth/refresh",
          );

          const newToken = response.data?.accessToken;

          if (!newToken) {
            useAuthStore.getState().logout();

            return;
          }

          setToken(newToken);
        } finally {
          refreshing.current = false;
        }
      }
    },
    shouldReconnect: () => {
      if (refreshing.current) {
        return false;
      }

      if (refreshing.current) return false;

      const token = useAuthStore.getState().token;

      return Boolean(token);
    },
    reconnectAttempts: 10,

    reconnectInterval: (attemptNumber) =>
      Math.min(1000 * 2 ** attemptNumber, 10000),
  });
};
