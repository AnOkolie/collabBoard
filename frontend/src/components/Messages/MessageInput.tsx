import { ActionIcon, FileButton, Pill, TextInput, Flex } from "@mantine/core";
import { IconPaperclip, IconSend } from "@tabler/icons-react";
import { useRef, useState, useEffect } from "react";
import { Form } from "react-router-dom";
import { useConversation } from "../../hooks/useConversation";
import { conversationMessage } from "../../types/messages";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useMessage } from "../../hooks/useMessage";
import { getSupabasePath, uploadFile } from "../../utilities/supabase";
import { useMessageStore } from "../../zustand/messageStore/useMessageStore";

interface messageInputProps {
  conversation: conversationMessage;
}

export const MessageInput = ({ conversation }: messageInputProps) => {
  // const fileInputRef = useRef(null);
  const [files, setFiles] = useState<File[]>([]);
  const userId = useAuthStore((state) => state.authUser?.id);
  const profilepic = useAuthStore((state) => state.authUser?.profilepic);
  const username = useAuthStore((state) => state.authUser?.username);
  const Attatchement = () => {
    return (
      <FileButton
        onChange={setFiles}
        accept="image/png, image/jpeg, application/pdf, .doc, .docx"
        multiple
      >
        {(props) => (
          <ActionIcon {...props} aria-label="Upload file" variant="outline">
            <IconPaperclip />
          </ActionIcon>
        )}
      </FileButton>
    );
  };

  const handleRemove = (file: File) => {
    if (!files) return;
    setFiles((prev) => prev?.filter((f) => f !== file));
  };

  const { addMessage } = useMessageStore();

  const [message, setMessage] = useState("");

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const attachments = await buildAttahments();
    if ((!message && !attachments) || !conversation) return;
    if (!userId) return;
    const userMessage = {
      id: crypto.randomUUID(),
      conversationId: conversation.id,
      senderId: userId,
      content: message ?? "",
      messageType: "user",
      attachments,
      users: {
        id: userId,
        profilepic: profilepic ?? null,
        username: username ?? "",
      },
    };
    setMessage("");
    setFiles([]);
    addMessage(userMessage);
    sendTyping(false, conversation.id, userId);
    handleSubmit(userMessage, conversation.id);
  };
  const { handleSubmit, sendTyping } = useMessage();
  const buildAttahments = async () => {
    return Promise.all(
      files.map(async (file) => {
        const url = getSupabasePath(await uploadFile(file));
        return {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          fileUrl: url,
        };
      }),
    );
  };
  const typingRef = useRef(false);
  const stopTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!message) {
      return;
    }

    // 1. send typing start immediately (only once)
    if (!typingRef.current) {
      sendTyping(true, conversation.id, userId);
      typingRef.current = true;
    }

    // 2. reset stop timer on every keystroke
    if (stopTimeout.current) {
      clearTimeout(stopTimeout.current);
    }

    // 3. debounce stop typing
    stopTimeout.current = setTimeout(() => {
      sendTyping(false, conversation.id, userId);
      typingRef.current = false;
    }, 1500); // 1–2s is standard
  }, [message]);
  useEffect(() => {
    return () => {
      if (stopTimeout.current) {
        clearTimeout(stopTimeout.current);
      }

      sendTyping(false, conversation.id, userId);
      typingRef.current = false;
    };
  }, []);

  const SendButton = () => {
    return (
      <ActionIcon type="submit">
        <IconSend />
      </ActionIcon>
    );
  };
  return (
    <>
      <Form method="POST" onSubmit={(e) => sendMessage(e)}>
        <Pill.Group>
          {files?.map((file) => (
            <Pill
              key={`${file.name}-${file.size}`}
              withRemoveButton
              onRemove={() => handleRemove(file)}
            >
              {file.name}
            </Pill>
          ))}
        </Pill.Group>
        <TextInput
          placeholder="Type your message here..."
          name="message"
          leftSection={<Attatchement />}
          radius={"md"}
          rightSection={<SendButton />}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></TextInput>
      </Form>
    </>
  );
};
