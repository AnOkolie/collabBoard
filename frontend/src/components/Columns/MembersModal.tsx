import {
  Avatar,
  Button,
  Flex,
  Group,
  Input,
  Modal,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";
import { BoardMembers } from "../../types/boards";
import { SearchUserComponent } from "../../hooks/useSearchUser";

type MembersModalProps = {
  opened: boolean;
  onClose: () => void;
  boardMembers: BoardMembers[];
  usersByName: any[];
  searchName: string;
  setSearchName: React.Dispatch<React.SetStateAction<string>>;
  onInviteUser: (userId: string) => void;
};

export const MembersModal = ({
  opened,
  onClose,
  boardMembers,
  usersByName,
  searchName,
  setSearchName,
  onInviteUser,
}: MembersModalProps) => {
  return (
    <Modal opened={opened} onClose={onClose} centered title="Board Members">
      <SearchUserComponent
        searchName={searchName}
        setSearchName={setSearchName}
      />

      <Stack mt="md">
        {boardMembers.map((user) => (
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
                <Button type="button" variant="outline">
                  {user.role}
                </Button>
              </Flex>
            </Group>
          </Paper>
        ))}

        {usersByName.map((user) => (
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
                  onClick={() => onInviteUser(user.id)}
                >
                  <IconUserPlus color="green" />
                </Button>
              </Flex>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Modal>
  );
};
