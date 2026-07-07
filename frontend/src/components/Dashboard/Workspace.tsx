import {
  AppShell,
  Card,
  Flex,
  Grid,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  RingProgress,
} from "@mantine/core";
import { BOARD_PROJECTS, DASHBOARD_HEADER } from "../../utilities/string";

type props = {
  statEntries: [string, number][];
  boardProgress: number;
};

export const WorkspaceInsights = ({ statEntries, boardProgress }: props) => {
  const standard = ["To Do", "Completed", "In Progress", "Other"];
  const displayMap = new Map();
  let otherCount = 0;
  const newMap = statEntries
    .map((entry) => {
      if (standard.includes(entry[0])) {
        return entry;
      } else {
        if (entry[0] !== "total") otherCount += entry[1];
      }
      return entry;
    })
    .filter((entry) => standard.includes(entry[0]));
  newMap.push(["Other", otherCount]);
  return (
    <Stack gap="md">
      <Paper withBorder radius="md" p="md">
        <Flex justify="center" mb="md">
          <Stack>
            <Text fw={700}>Task Progress</Text>
            <RingProgress
              sections={[{ value: boardProgress, color: "blue" }]}
              label={<Text ta="center">{boardProgress}%</Text>}
            />
          </Stack>
        </Flex>
        <Paper withBorder radius="md" p="md">
          <Text fw={600} mb="sm">
            {BOARD_PROJECTS}
          </Text>

          <Grid>
            {newMap.map(([key, value]) => (
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
      </Paper>
    </Stack>
  );
};
