import {
  useDraggable,
  useSensor,
  useSensors,
  PointerSensor,
  DndContext,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActionIcon, Card, Group } from "@mantine/core";
import { CardType, ColumnType } from "~/types/columns";
import { Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconGripVertical } from "@tabler/icons-react";
export const TaskCard = ({ card }: { card: CardType }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
    >
      {card.title}
    </Card>
  );
};

export const DraggableCard = ({
  card,
  onClick,
}: {
  card: CardType;
  onClick: () => void;
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Requires moving 5px before drag begins, allowing click to fire
      },
    }),
  );
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: card.id,
      data: {
        card,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const [cardDetailsOpened, cardDetailsHandlers] = useDisclosure(false);

  return (
    <DndContext sensors={sensors}>
      <Card
        ref={setNodeRef}
        withBorder
        radius="md"
        p="sm"
        style={style}
        onClick={onClick}
      >
        <Group justify="space-between">
          <Text>{card.title}</Text>

          <ActionIcon {...listeners} {...attributes}>
            <IconGripVertical />
          </ActionIcon>
        </Group>
      </Card>
    </DndContext>
  );
};
