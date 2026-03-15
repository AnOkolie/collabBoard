import { useDisclosure } from "@mantine/hooks";
import {
  AppShell,
  Burger,
  Flex,
  TextInput,
  Text,
  NavLink,
  ActionIcon,
  Badge,
  Drawer,
  Button,
} from "@mantine/core";
import { Form, Outlet } from "react-router-dom";
import {
  IconSearch,
  IconBell,
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

export function Navbar() {
  const [opened, { toggle }] = useDisclosure();
  const [notifDrawerOpened, notifDrawerHandler] = useDisclosure();
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
              <IconCalendar />
              <IconUser />
              <Text>{useAuthStore.getState().authUser?.username}</Text>
            </Flex>
          </Flex>
        </AppShell.Header>

        <AppShell.Navbar>
          <AppShell.Section>
            <Flex
              justify={opened ? "flex-start" : "flex-start"}
              align="center"
              px={opened ? "md" : 0}
              mb="md"
            >
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
              >
                <IconMenu2 size={22} stroke={2} />
              </ActionIcon>
            </Flex>

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
              label={opened ? "Messages" : ""}
              leftSection={<IconMessage size={30} />}
              href="/messages"
            />

            <NavLink
              label={opened ? "Settings" : ""}
              leftSection={<IconSettings size={30} />}
            />

            <Form method="post">
              <NavLink
                label={opened ? "Logout" : ""}
                leftSection={<IconLogout size={30} />}
                href="logout"
              />
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
