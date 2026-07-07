import { Paper, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { MantineColor } from "@mantine/core";

type StatCardProps = {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  color: MantineColor;
};

export const StatCard = ({
  title,
  value,
  description,
  icon,
  color,
}: StatCardProps) => (
  <Paper
    withBorder
    radius="lg"
    p="lg"
    style={{
      cursor: "pointer",
      transition: "transform .15s ease, box-shadow .15s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-3px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    <Group justify="space-between" align="flex-start">
      <Stack gap={2}>
        <Text size="sm" c="dimmed" fw={500}>
          {title}
        </Text>

        <Text fw={700} fz={36}>
          {value}
        </Text>

        <Text size="xs" c="dimmed">
          {description}
        </Text>
      </Stack>

      <ThemeIcon size={48} radius="xl" variant="light" color={color}>
        {icon}
      </ThemeIcon>
    </Group>
  </Paper>
);
