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
  Popover,
  Modal,
  TextInput,
  Input,
} from "@mantine/core";
import { IconAdjustmentsHorizontal, IconDots } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { useLoaderData } from "react-router-dom";
import { BoardType } from "../../types/boards";
import { useDisclosure } from "@mantine/hooks";
import { useActionData } from "react-router-dom";
import {
  CANCEL_BUTTON_TEXT,
  CREATE_BOARD_HEADER,
  CREATE_BUTTON_TEXT,
  DELETE_BUTTON_TEXT,
  DELETE_CARD_DESCRIPTION,
  PROJECTS_TEXT,
  RENAME_BUTTON_TEXT,
} from "../../constants/string";

export const BoardPage = () => {
  const [value, setValue] = useState(30);
  const [boardTitle, setBoardTitle] = useState("");
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

  const projectEntries = [
    { name: "Total", value: 144 },
    { name: "Completed", value: 56 },
    { name: "In Progress", value: 72 },
    { name: "Waiting", value: 24 },
  ];
  const loaderData = useLoaderData();
  const rows = loaderData?.data.board || [];
  const [createBoardOpened, createBoardHandlers] = useDisclosure(false);
  const [createCardOpened, createCardHandlers] = useDisclosure(false);
  const [deleteCardOpened, deleteCardHandlers] = useDisclosure(false);
  const [renameCardOpened, renameCardHandlers] = useDisclosure(false);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    if (!boardTitle.trim()) {
      e.preventDefault();
      return;
    }
    createBoardHandlers.close();
    setBoardTitle("");
  };
  const actionData = useActionData();
  useEffect(() => {
    if (actionData?.data.message === "Board deleted successfully") {
      deleteCardHandlers.close();
    } else if (actionData?.data.message === "Board renamed successfully") {
      renameCardHandlers.close();
    }
  }, [actionData]);
  return (
    <Container fluid h="80vh" c={"purple.5"}>
      <Modal
        opened={createBoardOpened}
        onClose={createBoardHandlers.close}
        title="Create new board"
        centered
        withinPortal
        zIndex={4000}
        overlayProps={{ zIndex: 3999 }}
      >
        <Form method="post" onSubmit={handleSubmit}>
          <Box>
            <TextInput
              label="Board name"
              placeholder="e.g. COMP 4710 Project"
              name="boardTitle"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.currentTarget.value)}
            />
            <Button
              fullWidth
              mt="md"
              onClick={close}
              disabled={!boardTitle.trim()}
              type="submit"
              name="intent"
              value="add-board"
            >
              {CREATE_BUTTON_TEXT}
            </Button>
          </Box>
        </Form>
      </Modal>
      <Modal opened={createCardOpened} onClose={createCardHandlers.close}>
        <Flex direction={"row"} gap={"md"} justify={"space-evenly"}>
          <Button
            onClick={() => {
              createCardHandlers.close();
              deleteCardHandlers.open();
            }}
          >
            {DELETE_BUTTON_TEXT}
          </Button>
          <Button
            onClick={() => {
              createCardHandlers.close();
              renameCardHandlers.open();
            }}
          >
            {RENAME_BUTTON_TEXT}
          </Button>
        </Flex>
      </Modal>
      <Modal opened={deleteCardOpened} onClose={deleteCardHandlers.close}>
        <Form method="post">
          <Input type="hidden" name="boardId" value={selectedBoardId} />
          <Text>{DELETE_CARD_DESCRIPTION}</Text>
          <Flex direction={"row"} gap={"md"} justify={"flex-end"} mt="md">
            <Button variant="outline" onClick={deleteCardHandlers.close}>
              {CANCEL_BUTTON_TEXT}
            </Button>
            <Button
              color="red"
              name="intent"
              value="delete-action"
              type="submit"
            >
              {DELETE_BUTTON_TEXT}
            </Button>
          </Flex>
        </Form>
      </Modal>
      <Modal opened={renameCardOpened} onClose={renameCardHandlers.close}>
        <Form method="post">
          <Input type="hidden" name="boardId" value={selectedBoardId} />
          <TextInput label="New card name" placeholder="e.g. Design homepage" />
          <Flex direction={"row"} gap={"md"} justify={"flex-end"} mt="md">
            <Button variant="outline" onClick={renameCardHandlers.close}>
              {CANCEL_BUTTON_TEXT}
            </Button>
            <Button name="intent" value="rename-action" type="submit">
              {RENAME_BUTTON_TEXT}
            </Button>
          </Flex>
        </Form>
      </Modal>
      <Group align="flex-start" gap="lg">
        <Paper withBorder radius={"md"} style={{ flex: 4 }} p={"md"}>
          <Flex justify="space-between" align="center" p="lg" mb="md">
            <Text size="xl" fw={700}>
              {PROJECTS_TEXT}
            </Text>
            <Flex align="center" gap="sm">
              <IconAdjustmentsHorizontal />
              <Button
                size="sm"
                radius="lg"
                color="purple"
                onClick={createBoardHandlers.open}
              >
                {CREATE_BOARD_HEADER}
              </Button>
            </Flex>
          </Flex>

          <Grid>
            {rows.map((row: BoardType) => (
              <Grid.Col span={4} key={row.id}>
                <Card withBorder radius="lg" p="md">
                  <Flex direction={"row"} justify="space-between">
                    <Pill
                      color={colorMatch[row.title]?.toLowerCase() || "gray"}
                    >
                      {row.title}
                    </Pill>
                    <IconDots
                      onClick={() => {
                        setSelectedBoardId(row.id);
                        createCardHandlers.open();
                      }}
                    />
                  </Flex>

                  <Text
                    size="sm"
                    mb="sm"
                    onClick={() => navigate(`/board/${row.id}`)}
                  >
                    {row.title}
                  </Text>
                  <Progress value={row.progress || 0} />
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
