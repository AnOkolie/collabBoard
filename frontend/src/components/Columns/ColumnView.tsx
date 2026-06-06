import { Container, Paper, Stack, Divider, Group, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useActionData, useLoaderData } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";

import { ColumnType } from "../../types/columns";
import { BoardMembers } from "../../types/boards";
import { moveCard } from "../../api/card";
import { displayNotifications } from "../../utilities/displayNotifications";
import { useBoardSocket } from "../../context/BoardSocketContext";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useSearchUser } from "../../hooks/useSearchUser";

import { BoardHeader } from "./BoardHeader";
import { BoardWorkflow } from "./BoardWorkflow";
import { BoardModals } from "./BoardModals";

type LoaderData = {
  message: string;
  data: {
    columns: {
      message: string;
      columns: ColumnType[];
    };
    members: {
      data: BoardMembers[];
    };
  };
};

type CardType = ColumnType["cards"][number];

export const ColumnView = () => {
  const { data } = useLoaderData() as LoaderData;
  const actionData = useActionData() as any;

  const [createColumnOpened, createColumnHandlers] = useDisclosure(false);
  const [createCardOpened, createCardHandlers] = useDisclosure(false);
  const [cardDetailsOpened, cardDetailsHandlers] = useDisclosure(false);
  const [membersListOpened, memberListHandlers] = useDisclosure(false);

  const [boardId, setBoardId] = useState("");
  const [selectedColumnId, setSelectedColumnId] = useState("");
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [boardColumns, setBoardColumns] = useState<ColumnType[]>(
    data.columns.columns ?? [],
  );
  const [boardMembers, setBoardMembers] = useState<BoardMembers[]>(
    data.members.data ?? [],
  );

  const { searchName, setSearchName, usersByName } = useSearchUser(500);
  const { sendJsonMessage, isConnected, lastJsonMessage } = useBoardSocket();

  useEffect(() => {
    setBoardColumns(data.columns.columns ?? []);
    setBoardMembers(data.members.data ?? []);
    if (data.columns.columns.length > 0) {
      setBoardId(data.columns.columns[0].board_id);
    }
  }, [data.columns, data.members]);

  useEffect(() => {
    if (!actionData) return;
    if (actionData.error) {
      displayNotifications(
        "Column error",
        actionData.error.message.error,
        "red",
      );
    } else {
      displayNotifications(
        "Action completed",
        actionData.data.message,
        "green",
      );
    }
  }, [actionData]);

  useEffect(() => {
    if (!isConnected || !boardId) return;

    sendJsonMessage({
      type: "board:join",
      payload: {
        board_id: boardId,
      },
    });

    return () => {
      sendJsonMessage({
        type: "board:leave",
        payload: {
          board_id: boardId,
        },
      });
    };
  }, [isConnected, boardId, sendJsonMessage]);

  useEffect(() => {
    if (!lastJsonMessage) return;

    const { type } = lastJsonMessage;

    switch (type) {
      case "column:created": {
        const { payload } = lastJsonMessage;
        const newColumn = payload;
        setBoardColumns([...boardColumns, newColumn]);
        break;
      }
      case "column:deleted": {
        const { payload } = lastJsonMessage;
        const deletedColumn = payload;
        setBoardColumns((prevColumn) =>
          prevColumn.filter((column) => column.id !== deletedColumn.id),
        );
        break;
      }
      case "column:updated": {
        const { payload } = lastJsonMessage;
        const updatedColumn = payload;
        setBoardColumns((prevColumn) =>
          prevColumn.filter((column) => column.id !== updatedColumn.id),
        );
        setBoardColumns([...boardColumns, updatedColumn]);
        break;
      }
      case "card:created": {
        const { payload } = lastJsonMessage;
        const { columnId, card } = payload;

        setBoardColumns((prev) =>
          prev.map((column) =>
            column.id === columnId
              ? { ...column, cards: [...column.cards, card] }
              : column,
          ),
        );
        break;
      }

      case "card:moved": {
        const { payload } = lastJsonMessage;
        const { cardId, fromColumnId, toColumnId } = payload;

        setBoardColumns((prev) => {
          let movedCard: CardType | null = null;

          const next = prev.map((column) => {
            if (column.id === fromColumnId) {
              const found = column.cards.find((c) => c.id === cardId);
              if (found) movedCard = { ...found, column_id: toColumnId };

              return {
                ...column,
                cards: column.cards.filter((c) => c.id !== cardId),
              };
            }

            return column;
          });

          if (!movedCard) return prev;

          return next.map((column) =>
            column.id === toColumnId
              ? { ...column, cards: [...column.cards, movedCard!] }
              : column,
          );
        });
        break;
      }

      case "card:updated": {
        const { payload } = lastJsonMessage;
        const { card } = payload;

        setBoardColumns((prev) =>
          prev.map((column) => ({
            ...column,
            cards: column.cards.map((c) => (c.id === card.id ? card : c)),
          })),
        );
        break;
      }

      case "card:deleted": {
        const { payload } = lastJsonMessage;
        const { cardId, columnId } = payload;

        setBoardColumns((prev) =>
          prev.map((column) =>
            column.id === columnId
              ? {
                  ...column,
                  cards: column.cards.filter((c) => c.id !== cardId),
                }
              : column,
          ),
        );
        break;
      }

      default:
        break;
    }
  }, [lastJsonMessage]);

  const handleOpenCreateCard = (columnId: string) => {
    setSelectedColumnId(columnId);
    createCardHandlers.open();
  };

  const handleOpenCardDetails = (card: CardType) => {
    setSelectedCard(card);
    cardDetailsHandlers.open();
  };

  const handleInviteUser = (friendId: string) => {
    const currUser = useAuthStore.getState().authUser;
    if (!currUser || !currUser.id || !friendId || !isConnected || !boardId)
      return;

    sendJsonMessage({
      type: "board-invite",
      user_id: currUser.id,
      friend_id: friendId,
      board_id: boardId,
      message: "Board invitation",
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = String(active.id);
    const targetColumnId = String(over.id);

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

    const previousColumns = boardColumns;
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
      setBoardColumns(previousColumns);
    }
  };

  return (
    <Container fluid p="xl">
      <Stack gap="lg">
        <BoardHeader
          onOpenMembers={memberListHandlers.open}
          onOpenCreateColumn={createColumnHandlers.open}
        />

        <Paper withBorder radius="xl" p="lg">
          <Stack gap="md">
            <Divider />

            <BoardModals
              boardId={boardId}
              selectedColumnId={selectedColumnId}
              selectedCard={selectedCard}
              boardMembers={boardMembers}
              usersByName={usersByName}
              searchName={searchName}
              setSearchName={setSearchName}
              createColumnOpened={createColumnOpened}
              createColumnHandlers={createColumnHandlers}
              createCardOpened={createCardOpened}
              createCardHandlers={createCardHandlers}
              cardDetailsOpened={cardDetailsOpened}
              cardDetailsHandlers={cardDetailsHandlers}
              membersListOpened={membersListOpened}
              memberListHandlers={memberListHandlers}
              onInviteUser={handleInviteUser}
            />

            <DndContext
              collisionDetection={closestCorners}
              onDragEnd={handleDragEnd}
            >
              <BoardWorkflow
                boardColumns={boardColumns}
                onAddCard={handleOpenCreateCard}
                onOpenCardDetails={handleOpenCardDetails}
              />
            </DndContext>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};
