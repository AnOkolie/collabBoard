import {
  Card,
  Flex,
  Grid,
  Paper,
  Stack,
  Text,
  RingProgress,
} from "@mantine/core";
import { BOARD_PROJECTS } from "../../utilities/string";

type props = {
  statEntries: [string, number][];
  boardProgress: number;
};

export const WorkspaceInsights = ({ statEntries, boardProgress }: props) => {
  const standard = new Set(["To Do", "Completed", "In Progress"]);

  const displayEntries: [string, number][] = [];
  let otherCount = 0;

  for (const [name, count] of statEntries) {
    if (name === "total") continue;

    if (standard.has(name)) {
      displayEntries.push([name, count]);
    } else {
      otherCount += count;
    }
  }

  if (otherCount > 0) {
    displayEntries.push(["Other", otherCount]);
  }
  const progress = Math.max(0, Math.min(boardProgress, 100));
  return (
    <Stack gap="md">
      <Paper withBorder radius="md" p="md">
        <Flex justify="center" mb="md">
          <Stack>
            <Text fw={700}>Task Progress</Text>
            <RingProgress
              sections={[{ value: progress, color: "blue" }]}
              label={<Text ta="center">{progress}%</Text>}
            />
          </Stack>
        </Flex>
        <Paper withBorder radius="md" p="md">
          <Text fw={600} mb="sm">
            {BOARD_PROJECTS}
          </Text>

          <Grid>
            {displayEntries.map(([key, value]) => {
              if (key === "Other" && value == 0) return <></>;
              return (
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
              );
            })}
          </Grid>
        </Paper>
      </Paper>
    </Stack>
  );
};
