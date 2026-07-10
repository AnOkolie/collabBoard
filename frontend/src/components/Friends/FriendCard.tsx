import React from "react";
import { allFriends } from "~/types/friends";
import { Group, Avatar, Stack, Text, Paper } from "@mantine/core";
import { UserSearchButton } from "../SearchUser/UserSearchButton";
import { useFriendSocket } from "../../hooks/useFriendSocket";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
type props = {
  friend: allFriends;
};

export const FriendCard = ({ friend }: props) => {
  const { sendFriendRequest, viewUserProfile } = useFriendSocket();
  const userId = useAuthStore((s) => s.authUser?.id);
  return (
    <Paper
      key={friend.id}
      p="md"
      withBorder
      radius="md"
      style={{
        transition: "0.2s",
      }}
    >
      <Group justify="space-between">
        <Group onClick={() => viewUserProfile(friend.id, userId ?? "")}>
          <Avatar size="md" src={friend.profilepic || undefined} />

          <Stack gap={0}>
            <Text fw={600}>{friend.username}</Text>

            <Text size="xs" c="dimmed">
              Friend
            </Text>
          </Stack>
        </Group>

        <UserSearchButton
          user={friend}
          onSendRequest={() => sendFriendRequest(friend.id)}
          size={14}
          conversationId={friend.conversationId}
        />
      </Group>
    </Paper>
  );
};
