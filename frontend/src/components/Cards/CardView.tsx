import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@mantine/core";
import { ColumnType } from "~/types/columns";

export const TaskCard = ({ card }: { card: ColumnType }) => {
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
