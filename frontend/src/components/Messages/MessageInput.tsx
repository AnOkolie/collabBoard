import { ActionIcon, FileButton, Pill, TextInput, Flex } from "@mantine/core";
import { IconPaperclip, IconSend } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { Form } from "react-router-dom";
import { useConversation } from "../../hooks/useConversation";
import { messageBody, UserConversation } from "../../types/messages";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";

interface messageInputProps {
  conversation: UserConversation;
}

export const MessageInput = ({ conversation }: messageInputProps) => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState<File[] | null>(null);
  const { sendMessage: sendUserMessage } = useConversation();
  const userId = useAuthStore((state) => state.authUser?.id);
  const Attatchement = () => {
    return (
      <FileButton
        onChange={setFiles}
        accept="image/png, image/jpeg, application/pdf"
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
  const getFiles = () => {
    const newFiles = files?.map((file) => {
      return {
        fileName: file.name,
        fileSize: file.size,
      };
    });
    return newFiles;
  };
  const [message, setMessage] = useState("");
  const sendMessage = (e: React.SubmitEvent<HTMLFormElement>) => {
    console.log("tried to submit");
    e.preventDefault();
    if (!message) {
      console.log("message field was blank");
    } else {
      if (!userId) return;
      const userMessage = {
        conversationId: conversation.id,
        senderId: userId,
        content: message ?? "",
        messageType: ["text", "files"],
        attachments: getFiles() ?? [],
      };
      sendUserMessage(userMessage, conversation.id);
    }
  };

  const SendButton = () => {
    return (
      <ActionIcon>
        <IconSend />
      </ActionIcon>
    );
  };
  return (
    <>
      <Form onSubmit={() => sendMessage}>
        <Pill.Group>
          {files?.map((file) => (
            <Pill key={`${file.name}-${file.size}`} withRemoveButton>
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
          onChange={(e) => setMessage(e.target.value)}
        ></TextInput>
      </Form>
    </>
  );
};
