import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import {
  Title,
  Text,
  Stack,
  Paper,
  Group,
  ThemeIcon,
  Divider,
} from "@mantine/core";
import {
  DASHBOARD_HERO_TEXT,
  HERO_NO_TASKS,
  HERO_TACKLE_TASKS,
} from "../../utilities/string";
import { CardType } from "../../types/columns";
import { IconClock, IconAlertTriangle } from "@tabler/icons-react";

type props = {
  incompletedTasks: CardType[];
  completedTasks: CardType[];
};
export const DashBoardHero = ({ incompletedTasks, completedTasks }: props) => {
  const getTimeOfDay = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  const overdueTasks = incompletedTasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < new Date(),
  );
  const username = useAuthStore((s) => s.authUser?.username);
  return (
    <Paper withBorder radius="xl" p="xl">
      <Stack gap="lg">
        <Stack>
          <Title>{`${getTimeOfDay()}, ${username} 👋`}</Title>
          <Text c="dimmed">{DASHBOARD_HERO_TEXT}</Text>
        </Stack>
        <Divider />
        {incompletedTasks.length === 0 && overdueTasks.length === 0 ? (
          <Text>{HERO_NO_TASKS}</Text>
        ) : (
          <>
            <Group>
              <ThemeIcon color="orange" variant="light">
                <IconClock size={18} />
              </ThemeIcon>

              <Text>
                You have{" "}
                <Text span fw={700}>
                  {incompletedTasks.length}
                </Text>{" "}
                upcoming task{incompletedTasks.length === 1 ? "" : "s"}
              </Text>
            </Group>
            <Group>
              <Text>
                ⚠️ You have{" "}
                <Text span fw={700}>
                  {overdueTasks.length}
                </Text>{" "}
                overdue task{overdueTasks.length === 1 ? "" : "s"} that need
                attention.
              </Text>
            </Group>

            {completedTasks.length > 0 ? (
              <Group>
                <ThemeIcon color="yellow" variant="light">
                  <IconAlertTriangle />
                </ThemeIcon>
                <Text>
                  <Text span fw={700}>
                    {completedTasks.length}
                  </Text>{" "}
                  completed task{completedTasks.length === 1 ? "" : "s"}
                </Text>
              </Group>
            ) : (
              <Text>{HERO_TACKLE_TASKS}</Text>
            )}
          </>
        )}
      </Stack>
    </Paper>
  );
};
