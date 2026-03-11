import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import type { CardType } from "~/types/columns";

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
      data: { card },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.7 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    boxShadow: isDragging
      ? "0 12px 30px rgba(0,0,0,0.12)"
      : "0 2px 10px rgba(0,0,0,0.04)",
    transition:
      "box-shadow 150ms ease, transform 150ms ease, opacity 150ms ease",
  };

  return (
    <Card
      ref={setNodeRef}
      withBorder
      radius="lg"
      p="md"
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
    >
      <Stack gap={6}>
        <Text fw={600} size="sm" lineClamp={2}>
          {card.title}
        </Text>

        {card.content && (
          <Text c="dimmed" size="xs" lineClamp={2}>
            {card.content}
          </Text>
        )}

        <Group justify="space-between" mt={4}>
          <Badge variant="light" radius="sm">
            Task
          </Badge>
          <Text size="xs" c="dimmed">
            {card.state || "Open"}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};
