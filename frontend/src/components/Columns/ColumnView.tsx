import { Container, Paper, Stack, Divider } from "@mantine/core";
import { useEffect, useState } from "react";
import { useActionData, useLoaderData } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";

import { ColumnType } from "../../types/columns";
import { BoardMembers } from "../../types/boards";
import { displayNotifications } from "../../utilities/notification/displayNotifications";

import { useSearchUser } from "../../hooks/useSearchUser";

import { BoardHeader } from "./BoardHeader";
import { BoardWorkflow } from "./BoardWorkflow";
import { BoardModals } from "./BoardModals";
import { useColumnStore } from "../../zustand/columnStore/useColumnStore";
import { useColumnHook } from "../../hooks/useColumnHook";
import { usePresenceHook } from "../../hooks/usePresenceHook";

type LoaderData = {
  message: string;

  columns: {
    message: string;
    columns: ColumnType[];
  };
  members: {
    data: BoardMembers[];
  };
};

type CardType = ColumnType["cards"][number];

export const ColumnView = () => {
  const loaderData = useLoaderData() as LoaderData;
  const actionData = useActionData() as any;
  const [createColumnOpened, createColumnHandlers] = useDisclosure(false);
  const [createCardOpened, createCardHandlers] = useDisclosure(false);
  const [cardDetailsOpened, cardDetailsHandlers] = useDisclosure(false);
  const [membersListOpened, memberListHandlers] = useDisclosure(false);

  const [selectedColumnId, setSelectedColumnId] = useState("");
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const [boardMembers, setBoardMembers] = useState<BoardMembers[]>(
    loaderData.members.data ?? [],
  );

  const { searchName, setSearchName, usersByName } = useSearchUser(500);
  const { boardId, setBoardId, columns, setColumns } = useColumnStore();
  usePresenceHook();
  useEffect(() => {
    if (!loaderData) return;
    setColumns(loaderData.columns.columns ?? []);
    setBoardMembers(loaderData.members.data ?? []);
  }, [loaderData]);

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

  const { sendBoardInvite, optimisticMoveCard } = useColumnHook();
  const handleOpenCreateCard = (columnId: string) => {
    setSelectedColumnId(columnId);
    createCardHandlers.open();
  };

  const handleOpenCardDetails = (card: CardType) => {
    setSelectedCard(card);
    cardDetailsHandlers.open();
  };

  const handleInviteUser = (friendId: string) => {
    sendBoardInvite(friendId);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = String(active.id);
    const targetColumnId = String(over.id);

    let movedCard: CardType | null = null;
    let sourceColumnId: string | null = null;

    for (const column of columns) {
      const found = column.cards.find((card) => card.id === cardId);
      if (found) {
        movedCard = found;
        sourceColumnId = column.id;
        break;
      }
    }

    if (!movedCard || !sourceColumnId) return;
    if (sourceColumnId === targetColumnId) return;

    optimisticMoveCard(movedCard.id, sourceColumnId, targetColumnId);
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
