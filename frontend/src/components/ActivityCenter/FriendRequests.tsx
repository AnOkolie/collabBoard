import { Button, Text, Card, Stack, Flex } from "@mantine/core";

import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useSocket } from "../../context/SocketContext";
import { useRef } from "react";

import { FriendRequestStructure } from "../../types/friends";
import { ActivityData } from "~/types/activity";
type DisclosureHandlers = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

type ActivityCenterProps = {
  friendRequests: FriendRequestStructure[];
  removeFriendRequest: (friend: FriendRequestStructure) => void;
};

export const FriendRequests = ({
  friendRequests,
  removeFriendRequest,
}: ActivityCenterProps) => {
  if (!friendRequests) return null;
  const { sendJsonMessage, lastJsonMessage } = useSocket();
  const userId = useAuthStore((state) => state.authUser?.id);

  const handleClick = (
    friendId: string,
    response: "accepted" | "declined",
    friend: FriendRequestStructure,
  ) => {
    const myId = useAuthStore.getState().authUser?.id;
    if (!friendId || !response || !myId) return;
    sendJsonMessage({
      type: "friend-request:response",
      friend_id: friendId,
      user_id: myId,
      response: response,
    });
    removeFriendRequest(friend);
  };

  return (
    <>
      <Stack gap="sm">
        {friendRequests.length > 0 &&
          friendRequests.map((notif) => (
            <Card
              key={notif.friend_id}
              withBorder
              radius="md"
              p="sm"
              shadow="xs"
            >
              <Stack gap={6}>
                <Text size="sm">{`${notif.requester.username} wants to be your friend`}</Text>

                <Flex justify="flex-end" gap="xs">
                  <Button
                    size="xs"
                    color="green"
                    onClick={() =>
                      handleClick(notif.friend_id, "accepted", notif)
                    }
                  >
                    Accept
                  </Button>

                  <Button
                    size="xs"
                    variant="light"
                    color="red"
                    onClick={() =>
                      handleClick(notif.friend_id, "declined", notif)
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
