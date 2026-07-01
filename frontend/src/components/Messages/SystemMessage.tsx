import { Paper, Text, Center } from "@mantine/core";

type SystemMessageProps = {
  message: {
    id: string;
    content?: string;
    createdAt?: string;
  };
};

export const SystemMessage = ({ message }: SystemMessageProps) => {
  return (
    <Center my="xs">
      <Paper
        radius="xl"
        px="md"
        py={6}
        withBorder
        style={{
          backgroundColor: "rgba(120, 120, 120, 0.08)",
          borderStyle: "dashed",
          borderColor: "rgba(120, 120, 120, 0.25)",
          maxWidth: "70%",
        }}
      >
        <Text size="xs" c="dimmed" ta="center">
          {message.content}
        </Text>
      </Paper>
    </Center>
  );
};
