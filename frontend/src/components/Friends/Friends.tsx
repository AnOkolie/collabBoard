import {
  Container,
  Stack,
  Grid,
  Flex,
  Card,
  Paper,
  Avatar,
  Group,
  Input,
  Text,
} from "@mantine/core";
import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { allFriends } from "../../types/friends";
import { UserSearchButton } from "../SearchUser/UserSearchButton";
import { useFriendSocket } from "../../hooks/useFriendSocket";

type friendsLoader = {
  message: string;
  friends: allFriends[];
};

export const Friends = () => {
  const loaderData = useLoaderData() as friendsLoader;
  const [friends, setFriends] = useState<allFriends[]>(
    loaderData.friends ?? [],
  );
  const { sendFriendRequest } = useFriendSocket();
  useEffect(() => {
    if (!loaderData) return;
    console.log(loaderData);
    setFriends(loaderData.friends);
  }, [loaderData]);

  return (
    <Container>
      <Grid>
        <Grid.Col span={{ base: 12, md: 11 }}>
          <Stack>
            {friends.length === 0 ? (
              <>
                <Flex>
                  <Text>Search up users to make new friends...</Text>
                </Flex>
              </>
            ) : (
              friends.map((friend) => (
                <Paper key={friend.id} p="sm" withBorder radius="md">
                  <Group>
                    <Input
                      type="hidden"
                      value={friend.id}
                      name="friend-user-id"
                    />
                    <Avatar src={friend.profilepic || undefined} />

                    <Text fw={600}>{friend.username}</Text>

                    <Flex ml="auto" gap="md">
                      <UserSearchButton
                        user={friend}
                        onSendRequest={() => sendFriendRequest(friend.id)}
                        size={14}
                      />
                    </Flex>
                  </Group>
                </Paper>
              ))
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
