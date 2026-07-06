import { useState, useRef, useEffect } from "react";
import { CardType } from "../../types/columns";
import {
  Stack,
  Divider,
  Box,
  Text,
  Title,
  Paper,
  SimpleGrid,
  Badge,
  Group,
  TextInput,
  Textarea,
  Button,
  Select,
  ActionIcon,
} from "@mantine/core";
import { formatDate } from "../../utilities/format";
import { IconClipboardText, IconPencil, IconCheck } from "@tabler/icons-react";
import { BoardMembers } from "../../types/boards";
import {
  CARD_CANCEL,
  CARD_DESCRIPTION,
  CARD_DETAILS,
  CARD_DUE_DATE,
  CARD_LAST_UPDATED,
  CARD_SAVE_CHANGES,
  CARD_STATUS,
  CARD_TITLE,
} from "../../utilities/string";
import { ProductionDatePicker } from "./DatePicker";
import { useCardHook } from "../../hooks/useCardHook";

type CardDetailsProps = {
  selectedCard: CardType;
  members: BoardMembers[];
  boardId: string;
  close: () => void;
};
export const CardDetails = ({
  selectedCard,
  members,
  boardId,
  close,
}: CardDetailsProps) => {
  const [descriptionText, setDescriptionText] = useState(
    selectedCard.content || "No description has been added.",
  );
  const [cardTitle, setCardTitle] = useState(selectedCard.title);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpadted, setIsUpdated] = useState(false);
  const [assignedUser, setAssignedUser] = useState("");
  const { updateCardDetails } = useCardHook();
  const cardContent = useRef(descriptionText);
  const handleSubmit = () => {
    cardContent.current = descriptionText;
    const card = {
      id: selectedCard.id,
      columnId: selectedCard.columnId,
      content: descriptionText.trim(),
      updatedAt: selectedCard.updatedAt,
      state: selectedCard.state,
      title: cardTitle,
      dueDate: selectedCard.dueDate,
      assignee:
        members.find((user) => user.username === assignedUser)?.id ?? "",
    };
    updateCardDetails(card, boardId);
    close();
  };
  useEffect(() => {
    if (cardContent && cardContent.current !== descriptionText) {
      setDescriptionText(cardContent.current);
    }
  }, []);
  return (
    <Stack gap="xl">
      {/* Title */}
      <Box>
        <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
          {CARD_TITLE}
        </Text>
        <Group>
          {isEditing ? (
            <TextInput
              value={cardTitle}
              onChange={(e) => {
                setCardTitle(e.target.value);
                setIsUpdated(true);
              }}
              onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
              autoFocus
            />
          ) : (
            <Title order={3} mt={4}>
              {cardTitle}
            </Title>
          )}
          <ActionIcon
            onClick={() => setIsEditing(!isEditing)}
            variant="subtle"
            aria-label="Edit title"
          >
            {isEditing ? <IconCheck size={16} /> : <IconPencil size={16} />}
          </ActionIcon>
        </Group>
      </Box>

      <Divider />

      {/* Description */}
      <Box>
        <Text size="xs" c="dimmed" tt="uppercase" fw={700} mb={6}>
          {CARD_DESCRIPTION}
        </Text>

        <Paper withBorder p="md" radius="md" bg="gray.0">
          <Textarea
            autosize
            minRows={4}
            maxRows={10}
            value={descriptionText}
            onChange={(e) => {
              setDescriptionText(e.target.value);
              setIsUpdated(true);
            }}
          />
        </Paper>
      </Box>

      {/* Details */}
      <SimpleGrid cols={2} spacing="lg">
        <Paper withBorder p="sm" radius="md">
          <Text size="xs" c="dimmed">
            {CARD_STATUS}
          </Text>

          <Badge
            mt={4}
            color={
              selectedCard.state === "Completed"
                ? "green"
                : selectedCard.state === "In Progress"
                  ? "blue"
                  : "gray"
            }
            variant="light"
          >
            {selectedCard.state ?? "Not set"}
          </Badge>
        </Paper>

        <Paper withBorder p="sm" radius="md">
          <Text size="xs" c="dimmed">
            {CARD_LAST_UPDATED}
          </Text>

          <Text mt={4}>{formatDate(selectedCard.updatedAt)}</Text>
        </Paper>

        {selectedCard.dueDate && (
          <Paper withBorder p="sm" radius="md">
            <Text size="xs" c="dimmed">
              {CARD_DUE_DATE}
            </Text>
            <ProductionDatePicker />
          </Paper>
        )}
        <Paper withBorder p="sm" radius="md">
          <Select
            label="assign task"
            data={members.map((user) => user.username)}
            defaultValue={
              members.find((user) => user.id === selectedCard.assignee)
                ?.username ?? members[0].username
            }
            onChange={(assignedUser) => {
              setIsUpdated(true);
              setAssignedUser(
                members.find((user) => user.username === assignedUser)
                  ?.username ?? "",
              );
            }}
          />
        </Paper>
      </SimpleGrid>
      <Group justify="flex-end">
        <Button variant="default" onClick={close}>
          {CARD_CANCEL}
        </Button>

        <Button disabled={!isUpadted} onClick={() => handleSubmit()}>
          {CARD_SAVE_CHANGES}
        </Button>
      </Group>
    </Stack>
  );
};

export const CardDetailsTitle = () => {
  return (
    <>
      <Group>
        <IconClipboardText size={20} />
        <Text fw={700}>{CARD_DETAILS}</Text>
      </Group>
    </>
  );
};
