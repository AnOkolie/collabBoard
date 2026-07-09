import { Container, Stack, Title, Paper, Avatar, Text } from "@mantine/core";
import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { allFriends } from "../../types/friends";
import { FriendCard } from "./FriendCard";
import { FriendRequestCard } from "./FriendRequestCard";
import { UserSearch } from "./UserSearch";
import {
  FRIENDS_PENDING_REQUEST_TEXT,
  FRIENDS_TEXT,
  FIND_FRIENDS_TEXT,
} from "../../utilities/string";
type friendsLoader = {
  message: string;
  friends: allFriends[];
};

export const Friends = () => {
  const loaderData = useLoaderData() as friendsLoader;
  const [allFriends, setAllFriends] = useState<allFriends[]>(
    loaderData.friends ?? [],
  );

  const [friendsCount, setFriendsCount] = useState(0);

  useEffect(() => {
    if (!loaderData) return;
    setAllFriends(loaderData.friends);
    setFriendsCount(allFriends.length);
  }, [loaderData]);
  const requests: allFriends[] = allFriends.filter(
    (friend) => friend.friendshipStatus === "pending",
  );
  const friends = allFriends.filter(
    (friend) => friend.friendshipStatus === "friends",
  );
  return (
    <Container size="md">
      {friendsCount === 0 ? (
        <Stack align="center" justify="center" h={400}>
          <Avatar size="xl" />
          <Text fw={600}>No friends yet</Text>
          <Text c="dimmed">Search for people and start connecting</Text>
        </Stack>
      ) : (
        <Stack gap="xl">
          <Paper withBorder radius="md" p="md">
            <Title order={3}>{FRIENDS_PENDING_REQUEST_TEXT}</Title>

            <Stack mt="md">
              {requests.map((request) => (
                <FriendRequestCard request={request} />
              ))}
            </Stack>
          </Paper>

          <Paper withBorder radius="md" p="md">
            <Title order={3}>{FRIENDS_TEXT}</Title>

            <Stack mt="md">
              {friends.map((friend) => (
                <FriendCard friend={friend} />
              ))}
            </Stack>
          </Paper>

          <Paper withBorder radius="md" p="md">
            <Title order={3}>{FIND_FRIENDS_TEXT}</Title>

            <UserSearch />
          </Paper>
        </Stack>
      )}
    </Container>
  );
};
