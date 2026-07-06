import {
  Card,
  Flex,
  Grid,
  Paper,
  RingProgress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useLoaderData } from "react-router-dom";
import { useMemo } from "react";
import { BOARD_PROJECTS, DASHBOARD_HEADER } from "../../utilities/string";
type LoaderData = {
  stats: {
    data: {
      stats: Record<string, number>;
    };
  };
};
export const Dashboard = () => {
  const loaderData = useLoaderData() as LoaderData;
  const stats = loaderData?.stats?.data.stats ?? {};
  const statEntries = Object.entries(stats) as [string, number][];
  const boardProgress = useMemo(() => {
    const total = stats?.total ?? 0;
    const completed = stats?.Completed ?? 0;
    if (!total) return 0;
    return Math.round((completed / total) * 100);
  }, [stats]);
  return (
    <Stack gap="md">
      <Title fw={700} mb="sm">
        {DASHBOARD_HEADER}
      </Title>
      <Paper withBorder radius="md" p="md">
        <Flex justify="center" mb="md">
          <RingProgress
            sections={[{ value: boardProgress, color: "blue" }]}
            label={<Text ta="center">{boardProgress}%</Text>}
          />
        </Flex>
        <Text fw={600} mb="sm">
          {BOARD_PROJECTS}
        </Text>

        <Grid>
          {statEntries.map(([key, value]) => (
            <Grid.Col span={6} key={key}>
              <Card withBorder radius="md" p="sm">
                <Text size="sm" c="dimmed">
                  {key}
                </Text>
                <Text size="xl" fw={700}>
                  {value}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Paper>
    </Stack>
  );
};
