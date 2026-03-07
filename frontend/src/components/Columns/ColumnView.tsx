import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Input,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconGitFork,
  IconHome,
  IconPlus,
  IconSettings,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Form, useLoaderData } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { ColumnType } from "../../types/columns";
import {
  CANCEL_BUTTON_TEXT,
  CREATE_BUTTON_TEXT,
  CREATE_CARD_BUTTON_TEXT,
  CREATE_COLUMN_BUTTON_TEXT,
  CREATE_COLUMN_DESCRIPTION,
  EXPORT_DATA_BUTTON_TEXT,
  PROJECT_HEADER_TEXT,
} from "../../constants/string";
import { formatDate } from "../../utilities/format";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { moveCard } from "../../api/card";
import { DraggableCard } from "../Cards/CardView";

type LoaderData = {
  data: {
    message: string;
    columns: ColumnType[];
  };
};

type CardType = ColumnType["cards"][number];

export const ColumnView = () => {
  const { data } = useLoaderData() as LoaderData;

  const [createColumnOpened, createColumnHandlers] = useDisclosure(false);
  const [createCardOpened, createCardHandlers] = useDisclosure(false);
  const [cardDetailsOpened, cardDetailsHandlers] = useDisclosure(false);

  const [boardId, setBoardId] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState("");
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const columns = data.columns ?? [];

  useEffect(() => {
    if (columns.length > 0) {
      setBoardId(columns[0].board_id);
      console;
    }
  }, [columns]);

  const handleOpenCreateCard = (columnId: string) => {
    setSelectedColumnId(columnId);
    createCardHandlers.open();
  };

  const handleOpenCardDetails = (card: CardType) => {
    setSelectedCard(card);
    console.log("open card details");
    cardDetailsHandlers.open();
  };

  const [boardColumns, setBoardColumns] = useState<ColumnType[]>(
    data.columns ?? [],
  );

  useEffect(() => {
    setBoardColumns(data.columns ?? []);
  }, [data.columns]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const cardId = String(active.id);
    const targetColumnId = String(over.id);
    console.log("active.id:", active.id);
    console.log("over.id:", over?.id);

    let movedCard: CardType | null = null;
    let sourceColumnId: string | null = null;

    for (const column of boardColumns) {
      const found = column.cards.find((card) => card.id === cardId);
      if (found) {
        movedCard = found;
        sourceColumnId = column.id;
        break;
      }
    }

    if (!movedCard || !sourceColumnId) return;
    if (sourceColumnId === targetColumnId) return;

    const updatedCard = { ...movedCard, column_id: targetColumnId };

    const nextColumns = boardColumns.map((column) => {
      if (column.id === sourceColumnId) {
        return {
          ...column,
          cards: column.cards.filter((card) => card.id !== cardId),
        };
      }

      if (column.id === targetColumnId) {
        return {
          ...column,
          cards: [...column.cards, updatedCard],
        };
      }

      return column;
    });

    setBoardColumns(nextColumns);

    try {
      await moveCard(cardId, targetColumnId, boardId);
    } catch (error) {
      console.error("Failed to move card:", error);
      setBoardColumns(boardColumns);
    }
  };

  const DroppableColumn = ({
    column,
    children,
  }: {
    column: ColumnType;
    children: React.ReactNode;
  }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: column.id,
    });

    return (
      <Card
        ref={setNodeRef}
        withBorder
        radius="md"
        p="md"
        h="100%"
        style={{
          backgroundColor: isOver ? "#f3f0ff" : undefined,
        }}
      >
        {children}
      </Card>
    );
  };

  return (
    <Container fluid h="80vh" w="100%" p="xl">
      <Flex direction="column" align="center" gap="md">
        <Paper withBorder radius="md" p="sm" w="100%">
          <Flex align="center">
            <Flex align="center" gap="xs" style={{ flex: 1 }}>
              <IconHome size={16} />
              <Text size="sm">{">"}</Text>
              <Text size="sm" variant="link" component="a" href="/" span>
                {PROJECT_HEADER_TEXT}
              </Text>
              <Text size="sm">{">"}</Text>
            </Flex>

            <Flex align="center" gap="md">
              <IconSettings />
              <IconGitFork />
              <IconUser />
              <Button size="sm" rightSection={<IconUpload size={16} />}>
                {EXPORT_DATA_BUTTON_TEXT}
              </Button>
              <Button onClick={createColumnHandlers.open}>
                {CREATE_COLUMN_BUTTON_TEXT}
              </Button>
            </Flex>
          </Flex>
        </Paper>

        <Paper withBorder radius="md" p="md" w="100%" style={{ flex: 1 }}>
          <Modal
            opened={createColumnOpened}
            onClose={createColumnHandlers.close}
            title="Add a new Column"
            centered
          >
            <Form method="post">
              <Input type="hidden" name="boardId" value={boardId} />
              <Text>{CREATE_COLUMN_DESCRIPTION}</Text>
              <TextInput
                label="Column Title"
                placeholder="e.g. To Do"
                name="columnTitle"
              />
              <Flex justify="flex-end" mt="md" gap="md">
                <Button variant="outline" onClick={createColumnHandlers.close}>
                  {CANCEL_BUTTON_TEXT}
                </Button>
                <Button
                  onClick={createColumnHandlers.close}
                  type="submit"
                  name="intent"
                  value="add-column"
                >
                  {CREATE_BUTTON_TEXT}
                </Button>
              </Flex>
            </Form>
          </Modal>

          <Modal
            opened={createCardOpened}
            onClose={createCardHandlers.close}
            title="Add a new Card"
            centered
          >
            <Form method="post">
              <Input type="hidden" name="boardId" value={boardId} />
              <Input type="hidden" name="columnId" value={selectedColumnId} />
              <TextInput
                label="Card Title"
                placeholder="e.g. Task 1"
                name="cardTitle"
              />
              <TextInput
                label="Card Content"
                placeholder="e.g. Task 1 content"
                name="cardContent"
              />
              <Flex justify="flex-end" mt="md" gap="md">
                <Button
                  mt="md"
                  onClick={createCardHandlers.close}
                  type="submit"
                  name="intent"
                  value="add-card"
                >
                  {CREATE_CARD_BUTTON_TEXT}
                </Button>
                <Button
                  mt="md"
                  variant="outline"
                  onClick={createCardHandlers.close}
                >
                  {CANCEL_BUTTON_TEXT}
                </Button>
              </Flex>
            </Form>
          </Modal>

          <Modal
            opened={cardDetailsOpened}
            onClose={cardDetailsHandlers.close}
            title="Displaying Card Details"
            centered
          >
            {selectedCard && (
              <>
                <Text size="lg" fw={700} mb="md">
                  {selectedCard.title.toUpperCase()}
                </Text>
                <Text>{selectedCard.content}</Text>
                <Text>TimeStamp: {formatDate(selectedCard.updated_at)}</Text>
                <Text>{selectedCard.state || "No state"}</Text>
              </>
            )}
          </Modal>
          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <Grid h="100%" columns={columns.length || 1} gutter="md">
              {boardColumns.map((column) => (
                <Grid.Col span={1} key={column.id}>
                  <DroppableColumn column={column}>
                    <Flex
                      direction="row"
                      align="center"
                      justify="space-between"
                      mb="md"
                    >
                      <Text size="lg" fw={700} mb="md">
                        {column.title}
                      </Text>
                      <IconPlus
                        size={20}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOpenCreateCard(column.id)}
                      />
                    </Flex>

                    <Stack>
                      {column.cards.map((card) => (
                        <DraggableCard
                          key={card.id}
                          card={card}
                          onClick={() => handleOpenCardDetails(card)}
                        />
                      ))}
                    </Stack>
                  </DroppableColumn>
                </Grid.Col>
              ))}
            </Grid>
          </DndContext>
        </Paper>
      </Flex>
    </Container>
  );
};
