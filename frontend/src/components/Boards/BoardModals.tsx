import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  Text,
  TextInput,
} from "@mantine/core";
import { Form, useActionData } from "react-router-dom";
import {
  CANCEL_BUTTON_TEXT,
  CREATE_BUTTON_TEXT,
  DELETE_BUTTON_TEXT,
  DELETE_CARD_DESCRIPTION,
  RENAME_BUTTON_TEXT,
} from "../../constants/string";
import { useEffect } from "react";
import { useBoardSocket } from "../../context/BoardSocketContext";
type DisclosureHandlers = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

type BoardModalsProps = {
  boardTitle: string;
  setBoardTitle: React.Dispatch<React.SetStateAction<string>>;
  newBoardTitle: string;
  setNewBoardTitle: React.Dispatch<React.SetStateAction<string>>;
  selectedBoardId: string;
  createBoardOpened: boolean;
  createBoardHandlers: DisclosureHandlers;
  boardActionsOpened: boolean;
  boardActionsHandlers: DisclosureHandlers;
  deleteBoardOpened: boolean;
  deleteBoardHandlers: DisclosureHandlers;
  renameBoardOpened: boolean;
  renameBoardHandlers: DisclosureHandlers;
  handleCreateBoardSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  handleRenameBoardSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
};

export const BoardModals = ({
  boardTitle,
  setBoardTitle,
  newBoardTitle,
  setNewBoardTitle,
  selectedBoardId,
  createBoardOpened,
  createBoardHandlers,
  boardActionsOpened,
  boardActionsHandlers,
  deleteBoardOpened,
  deleteBoardHandlers,
  renameBoardOpened,
  renameBoardHandlers,
  handleCreateBoardSubmit,
  handleRenameBoardSubmit,
}: BoardModalsProps) => {
  const actionData = useActionData() as {
    data: { message: string; board: { id: string } };
  };
  const { sendJsonMessage } = useBoardSocket();
  useEffect(() => {
    if (!actionData || !actionData.data) return;
    //sendJsonMessage to subscribe
    const { message, board } = actionData.data;
    if (message === "Board added successfully") {
      sendJsonMessage({
        type: "board:join",
        payload: { board_id: board.id },
      });
    }
  }, [actionData]);
  return (
    <>
      <Modal
        opened={createBoardOpened}
        onClose={createBoardHandlers.close}
        title="Create new board"
        centered
      >
        <Form method="post" onSubmit={handleCreateBoardSubmit}>
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

      <Modal
        opened={boardActionsOpened}
        onClose={boardActionsHandlers.close}
        title="Board actions"
        centered
      >
        <Flex gap="md" justify="space-evenly">
          <Button
            onClick={() => {
              boardActionsHandlers.close();
              renameBoardHandlers.open();
            }}
          >
            {RENAME_BUTTON_TEXT}
          </Button>
          <Button
            color="red"
            onClick={() => {
              boardActionsHandlers.close();
              deleteBoardHandlers.open();
            }}
          >
            {DELETE_BUTTON_TEXT}
          </Button>
        </Flex>
      </Modal>

      <Modal
        opened={deleteBoardOpened}
        onClose={deleteBoardHandlers.close}
        title="Delete board"
        centered
      >
        <Form method="post">
          <Input type="hidden" name="boardId" value={selectedBoardId} />
          <Text>{DELETE_CARD_DESCRIPTION}</Text>

          <Flex gap="md" justify="flex-end" mt="md">
            <Button variant="outline" onClick={deleteBoardHandlers.close}>
              {CANCEL_BUTTON_TEXT}
            </Button>
            <Button
              color="red"
              name="intent"
              value="delete-action"
              type="submit"
              onClick={deleteBoardHandlers.close}
            >
              {DELETE_BUTTON_TEXT}
            </Button>
          </Flex>
        </Form>
      </Modal>

      <Modal
        opened={renameBoardOpened}
        onClose={renameBoardHandlers.close}
        title="Rename board"
        centered
      >
        <Form method="post" onSubmit={handleRenameBoardSubmit}>
          <Input type="hidden" name="boardId" value={selectedBoardId} />
          <TextInput
            label="New board name"
            placeholder="e.g. Design homepage"
            name="newTitle"
            value={newBoardTitle}
            onChange={(e) => {
              setNewBoardTitle(e.currentTarget.value);
            }}
          />

          <Flex gap="md" justify="flex-end" mt="md">
            <Button variant="outline" onClick={renameBoardHandlers.close}>
              {CANCEL_BUTTON_TEXT}
            </Button>
            <Button name="intent" value="rename-action" type="submit">
              {RENAME_BUTTON_TEXT}
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};
