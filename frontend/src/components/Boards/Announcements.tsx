import {
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Title,
  ThemeIcon,
  Paper,
} from "@mantine/core";
import {
  IconBell,
  IconCalendarEvent,
  IconClipboardText,
} from "@tabler/icons-react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { tasks } from "../../types/cards";
import { useBoardStore } from "../../zustand/useBoardStore/useBoardStore";
import { useMessageStore } from "../../zustand/messageStore/useMessageStore";
import { formatDate } from "../../utilities/format";
import {
  HOME_PAGE_UPCOMING_TASKS,
  HOME_PAGE_NO_ANNOUNCEMENTS,
  HOME_PAGE_NO_UPCOMING_TASKS,
} from "../../utilities/string";

type LoaderData = {
  tasks: {
    data: tasks[];
  };
};

export const Announcements = () => {
  const { tasks: loaderTasks } = useLoaderData() as LoaderData;
  const tasks = loaderTasks.data ?? [];

  const navigate = useNavigate();

  const { setBoardId } = useBoardStore();
  const { setCurrentConversation } = useMessageStore();

  const navigateToBoard = (boardId: string, conversationId: string) => {
    setBoardId(boardId);
    setCurrentConversation(conversationId);
    navigate(`/board/${boardId}`);
  };

  if (tasks.length === 0) {
    return (
      <Paper withBorder radius="lg" p="xl" ta="center">
        <ThemeIcon variant="light" color="gray" size={60} radius="xl" mx="auto">
          <IconBell size={30} />
        </ThemeIcon>

        <Title order={4} mt="md">
          {HOME_PAGE_NO_ANNOUNCEMENTS}
        </Title>

        <Text c="dimmed" mt={4}>
          {HOME_PAGE_NO_UPCOMING_TASKS}
        </Text>
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Group gap="xs">
          <ThemeIcon variant="light" color="blue">
            <IconBell size={18} />
          </ThemeIcon>

          <Title order={3}>{HOME_PAGE_UPCOMING_TASKS}</Title>
        </Group>

        <Badge variant="light" color="blue">
          {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
        </Badge>
      </Group>

      <Stack gap="sm">
        {tasks.map((task) => (
          <Card
            key={task.id}
            withBorder
            radius="lg"
            shadow="xs"
            p="md"
            style={{
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
            onClick={() => navigateToBoard(task.boardId, task.conversationId)}
          >
            <Stack gap="xs">
              <Group justify="space-between" align="flex-start">
                <Group gap="sm" align="flex-start">
                  <ThemeIcon variant="light" color="blue" radius="xl">
                    <IconClipboardText size={18} />
                  </ThemeIcon>

                  <Stack gap={2}>
                    <Title order={5}>{task.title}</Title>

                    {task.content && (
                      <Text size="sm" c="dimmed" lineClamp={2}>
                        {task.content}
                      </Text>
                    )}
                  </Stack>
                </Group>
              </Group>

              <Group gap="xs" mt="xs">
                <ThemeIcon size="sm" variant="transparent" color="gray">
                  <IconCalendarEvent size={16} />
                </ThemeIcon>

                <Text size="sm" c="dimmed">
                  Due {formatDate(new Date(task.dueDate))}
                </Text>
              </Group>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};
