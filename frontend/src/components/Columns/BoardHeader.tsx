import { Button, Group, Paper, Text, Title } from "@mantine/core";
import {
  IconGitFork,
  IconHome,
  IconSettings,
  IconUpload,
  IconUser,
} from "@tabler/icons-react";
import {
  CREATE_COLUMN_BUTTON_TEXT,
  EXPORT_DATA_BUTTON_TEXT,
  PROJECT_HEADER_TEXT,
} from "../../constants/string";

type BoardHeaderProps = {
  onOpenMembers: () => void;
  onOpenCreateColumn: () => void;
};

export const BoardHeader = ({
  onOpenMembers,
  onOpenCreateColumn,
}: BoardHeaderProps) => {
  return (
    <Paper
      withBorder
      radius="xl"
      p="xl"
      style={{
        background:
          "linear-gradient(135deg, rgba(250,245,255,1) 0%, rgba(243,232,255,1) 100%)",
      }}
    >
      <Group justify="space-between" align="flex-start">
        <div>
          <Group gap="xs" mb={6}>
            <IconHome size={16} />
            <Text size="sm" c="dimmed">
              {">"}
            </Text>
            <Text size="sm" c="dimmed">
              {PROJECT_HEADER_TEXT}
            </Text>
          </Group>

          <Title order={2}>Project Board</Title>
          <Text c="dimmed" mt={6}>
            Organize tasks, move work across columns, and keep progress visible.
          </Text>
        </div>

        <Group gap="sm">
          <Button variant="default" leftSection={<IconSettings size={16} />}>
            Settings
          </Button>
          <Button variant="default" leftSection={<IconGitFork size={16} />}>
            Activity
          </Button>
          <Button
            variant="default"
            leftSection={<IconUser size={16} />}
            onClick={onOpenMembers}
          >
            Members
          </Button>
          <Button leftSection={<IconUpload size={16} />}>
            {EXPORT_DATA_BUTTON_TEXT}
          </Button>
          <Button onClick={onOpenCreateColumn}>
            {CREATE_COLUMN_BUTTON_TEXT}
          </Button>
        </Group>
      </Group>
    </Paper>
  );
};
