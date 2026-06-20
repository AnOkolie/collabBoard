import { Flex, Text, Stack, ThemeIcon, Box } from "@mantine/core";
import { IconMessageCircle } from "@tabler/icons-react";

export const EmptyConversation = () => {
  return (
    <Box flex={1}>
      <Flex h="100%" align="center" justify="center" direction="column">
        <Stack align="center" gap="xs">
          <ThemeIcon size={64} radius="xl" variant="light">
            <IconMessageCircle size={32} />
          </ThemeIcon>

          <Text fw={600} size="lg">
            No conversation selected
          </Text>

          <Text size="sm" c="dimmed" ta="center">
            Choose a conversation from the left to start messaging
          </Text>
        </Stack>
      </Flex>
    </Box>
  );
};
