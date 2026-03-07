import {
  Card,
  Flex,
  Grid,
  Paper,
  RingProgress,
  Stack,
  Text,
} from "@mantine/core";

type BoardStatsPanelProps = {
  boardProgress: number;
  boardDetails: Record<string, number>;
};

export const BoardStatsPanel = ({
  boardProgress,
  boardDetails,
}: BoardStatsPanelProps) => {
  const statEntries = Object.entries(boardDetails) as [string, number][];

  return (
    <Stack gap="md">
      <Paper withBorder radius="md" p="md">
        <Text fw={600} mb="sm">
          Design Area
        </Text>

        <Flex justify="center" mb="md">
          <RingProgress
            sections={[{ value: boardProgress, color: "blue" }]}
            label={<Text ta="center">{boardProgress}%</Text>}
          />
        </Flex>

        <Text fw={600} mb="sm">
          Projects
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

      <Card p="md" withBorder radius="md">
        <Text fw={600}>Announcements</Text>
      </Card>
    </Stack>
  );
};
