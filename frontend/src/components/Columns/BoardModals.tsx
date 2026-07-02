import {
  Button,
  Flex,
  Input,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
  Group,
} from "@mantine/core";
import { Form } from "react-router-dom";
import { formatDate } from "../../utilities/format";
import { ColumnType } from "../../types/columns";
import { BoardMembers } from "../../types/boards";
import {
  CANCEL_BUTTON_TEXT,
  CREATE_BUTTON_TEXT,
  CREATE_CARD_BUTTON_TEXT,
  CREATE_COLUMN_DESCRIPTION,
} from "../../constants/string";
import { MembersModal } from "./MembersModal";
import { useState } from "react";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type CardType = ColumnType["cards"][number];

type DisclosureHandlers = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

type BoardModalsProps = {
  boardId: string;
  selectedColumnId: string;
  selectedCard: CardType | null;
  boardMembers: BoardMembers[];
  usersByName: any[];
  searchName: string;
  setSearchName: React.Dispatch<React.SetStateAction<string>>;
  createColumnOpened: boolean;
  createColumnHandlers: DisclosureHandlers;
  createCardOpened: boolean;
  createCardHandlers: DisclosureHandlers;
  cardDetailsOpened: boolean;
  cardDetailsHandlers: DisclosureHandlers;
  membersListOpened: boolean;
  memberListHandlers: DisclosureHandlers;
  onInviteUser: (userId: string) => void;
};

export const BoardModals = ({
  boardId,
  selectedColumnId,
  selectedCard,
  boardMembers,
  usersByName,
  searchName,
  setSearchName,
  createColumnOpened,
  createColumnHandlers,
  createCardOpened,
  createCardHandlers,
  cardDetailsOpened,
  cardDetailsHandlers,
  membersListOpened,
  memberListHandlers,
  onInviteUser,
}: BoardModalsProps) => {
  const [titleText, setTitleText] = useState("");
  const userId = useAuthStore.getState().authUser?.id;
  const [startDate, setStartDate] = useState(new Date());
  return (
    <>
      <Modal
        opened={createColumnOpened}
        onClose={createColumnHandlers.close}
        title="Add a new Column"
        centered
      >
        <Form method="post">
          <Input type="hidden" name="boardId" value={boardId} />
          <Input type="hidden" name="userId" value={userId} />
          <Text>{CREATE_COLUMN_DESCRIPTION}</Text>
          <TextInput
            label="Column Title"
            placeholder="e.g. To Do"
            name="columnTitle"
            mt="md"
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
        onExitTransitionEnd={() => setTitleText("")}
      >
        <Form method="post">
          <Input type="hidden" name="boardId" value={boardId} />
          <Input type="hidden" name="columnId" value={selectedColumnId} />
          <TextInput
            label="Card Title"
            placeholder="e.g. Task 1"
            name="cardTitle"
            maxLength={25}
            onChange={(e) => setTitleText(e.target.value)}
          />
          <Text c={"dimmed"}>{titleText.length}/25</Text>
          <TextInput
            label="Card Content"
            placeholder="e.g. Task 1 content"
            name="cardContent"
            mt="md"
          />
          <Group m={"md"}>
            <Text>Task Due date</Text>
            <DatePicker
              name="due-date"
              selected={startDate}
              onChange={(date: Date | null) => {
                if (date) setStartDate(date);
              }}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              filterDate={(date: Date) =>
                date.getDay() !== 0 && date.getDay() !== 6
              }
            />
          </Group>

          <Flex justify="flex-end" mt="md" gap="md">
            <Button
              onClick={createCardHandlers.close}
              type="submit"
              name="intent"
              value="add-card"
            >
              {CREATE_CARD_BUTTON_TEXT}
            </Button>
            <Button variant="outline" onClick={createCardHandlers.close}>
              {CANCEL_BUTTON_TEXT}
            </Button>
          </Flex>
        </Form>
      </Modal>

      <Modal
        opened={cardDetailsOpened}
        onClose={cardDetailsHandlers.close}
        title="Card Details"
        centered
      >
        {selectedCard && (
          <Stack gap="sm">
            <Title order={4}>{selectedCard.title}</Title>
            <Text>{selectedCard.content}</Text>
            <Text size="sm" c="dimmed">
              Updated: {formatDate(selectedCard.updated_at)}
            </Text>
            <Text size="sm">{selectedCard.state || "No state"}</Text>
          </Stack>
        )}
      </Modal>

      <MembersModal
        opened={membersListOpened}
        onClose={memberListHandlers.close}
        boardMembers={boardMembers}
        usersByName={usersByName}
        searchName={searchName}
        setSearchName={setSearchName}
        onInviteUser={onInviteUser}
      />
    </>
  );
};
