import { Badge } from "@mantine/core";
import { ReadyState } from "react-use-websocket";
import { useSocket } from "../../context/SocketContext";

export const SocketStatusBadge = () => {
  const { readyState } = useSocket();

  const label =
    readyState === ReadyState.OPEN
      ? "Live"
      : readyState === ReadyState.CONNECTING
        ? "Connecting"
        : "Offline";

  return <Badge>{label}</Badge>;
};
