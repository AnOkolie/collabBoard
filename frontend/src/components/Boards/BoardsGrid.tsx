import {
  Button,
  Card,
  Flex,
  Grid,
  Paper,
  Pill,
  Stack,
  Text,
  Progress,
} from "@mantine/core";
import { IconAdjustmentsHorizontal, IconDots } from "@tabler/icons-react";
import { BoardType } from "../../types/boards";
import { CREATE_BOARD_HEADER, PROJECTS_TEXT } from "../../constants/string";
import { useBoardStore } from "../../zustand/useBoardStore/useBoardStore";
import { useMessageStore } from "../../zustand/messageStore/useMessageStore";
import { BOARDS_CREATE_BOARD, BOARDS_NO_BOARDS } from "../../utilities/string";

type BoardsGridProps = {
  rows: BoardType[];
  noBoards: boolean;
  onCreateBoard: () => void;
  onOpenBoard: (path: string) => void;
  onOpenBoardActions: (boardId: string) => void;
  onDeleteBoard: () => void;
  onRenameBoard: () => void;
};

const groups = [
  { name: "Web Design", color: "Blue" },
  { name: "Mobile App", color: "Orange" },
  { name: "App Development", color: "Pink" },
  { name: "Landing Page", color: "Blue" },
  { name: "Dashboard", color: "Purple" },
];

const colorMatch = groups.reduce<Record<string, string>>((acc, group) => {
  acc[group.name] = group.color;
  return acc;
}, {});

export const BoardsGrid = ({
  rows,
  noBoards,
  onCreateBoard,
  onOpenBoard,
  onOpenBoardActions,
}: BoardsGridProps) => {
  const { setBoardId, setCurrBoard } = useBoardStore();
  const { setCurrentConversation } = useMessageStore();
  return (
    <Paper withBorder radius="md" p="md">
      <Flex justify="space-between" align="center" p="lg" mb="md">
        <Text size="xl" fw={700}>
          {PROJECTS_TEXT}
        </Text>

        <Flex align="center" gap="sm">
          <IconAdjustmentsHorizontal />
          <Button size="sm" radius="lg" color="purple" onClick={onCreateBoard}>
            {CREATE_BOARD_HEADER}
          </Button>
        </Flex>
      </Flex>

      {noBoards ? (
        <Paper withBorder radius="lg" p="xl">
          <Stack align="center" gap="sm">
            <Text size="lg" fw={700}>
              {BOARDS_NO_BOARDS}
            </Text>
            <Text c="dimmed" ta="center">
              {BOARDS_CREATE_BOARD}
            </Text>
            <Button onClick={onCreateBoard}>{CREATE_BOARD_HEADER}</Button>
          </Stack>
        </Paper>
      ) : (
        <Grid>
          {rows.map((row) => (
            <Grid.Col span={{ base: 12, sm: 6, xl: 4 }} key={row.id}>
              <Card
                withBorder
                radius="lg"
                p="md"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrBoard(row);
                  setBoardId(row.id);
                  setCurrentConversation(row.conversationId);
                  onOpenBoard(`/board/${row.id}`);
                }}
              >
                <Flex justify="space-between" align="center" mb="sm">
                  <Pill color={colorMatch[row.title]?.toLowerCase() || "gray"}>
                    {row.title}
                  </Pill>

                  <IconDots
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenBoardActions(row.id);
                    }}
                  />
                </Flex>

                <Text size="sm" mb="sm">
                  {row.title}
                </Text>

                <Progress value={row.progress ?? 0} />
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Paper>
  );
};
