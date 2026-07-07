import {
  AppShell,
  Card,
  Flex,
  Grid,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Group,
  Divider,
} from "@mantine/core";
import { useLoaderData } from "react-router-dom";
import { useMemo } from "react";
import { BOARD_PROJECTS, DASHBOARD_HEADER } from "../../utilities/string";
import { LoaderData } from "../../types/dashboard";
import { DisplayTasks } from "./DisplayTasks";
import { DashBoardHero } from "./Hero";
import { DashboardStats } from "./DashboardStats";
import { WorkspaceInsights } from "./Workspace";
export const Dashboard = () => {
  const loaderData = useLoaderData() as LoaderData;
  const stats = loaderData?.stats?.data.stats ?? {};
  const completeTasks = loaderData?.completeTasks?.tasks;
  const incompleteTasks = loaderData?.inCompleteTasks?.tasks;
  const statEntries = Object.entries(stats) as [string, number][];
  const boardProgress = useMemo(() => {
    const total = stats?.total ?? 0;
    const completed = stats?.Completed ?? 0;
    if (!total) return 0;
    return Math.round((completed / total) * 100);
  }, [stats]);
  return (
    <AppShell.Main>
      <Stack gap="xl">
        <DashBoardHero
          incompletedTasks={incompleteTasks}
          completedTasks={completeTasks}
        />
        <Divider />

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          <Paper withBorder radius="xl" p="lg">
            <DisplayTasks
              tasks={incompleteTasks}
              state={incompleteTasks[0]?.state ?? ""}
            />
          </Paper>

          <Paper withBorder radius="xl" p="lg">
            <DisplayTasks tasks={completeTasks} state={"Completed"} />
          </Paper>
        </SimpleGrid>
        <Divider />
        <DashboardStats />
        <WorkspaceInsights
          statEntries={statEntries}
          boardProgress={boardProgress}
        />

        {/*
    <TaskOverview/>

    <Announcements/>

    <RecentActivity/> */}
      </Stack>
    </AppShell.Main>
  );
};

// Track tasks completed in a week
// Most productive day in a week
//Most productive month maybe
//Show uncompleted tasks (Everything except from completed)
//Show the most productive member on the team => maybe in a different way cause the dashboard spans multiple boards
//Compare your productivity vs the average user maybe
//Show recently completed tasks also
