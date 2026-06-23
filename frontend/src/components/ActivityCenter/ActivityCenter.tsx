import { Drawer, Button, Indicator } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useActivityHook } from "../../hooks/useActivityNotifications";
import { FriendRequests } from "./FriendRequests";
import { BoardInvites } from "./BoardInvites";

type DisclosureHandlers = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

type ActivityCenterProps = {
  notifDrawerHandler: DisclosureHandlers;
  notifDrawerOpened: boolean;
};

export const ActivityCenter = ({
  notifDrawerHandler,
  notifDrawerOpened,
}: ActivityCenterProps) => {
  const { activityNotif, setActivityNotif } = useActivityHook();
  const notifLength =
    (activityNotif?.boardInvites?.length ?? 0) +
    (activityNotif?.friendRequests?.length ?? 0);

  return (
    <>
      <Drawer
        opened={notifDrawerOpened}
        onClose={notifDrawerHandler.close}
        title="Activity"
        position="right"
        radius="xl"
        overlayProps={{ backgroundOpacity: 0.3, blur: 2 }}
        size="md"
      >
        <FriendRequests
          friendRequests={activityNotif?.friendRequests ?? []}
          setActivityNotif={setActivityNotif}
        />
        <BoardInvites
          boardInvites={activityNotif?.boardInvites ?? []}
          setActivityNotif={setActivityNotif}
        />
      </Drawer>
      <Button
        variant="transparent"
        onClick={notifDrawerHandler.open}
        size="compact-lg"
      >
        <Indicator
          disabled={notifLength === 0}
          size={10}
          offset={5}
          inline
          processing
          color="red"
        >
          <IconBell />
        </Indicator>
      </Button>
    </>
  );
};
