import { Button, Text, Card, Stack, Flex } from "@mantine/core";
import { BoardInvitesStructure } from "../../types/boards";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useSocket } from "../../context/SocketContext";
import { ActivityData } from "../../types/activity";
type DisclosureHandlers = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

type ActivityCenterProps = {
  boardInvites: BoardInvitesStructure[];
  setActivityNotif: React.Dispatch<React.SetStateAction<ActivityData>>;
};

export const BoardInvites = ({
  boardInvites,
  setActivityNotif,
}: ActivityCenterProps) => {
  if (!boardInvites) return null;
  const { sendJsonMessage } = useSocket();
  const userId = useAuthStore((state) => state.authUser?.id);

  const handleClick = (
    board_id: string,
    host_id: string,
    response: "accepted" | "declined",
  ) => {
    const myId = useAuthStore.getState().authUser?.id;
    if (!board_id || !host_id || !myId) return;
    sendJsonMessage({
      type: "board-invitation-response",
      board_id: board_id,
      user_id: myId,
      host_id: host_id,
      response: response,
    });
    setActivityNotif((prev) => ({
      prev,
      boardInvites: (prev.boardInvites ?? []).filter(
        (board) => board.board_id !== board_id,
      ),
    }));
  };

  return (
    <>
      <Stack gap="sm">
        {boardInvites.length > 0 &&
          boardInvites.map((notif) => (
            <Card key={notif.id} withBorder radius="md" p="sm" shadow="xs">
              <Stack gap={6}>
                <Text size="sm">{`You're invited to join board ${notif.boards.title}`}</Text>

                <Flex justify="flex-end" gap="xs">
                  <Button
                    size="xs"
                    color="green"
                    onClick={() =>
                      handleClick(notif.board_id, notif.host_id, "accepted")
                    }
                  >
                    Accept
                  </Button>

                  <Button
                    size="xs"
                    variant="light"
                    color="red"
                    onClick={() =>
                      handleClick(notif.board_id, notif.host_id, "declined")
                    }
                  >
                    Decline
                  </Button>
                </Flex>
              </Stack>
            </Card>
          ))}
      </Stack>
    </>
  );
};
