import {
  Paper,
  Text,
  List,
  Box,
  Stack,
  Tooltip,
  Avatar,
  Group,
  ThemeIcon,
  Image,
  Flex,
  Card,
} from "@mantine/core";
import { fullMessageResponse } from "../../types/messages";
import { IconFile } from "@tabler/icons-react";
import { downloadFile } from "../../utilities/supabase";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";

interface messageLayout {
  message: fullMessageResponse;
  isUser: boolean;
}

export const ChatBubble = ({ message, isUser }: messageLayout) => {
  const userId = useAuthStore((s) => s.authUser?.id);
  const profilepic = useAuthStore((s) => s.authUser?.profilepic);
  console.log("message", message);
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        padding: "8px 0",
      }}
    >
      <Group align="flex-end" gap="xs" style={{ maxWidth: "75%" }}>
        {/* avatar left for others, right for user */}
        {!isUser && (
          <Tooltip label={message.users.username}>
            <Avatar src={message.sender?.profilepic ?? null} size="sm" />
          </Tooltip>
        )}

        <Stack gap={4}>
          {/* attachments (shared UI) */}
          {message.attachments?.length > 0 && (
            <Group gap="xs">
              {message.attachments.map((file) => (
                <Card
                  withBorder
                  p="xs"
                  radius="md"
                  style={{ cursor: "pointer" }}
                  onClick={() => downloadFile(file.fileUrl, file.fileName)}
                >
                  <Group gap="xs">
                    <IconFile size={14} />
                    <Text size="xs" lineClamp={1}>
                      {file.fileName}
                    </Text>
                  </Group>
                </Card>
              ))}
            </Group>
          )}

          {/* message bubble */}
          {message.content.trim() && (
            <>
              <Paper
                p="sm"
                radius="lg"
                shadow="xs"
                style={{
                  backgroundColor: isUser
                    ? "var(--mantine-color-blue-filled)"
                    : "var(--mantine-color-gray-1)",
                  color: isUser ? "white" : "black",
                  borderTopLeftRadius: isUser ? "lg" : 4,
                  borderTopRightRadius: isUser ? 4 : "lg",
                  maxWidth: "100%",
                }}
              >
                <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                  {message.content}
                </Text>
              </Paper>
            </>
          )}
        </Stack>

        {/* avatar right for user */}
        {isUser && (
          <Tooltip label={message.users.username}>
            <Avatar src={profilepic} size="sm" />
          </Tooltip>
        )}
      </Group>
    </Box>
  );
};
