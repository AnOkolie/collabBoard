import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Avatar,
  Burger,
  Flex,
  TextInput,
  Text,
  NavLink,
  ActionIcon,
  Badge,
  Drawer,
  Button,
  Tooltip,
} from "@mantine/core";
import { Form, href, Outlet } from "react-router-dom";
import {
  IconSearch,
  IconUsers,
  IconCalendar,
  IconUser,
  IconMenu2,
  IconHome,
  IconMessage,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { SocketStatusBadge } from "./StatusBar";
import { ActivityCenter } from "../ActivityCenter/ActivityCenter";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const authUser = useAuthStore((s) => s.authUser);
  const navigate = useNavigate();
  const { profilepic, username } = authUser || {};
  const [opened, { toggle }] = useDisclosure();
  const [notifDrawerOpened, notifDrawerHandler] = useDisclosure();
  const [preview, setPreview] = useState<string | null>(profilepic || null);
  const { deleteToken } = useAuthStore();

  return (
    <>
      <AppShell
        padding="lg"
        header={{ height: 60 }}
        navbar={{
          width: opened ? 240 : 72,
          breakpoint: "sm",
          collapsed: { mobile: !opened, desktop: false },
        }}
      >
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

          <Flex direction="row" align="center">
            <Flex justify="flex-start" style={{ flex: 1 }} p="md">
              <TextInput
                type="search"
                leftSection={<IconSearch size={16} />}
                placeholder="Search"
                radius="lg"
              />
            </Flex>

            <Flex direction="row" gap="md" align="center">
              <ActivityCenter
                notifDrawerHandler={notifDrawerHandler}
                notifDrawerOpened={notifDrawerOpened}
              />
              <ActionIcon
                variant="transparent"
                onClick={() => navigate("/calendar")}
              >
                <IconCalendar />
              </ActionIcon>

              <Avatar
                component="button"
                onClick={(e) => navigate("/profile")}
                src={preview || "./avatar.png"}
                radius={"xl"}
              />

              <Text m={"md"}>{username}</Text>
            </Flex>
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar>
          <AppShell.Section>
            <ActionIcon
              onClick={toggle}
              variant="subtle"
              color="dark"
              radius="md"
              size="lg"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              mb={"md"}
              ml={"sm"}
            >
              <IconMenu2 size={22} stroke={2} />
            </ActionIcon>

            <NavLink
              label={opened ? "Home" : ""}
              leftSection={<IconHome size={30} />}
              href="/"
            />

            <NavLink
              label={opened ? "Profile" : ""}
              leftSection={<IconUser size={30} />}
              href="/profile"
            />

            <NavLink
              label={opened ? "Search Users" : ""}
              leftSection={<IconSearch size={30} />}
              href="/search"
            />

            <NavLink
              label={opened ? "Friends" : ""}
              leftSection={<IconUsers size={30} />}
              href="/friends"
            />
            <NavLink
              label={opened ? "Messages" : ""}
              leftSection={<IconMessage size={30} />}
              href="/messages"
            />

            <NavLink
              label={opened ? "Settings" : ""}
              leftSection={<IconSettings size={30} />}
            />

            <Form method="post" action="/logout">
              <Button
                type="submit"
                variant="subtle"
                leftSection={<IconLogout size={30} />}
                fullWidth
                justify="flex-start"
              >
                {opened && "Logout"}
              </Button>
            </Form>
            <SocketStatusBadge />
          </AppShell.Section>
        </AppShell.Navbar>

        {/* THIS IS THE IMPORTANT PART */}
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </>
  );
}
