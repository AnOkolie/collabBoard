import { Avatar, Text, Flex, Group, Stack, ActionIcon } from "@mantine/core";
import { UserConversation } from "../../types/messages";
import { IconPhone, IconVideo, IconDotsVertical } from "@tabler/icons-react";
type ChatHeaderProps = {
  displayPicture: string;
  name: string;
};

export const ChatHeader = ({ displayPicture, name }: ChatHeaderProps) => {
  // console.log("conversations", conversations);
  return (
    <Flex justify="space-between" align="center" px="md" h="100%">
      <Group gap="sm">
        <Avatar src={displayPicture} size="md" radius="xl" />

        <Stack gap={0}>
          <Text fw={600} size="sm">
            {name ?? "Unknown User"}
          </Text>

          <Text size="xs" c="dimmed">
            Online
          </Text>
        </Stack>
      </Group>

      <Group gap="xs">
        <ActionIcon variant="subtle" radius="xl">
          <IconPhone size={18} />
        </ActionIcon>

        <ActionIcon variant="subtle" radius="xl">
          <IconVideo size={18} />
        </ActionIcon>

        <ActionIcon variant="subtle" radius="xl">
          <IconDotsVertical size={18} />
        </ActionIcon>
      </Group>
    </Flex>
  );
};
