import { Container, Grid } from "@mantine/core";
import { useMemo, useState } from "react";
import { useActionData, useLoaderData, useNavigate } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { BoardType } from "../../types/boards";
import { BoardsGrid } from "./BoardsGrid";
import { BoardStatsPanel } from "./BoardStatsPanel";
import { BoardModals } from "./BoardModals";

type LoaderData = {
  boards: {
    board: BoardType[];
  };
  stats: {
    data: Record<string, number>;
  };
};

export const BoardPage = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as any;

  const rows = loaderData?.boards?.board ?? [];
  const stats = loaderData?.stats?.data ?? {};

  const [boardTitle, setBoardTitle] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState("");

  const [createBoardOpened, createBoardHandlers] = useDisclosure(false);
  const [boardActionsOpened, boardActionsHandlers] = useDisclosure(false);
  const [deleteBoardOpened, deleteBoardHandlers] = useDisclosure(false);
  const [renameBoardOpened, renameBoardHandlers] = useDisclosure(false);

  const boardDetails = useMemo(() => stats, [stats]);

  const boardProgress = useMemo(() => {
    const total = stats?.total ?? 0;
    const completed = stats?.Completed ?? 0;
    if (!total) return 0;
    return Math.round((completed / total) * 100);
  }, [stats]);

  const noBoards = rows.length === 0;

  const handleCreateBoardSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!boardTitle.trim()) {
      e.preventDefault();
      return;
    }
    createBoardHandlers.close();
    setBoardTitle("");
  };

  const openBoardActions = (boardId: string) => {
    setSelectedBoardId(boardId);
    boardActionsHandlers.open();
  };

  return (
    <Container fluid p="xl">
      <BoardModals
        boardTitle={boardTitle}
        setBoardTitle={setBoardTitle}
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
      />

      <Grid gutter="lg" align="flex-start">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <BoardsGrid
            rows={rows}
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
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <BoardStatsPanel
            boardProgress={boardProgress}
            boardDetails={boardDetails}
          />
        </Grid.Col>
      </Grid>
    </Container>
  );
};
