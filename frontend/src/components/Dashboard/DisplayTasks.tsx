import { CardType } from "../../types/columns";
import {
  Badge,
  Card,
  Group,
  Stack,
  Text,
  Title,
  ThemeIcon,
  Pill,
  Flex,
  Paper,
  getThemeColor,
  ActionIcon,
} from "@mantine/core";
import {
  IconBell,
  IconCalendarEvent,
  IconClock,
  IconCheck,
  IconChevronRight,
  IconPointFilled,
} from "@tabler/icons-react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { tasks } from "../../types/cards";
import { useBoardStore } from "../../zustand/useBoardStore/useBoardStore";
import { useMessageStore } from "../../zustand/messageStore/useMessageStore";
import { formatDate, timeString } from "../../utilities/format";
import {
  HOME_PAGE_UPCOMING_TASKS,
  HOME_PAGE_RECENTLY_COMPLETED,
  DISPLAY_TASKS_DESCRIPTION,
  DISPLAY_TASKS_NO_TASKS,
} from "../../utilities/string";
type props = {
  tasks: tasks[];
  state: string;
};
export const DisplayTasks = ({ tasks, state }: props) => {
  const { setBoardId } = useBoardStore();
  const { setCurrentConversation } = useMessageStore();
  const navigate = useNavigate();
  const navigateToBoard = (boardId: string, conversationId: string) => {
    setBoardId(boardId);
    setCurrentConversation(conversationId);
    navigate(`/board/${boardId}`);
  };
  const getStateColor = (state: string) => {
    const colors: Record<string, string> = {
      Completed: "green",
      "In Progress": "violet",
      "To Do": "teal",
      task: "orange",
    };
    return colors[state] || "grey";
  };
  const getStateIcon = (state: string) => {
    const colors: Record<string, any> = {
      Completed: IconCheck,
    };
    return colors[state] || IconClock;
  };
  const getStateThemeColor = (state: string) => {
    const colors: Record<string, string> = {
      Completed: "green",
    };
    return colors[state] || "orange";
  };
  const getState = (state: string) => {
    const colors: Record<string, string> = {
      Completed: "green",
    };
    return colors[state] || "orange";
  };
  const Icon = getStateIcon(state);
  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Group gap="xs">
          <ThemeIcon variant="light" color={getStateThemeColor(state ?? "")}>
            <Icon size={18} />
          </ThemeIcon>

          <Title order={3}>
            {state === "Completed"
              ? HOME_PAGE_RECENTLY_COMPLETED
              : HOME_PAGE_UPCOMING_TASKS}
          </Title>
        </Group>

        <Badge variant="light" color="blue">
          {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
        </Badge>
      </Group>

      <Stack gap="sm">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            return (
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
                onClick={() =>
                  navigateToBoard(task.boardId, task.conversationId)
                }
              >
                <Group justify="space-between">
                  <Group align="flex-start">
                    <ThemeIcon
                      size="md"
                      radius="xl"
                      variant="light"
                      color={getStateColor(task.state ?? "")}
                    >
                      {task.state === "Completed" ? (
                        <IconCheck size={14} />
                      ) : (
                        <IconClock size={14} />
                      )}
                    </ThemeIcon>
                    <Stack>
                      <Text fw={800}>{task.title}</Text>

                      <Group gap={4}>
                        <IconCalendarEvent size={14} />

                        <Text size="sm" c="dimmed">
                          Due {formatDate(task.dueDate)}
                        </Text>
                        <Flex justify={"flex-end"}>
                          <Pill c={getStateColor(task.state ?? "")}>
                            {task.state}
                          </Pill>
                        </Flex>
                      </Group>
                    </Stack>
                  </Group>
                  <ActionIcon variant="subtle" color="gray">
                    <IconChevronRight stroke={2} />
                  </ActionIcon>
                </Group>
              </Card>
            );
          })
        ) : (
          <Paper withBorder p="xl" radius="lg" ta="center">
            <IconCheck size={30} />

            <Title order={5}>{DISPLAY_TASKS_NO_TASKS}</Title>

            <Text c="dimmed">{DISPLAY_TASKS_DESCRIPTION}</Text>
          </Paper>
        )}
      </Stack>
    </Stack>
  );
};
