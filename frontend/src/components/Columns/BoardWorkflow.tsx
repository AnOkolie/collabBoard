import { Grid, Group, Stack, Text, Title } from "@mantine/core";
import { ColumnType } from "../../types/columns";
import { DraggableCard } from "../Cards/CardView";
import { DroppableColumn } from "./DroppableColumn";

type CardType = ColumnType["cards"][number];

type BoardWorkflowProps = {
  boardColumns: ColumnType[];
  onAddCard: (columnId: string) => void;
  onOpenCardDetails: (card: CardType) => void;
};

export const BoardWorkflow = ({
  boardColumns,
  onAddCard,
  onOpenCardDetails,
}: BoardWorkflowProps) => {
  return (
    <Stack gap="md">
      <Group justify="space-between">
        <div>
          <Title order={4}>Workflow</Title>
          <Text size="sm" c="dimmed">
            Drag cards between columns to update progress.
          </Text>
        </div>
      </Group>

      <Grid gutter="lg" columns={boardColumns.length || 1}>
        {boardColumns.map((column) => (
          <Grid.Col span={1} key={column.id}>
            <DroppableColumn column={column} onAddCard={onAddCard}>
              {column.cards &&
                column.cards.map((card) => (
                  <DraggableCard
                    key={card.id}
                    card={card}
                    onClick={() => onOpenCardDetails(card)}
                  />
                ))}
            </DroppableColumn>
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};
