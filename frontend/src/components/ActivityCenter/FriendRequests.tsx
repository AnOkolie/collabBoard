import { Button, Text, Card, Stack, Flex } from "@mantine/core";

import { useAuthStore } from "../../zustand/authStore/useAuthStore";

import { FriendRequestStructure } from "../../types/friends";

import { useFriendSocket } from "../../hooks/useFriendSocket";
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
  const userId = useAuthStore((s) => s.authUser?.id);
  const { respondToFriendRequest } = useFriendSocket();
  const handleClick = (
    friendId: string,
    response: "accepted" | "decline",
    friend: FriendRequestStructure,
  ) => {
    if (!friendId || !response) return;
    respondToFriendRequest(friendId, response);
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
                      handleClick(notif.user_id, "accepted", notif)
                    }
                  >
                    Accept
                  </Button>

                  <Button
                    size="xs"
                    variant="light"
                    color="red"
                    onClick={() => handleClick(notif.user_id, "decline", notif)}
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
