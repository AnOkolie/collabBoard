import {
  Container,
  Stack,
  Text,
  Avatar,
  Group,
  Paper,
  Center,
  Flex,
  Input,
  Button,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconUserPlus } from "@tabler/icons-react";
import { findUserBody, SearchResponse, userObject } from "../../types/user";
import { useBoardSocket } from "../../context/BoardSocketContext";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { SearchUserComponent } from "../../hooks/useSearchUser";
import { useSearchUser } from "../../hooks/useSearchUser";

export const SearchUser = () => {
  const { searchName, setSearchName, usersByName, isLoading } =
    useSearchUser(800);
  const [friendId, setFriendId] = useState("");
  const { sendJsonMessage, isConnected } = useBoardSocket();
  // const [filteredNames, setFilteredNames] = useState<findUserBody[]>([]);
  const whisperToSocket = (targetFriendId: string) => {
    const currUser = useAuthStore.getState().authUser;
    if (!currUser) return;

    if (!currUser.id || !targetFriendId || !isConnected) return;

    sendJsonMessage({
      type: "friend-request",
      user_id: currUser.id,
      friend_id: targetFriendId,
      message: "Lets be friends please",
    });
  };

  const currentUserId = useAuthStore.getState().authUser?.id;

  const filteredNames = usersByName.filter((user) => user.id !== currentUserId);

  return (
    <Container>
      <SearchUserComponent
        searchName={searchName}
        setSearchName={setSearchName}
      />

      {!searchName.trim() && (
        <Center h="80vh">
          <Text c="gray" fw={800}>
            Enter a username to search
          </Text>
        </Center>
      )}

      <Stack mt="md">
        {filteredNames.map((user) => (
          <Paper key={user.id} p="sm" withBorder radius="md">
            <Group>
              <Input type="hidden" value={user.id} name="friend-user-id" />
              <Avatar src={user.profilepic || undefined} />
              <div>
                <Text fw={600}>{user.username}</Text>
                <Text size="sm" c="dimmed">
                  {user.email}
                </Text>
              </div>

              <Flex ml="auto" gap="md">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFriendId(user.id);
                    whisperToSocket(user.id);
                  }}
                >
                  <IconUserPlus color="green" />
                </Button>
              </Flex>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};
