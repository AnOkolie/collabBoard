import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Pill,
  Title,
  Text,
  Group,
  Box,
  Stack,
  Progress,
  Paper,
  RingProgress,
} from "@mantine/core";
import { IconAdjustmentsHorizontal, IconDots } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const BoardPage = () => {
  const [value, setValue] = useState(30);
  const navigate = useNavigate();
  const groups = [
    { name: "Web Design", color: "Blue" },
    { name: "Mobile App", color: "Orange" },
    { name: "App Development", color: "Pink" },
    { name: "Landing Page", color: "Blue" },
    { name: "Dashboard", color: "Purple" },
  ];

  const colorMatch = groups.reduce<{ [key: string]: string }>((acc, group) => {
    acc[group.name] = group.color;
    return acc;
  }, {});

  const entries = [
    { name: "Web Design", text: "Design the homepage layout", progress: 80 },
    { name: "Mobile App", text: "Create mobile UI components", progress: 60 },
    {
      name: "App Development",
      text: "Implement backend API endpoints",
      progress: 40,
    },
    {
      name: "Landing Page",
      text: "Build responsive landing page",
      progress: 90,
    },
    { name: "Dashboard", text: "Design analytics dashboard UI", progress: 30 },
  ];

  const projectEntries = [
    { name: "Total", value: 144 },
    { name: "Completed", value: 56 },
    { name: "In Progress", value: 72 },
    { name: "Waiting", value: 24 },
  ];

  return (
    <Container fluid h="80vh" c={"purple.5"}>
      <Group align="flex-start" gap="lg">
        <Paper withBorder radius={"md"} style={{ flex: 4 }} p={"md"}>
          <Flex justify="space-between" align="center" p="lg" mb="md">
            <Text size="xl" fw={700}>
              Projects
            </Text>
            <Flex align="center" gap="sm">
              <IconAdjustmentsHorizontal />
              <Button size="sm" radius="lg" color="purple">
                Create Project
              </Button>
            </Flex>
          </Flex>
          <Grid>
            {entries.map((entry) => (
              <Grid.Col span={4} key={entry.name}>
                <Card withBorder radius="lg" p="md">
                  <Flex direction={"row"} justify="space-between">
                    <Pill
                      color={colorMatch[entry.name]?.toLowerCase() || "gray"}
                    >
                      {entry.name}
                    </Pill>
                    <IconDots />
                  </Flex>

                  <Text size="sm" mb="sm">
                    {entry.text}
                  </Text>
                  <Progress value={entry.progress} />
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Paper>
        <Paper withBorder radius={"md"}>
          <Flex align={"center"} justify={"center"}>
            <Stack gap="md" style={{ flex: 1 }}>
              <Paper withBorder radius={"md"} p="md">
                <Text>Design Area</Text>
                <RingProgress
                  sections={[{ value, color: "blue" }]}
                  transitionDuration={250}
                  label={<Text ta="center">{value}%</Text>}
                />
                <Text>Projects</Text>
                <Grid>
                  {projectEntries.map((entry) => (
                    <Grid.Col span={5} key={entry.name}>
                      <Card
                        p="sm"
                        withBorder
                        radius={"lg"}
                        onClick={() => navigate("/board")}
                      >
                        <Text size="sm">{entry.name}</Text>
                        <Text size="lg">{entry.value}</Text>
                      </Card>
                    </Grid.Col>
                  ))}
                </Grid>
              </Paper>
              <Card p="md">
                <Text>Announcements</Text>
              </Card>
            </Stack>
          </Flex>
        </Paper>
      </Group>
    </Container>
  );
};
