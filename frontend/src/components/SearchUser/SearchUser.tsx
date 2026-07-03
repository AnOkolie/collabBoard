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
} from "@mantine/core";

import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { SearchUserComponent } from "../../hooks/useSearchUser";
import { useSearchUser } from "../../hooks/useSearchUser";
import { UserSearchButton } from "./UserSearchButton";
import { useFriendSocket } from "../../hooks/useFriendSocket";

export const SearchUser = () => {
  const { searchName, setSearchName, usersByName, isLoading } =
    useSearchUser(800);
  const currentUserId = useAuthStore.getState().authUser?.id;
  const filteredNames = usersByName.filter((user) => user.id !== currentUserId);
  const { sendFriendRequest } = useFriendSocket();
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
                <UserSearchButton
                  user={user}
                  onSendRequest={() => sendFriendRequest(user.id)}
                />
              </Flex>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};
