import { useMemo } from "react";
import useWebSocket from "react-use-websocket";
import { useAuthStore } from "../zustand/authStore/useAuthStore";

export const useSocketConnection = () => {
  const token = useAuthStore((s) => s.token);

  const socketUrl = useMemo(() => {
    if (!token) return null;

    return `${import.meta.env.VITE_WS_URL}?token=${token}`;
  }, [token]);

  return useWebSocket(socketUrl, {
    share: true,
    shouldReconnect: () => true,
  });
};
