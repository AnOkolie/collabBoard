import {
  ActionIcon,
  Affix,
  Box,
  Card,
  Grid,
  ScrollArea,
  Text,
  TextInput,
  GridCol,
  Avatar,
  Center,
  Flex,
  Stack,
  Paper,
  Group,
  Input,
  Loader,
  AppShell,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSearch,
  IconMessagePlus,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useState } from "react";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useSearchUser } from "../../hooks/useSearchUser";
import { SearchUserComponent } from "../../hooks/useSearchUser";
import {
  messageBody,
  messagesResponse,
  UserConversation,
} from "../../types/messages";
import { useFriendSocket } from "../../hooks/useFriendSocket";
import { UserSearchButton } from "../SearchUser/UserSearchButton";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { getMessages } from "../../services/getMessages";

type searchModalProps = {
  opened: boolean;
  setOpened: (boolean: boolean) => void;
};

const UserSearchModal = ({ opened, setOpened }: searchModalProps) => {
  const { searchName, setSearchName, usersByName, isLoading } =
    useSearchUser(800);
  const [friendId, setFriendId] = useState("");

  const currId = useAuthStore.getState().authUser!.id ?? null;

  const filteredNames = usersByName.filter((user) => user.id !== currId);
  const { sendFriendRequest } = useFriendSocket();
  return (
    <>
      <Grid>
        <GridCol span={{ base: 12, md: 1 }}>
          <ActionIcon
            onClick={() => setOpened(false)}
            variant="transparent"
            c={"black"}
            pt={"sm"}
          >
            <IconArrowLeft onClick={close} />
          </ActionIcon>
        </GridCol>
        <Grid.Col span={{ base: 12, md: 11 }}>
          <>
            <SearchUserComponent
              searchName={searchName}
              setSearchName={setSearchName}
            />

            {!searchName.trim() ? (
              <Center h="80vh">
                <Text c="gray" fw={800}>
                  Enter a username to search
                </Text>
              </Center>
            ) : (
              <Stack mt="md">
                {filteredNames.map((user) => (
                  <Paper key={user.id} p="sm" withBorder radius="md">
                    <Group>
                      <Input
                        type="hidden"
                        value={user.id}
                        name="friend-user-id"
                      />
                      <Avatar src={user.profilepic || undefined} />

                      <Text fw={600}>{user.username}</Text>

                      <Flex ml="auto" gap="md">
                        <UserSearchButton
                          user={user}
                          onSendRequest={() => sendFriendRequest(user.id)}
                        />
                      </Flex>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}
          </>
        </Grid.Col>
      </Grid>
      {isLoading && (
        <Center mt="md">
          <Loader size="sm" />
        </Center>
      )}
    </>
  );
};

export const ChannelList = () => {
  const [open, searchModalHandlers] = useDisclosure();
  const loaderData = useLoaderData();
  const userId = useAuthStore((set) => set.authUser?.id);
  const [isOpen, setIsOpen] = useState(false);
  const [channels, setChannels] = useState<UserConversation[]>(
    loaderData.data.conversations.data ?? [],
  );
  const [targetConversation, setTargetConversation] =
    useState<UserConversation>();
  const [message, setMessage] = useState<messagesResponse[]>([]);

  const handleClick = () => {
    setIsOpen(true);
    searchModalHandlers.open;
  };

  const navigate = useNavigate();
  // const navigateToChat = async (conv_id: string) => {
  //   if (!userId) return;
  //   const res = await getMessages(conv_id);
  //   if (!res) return;
  //   console.log("target", targetConversation);
  //   // setTargetConversation(channels.find((c) => c.id === conv_id));
  //   navigate(`${userId}/${conv_id}`);
  // };
  return (
    <AppShell padding={0}>
      <Flex h="100vh">
        {/* SIDEBAR */}
        <Box
          w={320}
          style={{
            borderRight: "1px solid var(--mantine-color-default-border)",
          }}
        >
          <Flex direction="column" h="100%">
            {/* SEARCH BAR */}
            <Box p="sm">
              <TextInput
                leftSection={<IconSearch size={16} />}
                placeholder="Search conversations..."
                radius="md"
              />
            </Box>

            {/* CHANNEL LIST */}
            <ScrollArea flex={1}>
              <Stack gap={2} p="xs">
                {channels.map((channel) => (
                  <Paper
                    key={channel.id}
                    onClick={() => {
                      setTargetConversation(channel);
                      navigate(`${userId}/${channel.id}`);
                    }}
                    px="sm"
                    py={10}
                    style={{
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                    className="channel-item"
                    bd="bottom 1px solid var(--mantine-color-gray-3)"
                  >
                    <Group gap="sm">
                      <Avatar
                        src={channel.displayPicture}
                        radius="xl"
                        size="sm"
                      />

                      <Text size="sm" fw={500}>
                        {channel.name ?? "Unknown"}
                      </Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </ScrollArea>

            {/* BOTTOM ACTION */}
            <Box p="sm">
              <ActionIcon variant="light" radius="xl" onClick={handleClick}>
                <IconMessagePlus size={18} />
              </ActionIcon>
            </Box>
          </Flex>
        </Box>

        {/* MAIN CONTENT */}

        <Outlet context={{ targetConversation, message }} />
      </Flex>
    </AppShell>
  );
};
