import { useDraggable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@mantine/core";
import { CardType, ColumnType } from "~/types/columns";
import { Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
    <Card
      ref={setNodeRef}
      withBorder
      radius="md"
      p="sm"
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
    >
      <Text>{card.title}</Text>
    </Card>
  );
};
