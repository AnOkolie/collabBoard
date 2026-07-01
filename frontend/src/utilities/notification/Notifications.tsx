import { Avatar, Button, Group, Text, Flex, Stack } from "@mantine/core";
import { useFriendSocket } from "../../hooks/useFriendSocket";

type props = {
  id: string;
};

type boardProps = {
  onClick: (response: "accepted" | "declined") => void;
};

type messageProps = {
  sender: string;
  content: string;
  profilepic: string;
  createdAt: string;
};
export const FriendNotification = ({ id }: props) => {
  const { respondToFriendRequest } = useFriendSocket();
  return (
    <>
      <Group mt="sm">
        <Button
          size="xs"
          onClick={() => respondToFriendRequest(id, "accepted")}
        >
          Accept
        </Button>

        <Button
          size="xs"
          variant="outline"
          onClick={() => respondToFriendRequest(id, "decline")}
        >
          Decline
        </Button>
      </Group>
    </>
  );
};

export const BoardNotification = ({ onClick }: boardProps) => {
  return (
    <>
      <Group mt="sm">
        <Button size="xs" onClick={() => onClick("accepted")}>
          Accept
        </Button>
        <Button size="xs" variant="outline" onClick={() => onClick("declined")}>
          Decline
        </Button>
      </Group>
    </>
  );
};

export const MessageNotification = ({
  sender,
  content,
  profilepic,
  createdAt,
}: messageProps) => {
  return (
    <>
      <Group align="flex-start" gap="sm" wrap="nowrap">
        <Avatar src={profilepic} radius="xl" />

        <Stack gap={2} flex={1}>
          <Group gap="xs">
            <Text fw={600}>{sender}</Text>
            <Text size="xs" c="dimmed">
              {createdAt}
            </Text>
          </Group>

          <Text>{content}</Text>
        </Stack>
      </Group>
    </>
  );
};
