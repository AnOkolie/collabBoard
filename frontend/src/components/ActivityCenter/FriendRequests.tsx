import {
  Button,
  Text,
  Card,
  Stack,
  Flex,
  CloseButton,
  Group,
  Avatar,
} from "@mantine/core";

import { useAuthStore } from "../../zustand/authStore/useAuthStore";

import { FriendRequestStructure } from "../../types/friends";

import { useFriendSocket } from "../../hooks/useFriendSocket";
import {
  ACCEPT_REQUEST_BTN,
  FRIEND_REQUEST_TEXT,
  IGNORE_REQUEST_BTN,
} from "../../utilities/string";
import { formatRequestTime } from "../../utilities/format";

type ActivityCenterProps = {
  friendRequests: FriendRequestStructure[];
  removeFriendRequest: (friend: FriendRequestStructure) => void;
};

export const FriendRequests = ({
  friendRequests,
  removeFriendRequest,
}: ActivityCenterProps) => {
  if (!friendRequests) return null;
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
  console.log(friendRequests);
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
              pos={"relative"}
              style={{
                transition: "background-color 150ms ease",
                cursor: "pointer",
              }}
            >
              <CloseButton pos="absolute" top={2} right={8} />
              <Group wrap="nowrap" align="center">
                <Avatar src={notif.requester.profilepic} />
                <Stack gap={2} style={{ flex: 1 }}>
                  <Text size="sm">
                    <Text fw={700} component="span">
                      {notif.requester.username}
                    </Text>{" "}
                    {FRIEND_REQUEST_TEXT}
                    <Text c="dimmed">
                      {formatRequestTime(new Date(notif.created_at))}
                    </Text>
                  </Text>
                </Stack>

                <Group>
                  <Button size="xs">{ACCEPT_REQUEST_BTN}</Button>
                  <Button
                    size="xs"
                    variant="light"
                    color="gray"
                    onClick={() => handleClick(notif.user_id, "decline", notif)}
                  >
                    {IGNORE_REQUEST_BTN}
                  </Button>
                </Group>
              </Group>
            </Card>
          ))}
      </Stack>
    </>
  );
};
