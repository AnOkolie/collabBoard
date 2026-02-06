import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridCol,
  Paper,
  Text,
} from "@mantine/core";
import {
  IconGitFork,
  IconHome,
  IconPlus,
  IconSettings,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";

export const BoardView = () => {
  return (
    <Container fluid h="80vh" w="100%">
      <Flex direction="column" align="center" gap="md">
        {/* Top Bar */}
        <Paper withBorder radius="md" p="sm" w="100%">
          <Flex align="center">
            {/* Left side */}
            <Flex align="center" gap="xs" style={{ flex: 1 }}>
              <IconHome size={16} />
              <Text size="sm">{">"}</Text>
              <Text size="sm">Projects</Text>
              <Text size="sm">{">"}</Text>
            </Flex>

            {/* Right side */}
            <Flex align="center" gap="md">
              <IconSettings />
              <IconGitFork />
              <IconUser />
              <Button size="sm" rightSection={<IconUpload size={16} />}>
                Export Data
              </Button>
            </Flex>
          </Flex>
        </Paper>

        {/* Board */}
        <Paper withBorder radius="md" p="md" w="100%" style={{ flex: 1 }}>
          <Grid>
            <GridCol span={4}>
              <Paper withBorder radius="md" p="md">
                <Flex direction="column" gap="sm">
                  <Text fw={600}>To do</Text>
                  <Button
                    leftSection={<IconPlus size={16} />}
                    radius="lg"
                    color="violet"
                    variant="light"
                  >
                    Add New Task
                  </Button>
                </Flex>
              </Paper>
            </GridCol>

            <GridCol span={4}>
              <Paper withBorder radius="md" p="md">
                <Flex direction="column" gap="sm">
                  <Text fw={600}>In Progress</Text>
                  <Button
                    leftSection={<IconPlus size={16} />}
                    radius="lg"
                    color="yellow"
                    variant="light"
                  >
                    Add New Task
                  </Button>
                </Flex>
              </Paper>
            </GridCol>

            <GridCol span={4}>
              <Paper withBorder radius="md" p="md">
                <Flex direction="column" gap="sm">
                  <Text fw={600}>Completed</Text>
                  <Button
                    leftSection={<IconPlus size={16} />}
                    radius="lg"
                    color="green"
                    variant="light"
                  >
                    Add New Task
                  </Button>
                </Flex>
              </Paper>
            </GridCol>
          </Grid>
        </Paper>
      </Flex>
    </Container>
  );
};
