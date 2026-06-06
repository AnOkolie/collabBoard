import { useDroppable } from "@dnd-kit/core";
import { ActionIcon, Paper, Stack, Group, TextInput } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import type { ColumnType } from "../../types/columns";
import { useState } from "react";

type DroppableColumnProps = {
  column: ColumnType;
  onAddCard: (columnId: string) => void;
  children: React.ReactNode;
};

export const DroppableColumn = ({
  column,
  onAddCard,
  children,
}: DroppableColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <Paper
      ref={setNodeRef}
      radius="xl"
      p="md"
      withBorder
      h="100%"
      style={{
        background: isOver
          ? "linear-gradient(180deg, #f3e8ff 0%, #faf5ff 100%)"
          : "#fcfcfd",
        borderColor: isOver ? "#c084fc" : undefined,
        transition: "all 150ms ease",
        minHeight: 420,
      }}
    >
      <Group justify="space-between" align="center" mb="md">
        <TextInput fw={700} size="md" defaultValue={column.title} />

        <ActionIcon
          variant="light"
          radius="xl"
          onClick={() => onAddCard(column.id)}
        >
          <IconPlus size={16} />
        </ActionIcon>
      </Group>

      <Stack gap="sm">{children}</Stack>
    </Paper>
  );
};
