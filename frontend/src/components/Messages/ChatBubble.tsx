import { Paper, Text, Stack, Box } from "@mantine/core";

interface messageLayout {
  message: string;
  isUser: boolean;
}

export const ChatBubble = ({ message, isUser }: messageLayout) => {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Paper
        shadow="xs"
        p="sm"
        radius="lg"
        style={{
          backgroundColor: isUser
            ? "var(--mantine-color-blue-filled)"
            : "var(--mantine-color-gray-2)",
          color: isUser ? "white" : "black",
          maxWidth: "70%",
        }}
      >
        <Text size="sm">{message}</Text>
      </Paper>
    </Box>
  );
};
