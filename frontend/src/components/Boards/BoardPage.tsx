import {
  Container,
  Grid,
  Stack,
  Title,
  Text,
  Group,
  Button,
  Paper,
  Divider,
} from "@mantine/core";
import { useMemo, useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { BoardType } from "../../types/boards";
import { BoardsGrid } from "./BoardsGrid";
import { BoardStatsPanel } from "./BoardStatsPanel";
import { BoardModals } from "./BoardModals";
import { useSocket } from "../../context/SocketContext";
import { useBoardStore } from "../../zustand/useBoardStore/useBoardStore";

type LoaderData = {
  boards: {
    board: BoardType[];
  };
  stats: {
    data: {
      stats: Record<string, number>;
    };
  };
};

export const BoardPage = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as LoaderData;
  const stats = loaderData?.stats?.data.stats ?? {};

  const [boardTitle, setBoardTitle] = useState("");
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState("");
  // const [rows, setRows] = useState<BoardType[]>(
  //   loaderData?.boards?.board ?? [],
  // );
  const [createBoardOpened, createBoardHandlers] = useDisclosure(false);
  const [boardActionsOpened, boardActionsHandlers] = useDisclosure(false);
  const [deleteBoardOpened, deleteBoardHandlers] = useDisclosure(false);
  const [renameBoardOpened, renameBoardHandlers] = useDisclosure(false);
  const boardDetails = stats;
  const { userBoards, setUserBoards } = useBoardStore();
  const boardProgress = useMemo(() => {
    const total = stats?.total ?? 0;
    const completed = stats?.Completed ?? 0;
    if (!total) return 0;
    return Math.round((completed / total) * 100);
  }, [stats]);
  const noBoards = userBoards.length === 0;

  const handleCreateBoardSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    if (!boardTitle || !boardTitle.trim()) {
      e.preventDefault();
      return;
    }
    createBoardHandlers.close();
    setBoardTitle("");
  };

  const handleRenameBoardSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    if (!newBoardTitle.trim()) {
      e.preventDefault();
      return;
    }
    renameBoardHandlers.close();
    setNewBoardTitle("");
  };

  const openBoardActions = (boardId: string) => {
    setSelectedBoardId(boardId);
    boardActionsHandlers.open();
  };
  const { sendJsonMessage, lastJsonMessage, isConnected } = useSocket();

  useEffect(() => {
    if (!loaderData) return;
    setUserBoards(loaderData.boards?.board ?? []);
  }, [loaderData]);
  useEffect(() => {
    if (
      !isConnected ||
      typeof selectedBoardId !== "string" ||
      !selectedBoardId.trim()
    ) {
      return;
    }

    sendJsonMessage({
      type: "board:join",
      payload: {
        board_id: selectedBoardId,
      },
    });

    return () => {
      sendJsonMessage({
        type: "board:leave",
        payload: {
          board_id: selectedBoardId,
        },
      });
    };
  }, [isConnected, selectedBoardId, sendJsonMessage]);

  return (
    <Container size="xl" py="xl">
      <BoardModals
        boardTitle={boardTitle}
        setBoardTitle={setBoardTitle}
        newBoardTitle={newBoardTitle}
        setNewBoardTitle={setNewBoardTitle}
        selectedBoardId={selectedBoardId}
        createBoardOpened={createBoardOpened}
        createBoardHandlers={createBoardHandlers}
        boardActionsOpened={boardActionsOpened}
        boardActionsHandlers={boardActionsHandlers}
        deleteBoardOpened={deleteBoardOpened}
        deleteBoardHandlers={deleteBoardHandlers}
        renameBoardOpened={renameBoardOpened}
        renameBoardHandlers={renameBoardHandlers}
        handleCreateBoardSubmit={handleCreateBoardSubmit}
        handleRenameBoardSubmit={handleRenameBoardSubmit}
      />

      <Stack gap="lg">
        <Paper
          p="xl"
          radius="xl"
          withBorder
          style={{
            background:
              "linear-gradient(135deg, rgba(250,245,255,1) 0%, rgba(243,232,255,1) 100%)",
          }}
        >
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={1}>Your Boards</Title>
              <Text c="dimmed" mt={6}>
                Manage projects, track progress, and jump back into your active
                work.
              </Text>
            </div>

            <Button
              leftSection={<IconPlus size={16} />}
              radius="xl"
              onClick={createBoardHandlers.open}
            >
              Create Board
            </Button>
          </Group>
        </Paper>

        <Grid gutter="lg" align="stretch">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Paper withBorder radius="xl" p="lg" h="100%">
              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <div>
                    <Title order={3}>Projects</Title>
                    <Text size="sm" c="dimmed">
                      {noBoards
                        ? "No boards yet"
                        : `${userBoards.length} board${userBoards.length === 1 ? "" : "s"} available`}
                    </Text>
                  </div>
                </Group>

                <Divider />

                <BoardsGrid
                  rows={userBoards}
                  noBoards={noBoards}
                  onCreateBoard={createBoardHandlers.open}
                  onOpenBoard={navigate}
                  onOpenBoardActions={openBoardActions}
                  onDeleteBoard={() => {
                    boardActionsHandlers.close();
                    deleteBoardHandlers.open();
                  }}
                  onRenameBoard={() => {
                    boardActionsHandlers.close();
                    renameBoardHandlers.open();
                  }}
                />
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="lg">
              <Paper withBorder radius="xl" p="lg">
                <BoardStatsPanel
                  boardProgress={boardProgress}
                  boardDetails={boardDetails}
                />
              </Paper>

              <Paper withBorder radius="xl" p="lg">
                <Title order={4}>Quick Notes</Title>
                <Text size="sm" c="dimmed" mt="xs">
                  Keep an eye on project health here. You can use this space
                  later for announcements, deadlines, or team updates.
                </Text>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
};
