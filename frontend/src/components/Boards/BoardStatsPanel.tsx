import {
  Card,
  Flex,
  Grid,
  Paper,
  RingProgress,
  Stack,
  Text,
} from "@mantine/core";
import { Announcements } from "./Announcements";
import { useNavigate } from "react-router-dom";

type BoardStatsPanelProps = {
  boardProgress: number;
  boardDetails: Record<string, number>;
};

export const BoardStatsPanel = ({
  boardProgress,
  boardDetails,
}: BoardStatsPanelProps) => {
  const statEntries = Object.entries(boardDetails) as [string, number][];
  const navigate = useNavigate();
  return (
    <Stack gap="md">
      <Paper withBorder radius="md" p="md">
        <Text fw={600} mb="sm">
          Quick Stats
        </Text>

        <Flex justify="center" mb="md">
          <RingProgress
            sections={[{ value: boardProgress, color: "blue" }]}
            label={<Text ta="center">{boardProgress}%</Text>}
            onClick={() => navigate("dashboard")}
            style={{
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
          />
        </Flex>
      </Paper>

      <Card p="md" withBorder radius="md">
        <Announcements />
      </Card>
    </Stack>
  );
};
