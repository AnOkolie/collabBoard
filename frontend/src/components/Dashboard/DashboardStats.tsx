import { Stack, Title, SimpleGrid, Paper } from "@mantine/core";
import { useLoaderData } from "react-router-dom";
import { LoaderData } from "../../types/dashboard";
import { StatCard } from "./StatCard";
import {
  IconLayoutKanban,
  IconUsers,
  IconChecklist,
} from "@tabler/icons-react";
import { WORKSPACE_OVERVIEW } from "../../utilities/string";

export const DashboardStats = () => {
  const loaderData = useLoaderData() as LoaderData;
  const boards = loaderData.dashboardStats.boards;
  const friends = loaderData.dashboardStats.friends;
  const tasks = loaderData.dashboardStats.tasks;
  return (
    <Paper withBorder radius="xl" p="lg">
      <Stack gap="lg">
        <Title order={3}>{WORKSPACE_OVERVIEW}</Title>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          <StatCard
            title="Boards"
            value={boards.length}
            description="Active collaboration boards"
            icon={<IconLayoutKanban size={20} />}
            color="blue"
          />

          <StatCard
            title="Friends"
            value={friends.length}
            description="Connected teammates"
            icon={<IconUsers size={20} />}
            color="grape"
          />

          <StatCard
            title="Tasks"
            value={tasks.length}
            description="Tracked tasks"
            icon={<IconChecklist size={20} />}
            color="green"
          />
        </SimpleGrid>
      </Stack>
    </Paper>
  );
};
