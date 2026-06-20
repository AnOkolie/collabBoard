import {
  Avatar,
  AvatarGroup,
  Button,
  Group,
  Paper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconGitFork,
  IconHome,
  IconSettings,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import {
  CREATE_COLUMN_BUTTON_TEXT,
  EXPORT_DATA_BUTTON_TEXT,
  PROJECT_HEADER_TEXT,
} from "../../constants/string";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useSocket } from "../../context/SocketContext";
import { useEffect } from "react";
import { OnlineUsers } from "../../types/user";
import { useState } from "react";
type BoardHeaderProps = {
  onOpenMembers: () => void;
  onOpenCreateColumn: () => void;
};

export const BoardHeader = ({
  onOpenMembers,
  onOpenCreateColumn,
}: BoardHeaderProps) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers[]>([]);
  const { lastJsonMessage } = useSocket();
  useEffect(() => {
    if (!lastJsonMessage) return;
    const { type } = lastJsonMessage;
    switch (type) {
      case "user:joined": {
        const { payload } = lastJsonMessage;

        setOnlineUsers((prev) => {
          const exists = prev.some((u) => u.id === payload.id);
          return exists ? prev : [...prev, payload];
        });

        break;
      }

      case "user:left": {
        const { payload } = lastJsonMessage;
        setOnlineUsers((prev) => prev.filter((u) => u.id !== payload.id));

        break;
      }

      case "user-joined:init": {
        const { payload } = lastJsonMessage;

        setOnlineUsers(payload);

        break;
      }
    }
  }, [lastJsonMessage]);

  return (
    <Paper
      withBorder
      radius="xl"
      p="xl"
      style={{
        background:
          "linear-gradient(135deg, rgba(250,245,255,1) 0%, rgba(243,232,255,1) 100%)",
      }}
    >
      <Group justify="space-between" align="flex-start">
        <div>
          <Group gap="xs" mb={6}>
            <IconHome size={16} />
            <Text size="sm" c="dimmed">
              {">"}
            </Text>
            <Text size="sm" c="dimmed">
              {PROJECT_HEADER_TEXT}
            </Text>
          </Group>

          <Title order={2}>Project Board</Title>
          <Text c="dimmed" mt={6}>
            Organize tasks, move work across columns, and keep progress visible.
          </Text>
        </div>
        <Group gap="sm">
          <Button variant="default" leftSection={<IconSettings size={16} />}>
            Settings
          </Button>
          <Button variant="default" leftSection={<IconGitFork size={16} />}>
            Activity
          </Button>
          <Button
            variant="default"
            leftSection={<IconUser size={16} />}
            onClick={onOpenMembers}
          >
            Members
          </Button>
          <Button leftSection={<IconUpload size={16} />}>
            {EXPORT_DATA_BUTTON_TEXT}
          </Button>
          <Button onClick={onOpenCreateColumn}>
            {CREATE_COLUMN_BUTTON_TEXT}
          </Button>
          <Tooltip.Group openDelay={300} closeDelay={100}>
            <Avatar.Group spacing="md">
              {onlineUsers.map((user) => (
                <Tooltip key={user.id} label={user.username} withArrow>
                  <Avatar src={user.profilepic} radius="xl" />
                </Tooltip>
              ))}
            </Avatar.Group>
          </Tooltip.Group>
        </Group>
      </Group>
    </Paper>
  );
};
