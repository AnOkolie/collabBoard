import { Badge } from "@mantine/core";
import { ReadyState } from "react-use-websocket";
import { useBoardSocket } from "../../context/BoardSocketContext";

export const SocketStatusBadge = () => {
  const { readyState } = useBoardSocket();

  const label =
    readyState === ReadyState.OPEN
      ? "Live"
      : readyState === ReadyState.CONNECTING
        ? "Connecting"
        : "Offline";

  return <Badge>{label}</Badge>;
};
