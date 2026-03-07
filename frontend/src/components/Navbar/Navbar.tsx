import {
  ActionIcon,
  AppShell,
  Burger,
  Center,
  Flex,
  NavLink,
  TextInput,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconHome,
  IconMenu2,
  IconMessage,
  IconSettings,
  IconUser,
  IconSearch,
  IconBell,
  IconCalendar,
  IconLogout,
} from "@tabler/icons-react";
import { Form } from "react-router-dom";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export const Navbar = () => {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      padding="md"
      color="purple"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: false },
      }}
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Flex direction={"row"} align={"center"}>
          <Flex
            justify={"flex-start"}
            style={{ flex: 1 }}
            p={"md"}
            align={Center}
          >
            <TextInput
              type="search"
              leftSection={<IconSearch size={16} />}
              placeholder="Search"
              radius={"lg"}
            />
          </Flex>
          <Flex direction={"row"} gap={"md"} align={Center}>
            <IconBell />
            <IconCalendar />
            <hr />
            <IconUser />
            <Text>John Doe</Text>
          </Flex>
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar py={"sm"} w={{ base: opened ? 240 : 60 }}>
        <AppShell.Section>
          <ActionIcon onClick={toggle} variant="transparent" color="black">
            <IconMenu2 size={30} />
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
        </AppShell.Section>
      </AppShell.Navbar>
    </AppShell>
  );
};
