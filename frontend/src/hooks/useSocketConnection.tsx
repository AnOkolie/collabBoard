import useWebSocket from "react-use-websocket";

export const useSocketConnection = () => {
  const token = localStorage.getItem("token");

  return useWebSocket(
    token ? `${import.meta.env.VITE_WS_URL}?token=${token}` : null,
    {
      share: true,
      shouldReconnect: () => true,
    },
  );
};
