import {
  Container,
  Text,
  Group,
  Paper,
  Avatar,
  Stack,
  Divider,
  SegmentedControl,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { profile } from "../../../types/user";
import {
  PROFILE_BOARD_TEXT,
  PROFILE_FRIENDS_TEXT,
} from "../../../utilities/string";
import { UserSearchButton } from "../../../components/SearchUser/UserSearchButton";
import { useFriendSocket } from "../../../hooks/useFriendSocket";
import { ProfileBoards } from "./ProfileBoards";

export const FriendProfile = () => {
  const loaderData = useLoaderData();
  const { sendFriendRequest } = useFriendSocket();
  const [user, setUser] = useState<profile>(loaderData.data);
  useEffect(() => {
    if (!loaderData) return;
    setUser(loaderData.data);
  }, [loaderData]);
  const data = [
    { label: "About", value: "about" },
    { label: "Boards", value: "boards" },
    { label: "Activity", value: "activity" },
  ];
  const [value, setValue] = useState("about");

  return (
    <Container size="md">
      <Stack gap="lg">
        {/* Profile Header */}
        <Paper withBorder radius="md" p="lg">
          <Stack gap="lg">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Group wrap="nowrap" align="center">
                <Avatar size={90} src={user.profilepic} />

                <Stack gap={6}>
                  <Text fw={700} size="xl">
                    {user.username}
                  </Text>

                  <Group gap="xl">
                    <Stack gap={0} align="center">
                      <Text fw={700} size="xl">
                        {user.boards.length}
                      </Text>

                      <Text size="sm" c="dimmed">
                        {PROFILE_BOARD_TEXT}
                      </Text>
                    </Stack>

                    <Stack gap={0} align="center">
                      <Text fw={700} size="xl">
                        {user.friends.length}
                      </Text>

                      <Text size="sm" c="dimmed">
                        {PROFILE_FRIENDS_TEXT}
                      </Text>
                    </Stack>
                  </Group>
                </Stack>
              </Group>

              <UserSearchButton
                user={user}
                onSendRequest={() => sendFriendRequest(user.id)}
              />
            </Group>

            {user.mutuals.length > 0 && (
              <>
                <Divider />

                <Group gap="sm">
                  <Avatar.Group spacing="sm">
                    {user.mutuals.slice(0, 5).map((mut) => (
                      <Avatar key={mut.user.id} src={mut.user.profilepic} />
                    ))}

                    {user.mutuals.length > 5 && (
                      <Avatar color="gray">+{user.mutuals.length - 5}</Avatar>
                    )}
                  </Avatar.Group>

                  <Text size="sm" c="dimmed">
                    {user.mutuals.length} mutual connection
                    {user.mutuals.length !== 1 && "s"}
                  </Text>
                </Group>
              </>
            )}
          </Stack>
        </Paper>

        {/* Profile Content */}
        <Paper withBorder radius="md" p="lg">
          <Stack gap="lg">
            <SegmentedControl
              data={data}
              value={value}
              onChange={setValue}
              fullWidth
              radius="xl"
            />
            {/* <ProfileBoards boards={user.boards} /> */}

            {/* Render selected tab here */}
            {/* Boards / Activity / About */}
            {value === "boards" && (
              <ProfileBoards boards={user.boards} user={user} />
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};
