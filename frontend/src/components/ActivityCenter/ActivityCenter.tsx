import {
  Drawer,
  Button,
  Text,
  Card,
  Stack,
  Flex,
  Indicator,
} from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useFetcher } from "react-router-dom";
import { BoardInvitesStructure } from "../../types/boards";
import { useEffect, useState, useRef } from "react";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useBoardSocket } from "../../context/BoardSocketContext";

type DisclosureHandlers = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

type ActivityCenterProps = {
  notifDrawerHandler: DisclosureHandlers;
  notifDrawerOpened: boolean;
};

type fetcherType = {
  data: BoardInvitesStructure[];
};

export const ActivityCenter = ({
  notifDrawerHandler,
  notifDrawerOpened,
}: ActivityCenterProps) => {
  const { sendJsonMessage, lastJsonMessage } = useBoardSocket();
  const fetcher = useFetcher<fetcherType>();
  const userId = useAuthStore.getState().authUser?.id;
  const requestUserId = useRef<string | null>(null);
  const requestBoardId = useRef<string | null>(null);
  const [activityNotif, setActivityNotif] = useState<BoardInvitesStructure[]>(
    fetcher.data?.data || [],
  );

  const handleClick = (response: "accepted" | "declined") => {
    const myId = useAuthStore.getState().authUser?.id;
    if (!requestBoardId.current || !requestUserId.current || !myId) return;
    sendJsonMessage({
      type: "board-invitation-response",
      board_id: requestBoardId.current,
      user_id: myId,
      host_id: requestUserId.current,
      response: response,
    });
  };

  const updateFields = (boardId: string, userId: string) => {
    requestBoardId.current = boardId;
    requestUserId.current = userId;
  };
  useEffect(() => {
    if (!userId) return;

    fetcher.load(`/activity/${userId}`);
  }, [userId]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    const { type } = lastJsonMessage;
    if (type === "board-invite") {
      const newActivity = lastJsonMessage.payload;
      setActivityNotif([...activityNotif, newActivity]);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    setActivityNotif(fetcher.data?.data || []);
  }, [fetcher]);
  // const activityNotif = fetcher.data?.data ?? [];

  return (
    <>
      <Drawer
        opened={notifDrawerOpened}
        onClose={notifDrawerHandler.close}
        title="Activity"
        position="right"
        radius="xl"
        overlayProps={{ backgroundOpacity: 0.3, blur: 2 }}
        size="md"
      >
        <Stack gap="sm">
          {activityNotif.map((notif) => (
            <Card
              key={notif.id}
              withBorder
              radius="md"
              p="sm"
              shadow="xs"
              onClick={() => updateFields(notif.board_id, notif.host_id)}
            >
              <Stack gap={6}>
                <Text size="sm">{notif.alert}</Text>

                <Flex justify="flex-end" gap="xs">
                  <Button
                    size="xs"
                    color="green"
                    onClick={() => handleClick("accepted")}
                  >
                    Accept
                  </Button>

                  <Button
                    size="xs"
                    variant="light"
                    color="red"
                    onClick={() => handleClick("declined")}
                  >
                    Decline
                  </Button>
                </Flex>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Drawer>

      <Button
        variant="transparent"
        onClick={notifDrawerHandler.open}
        size="compact-lg"
      >
        <Indicator
          disabled={activityNotif.length === 0}
          size={10}
          offset={5}
          inline
          processing
          color="red"
        >
          <IconBell />
        </Indicator>
      </Button>
    </>
  );
};
