import React from "react";
import { allFriends } from "../../types/friends";
import { Group, Avatar, Stack, Text, Paper } from "@mantine/core";
import { UserSearchButton } from "../SearchUser/UserSearchButton";
import { useFriendSocket } from "../../hooks/useFriendSocket";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
type props = {
  request: allFriends;
};

export const FriendRequestCard = ({ request }: props) => {
  const { sendFriendRequest, viewUserProfile } = useFriendSocket();
  const userId = useAuthStore((s) => s.authUser?.id);
  return (
    <Paper
      key={request.id}
      p="md"
      withBorder
      radius="md"
      style={{
        transition: "0.2s",
      }}
      onClick={() => viewUserProfile(request.id, userId ?? "")}
    >
      <Group justify="space-between">
        <Group>
          <Avatar size="md" src={request.profilepic || undefined} />

          <Stack gap={0}>
            <Text fw={600}>{request.username}</Text>

            <Text size="xs" c="dimmed">
              Requested to be your friend
            </Text>
          </Stack>
        </Group>

        <UserSearchButton
          user={request}
          onSendRequest={() => sendFriendRequest(request.id)}
          size={14}
          conversationId={request.conversationId}
        />
      </Group>
    </Paper>
  );
};
