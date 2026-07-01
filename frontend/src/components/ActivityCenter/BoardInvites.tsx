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
  removeBoardInvite: (invite: BoardInvitesStructure) => void;
};

export const BoardInvites = ({
  boardInvites,
  removeBoardInvite,
}: ActivityCenterProps) => {
  if (!boardInvites) return null;
  const { sendJsonMessage } = useSocket();
  const userId = useAuthStore((state) => state.authUser?.id);

  const handleClick = (
    board_id: string,
    host_id: string,
    response: "accepted" | "declined",
    invite: BoardInvitesStructure,
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
    removeBoardInvite(invite);
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
                      handleClick(
                        notif.board_id,
                        notif.host_id,
                        "accepted",
                        notif,
                      )
                    }
                  >
                    Accept
                  </Button>

                  <Button
                    size="xs"
                    variant="light"
                    color="red"
                    onClick={() =>
                      handleClick(
                        notif.board_id,
                        notif.host_id,
                        "declined",
                        notif,
                      )
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
