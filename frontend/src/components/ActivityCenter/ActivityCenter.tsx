import { Drawer, Button, Indicator } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useActivityHook } from "../../hooks/useActivityNotifications";
import { FriendRequests } from "./FriendRequests";
import { BoardInvites } from "./BoardInvites";
import { useActivityCentreStore } from "../../zustand/activityCentreStore/useActivityCentreStore";
import { useState, useEffect } from "react";
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
  useActivityHook();
  const {
    friendActivity,
    boardActivity,
    removeBoardActivity,
    removeFriendActivity,
  } = useActivityCentreStore();

  const [notifLength, setNotifLength] = useState(0);

  useEffect(() => {
    setNotifLength((boardActivity.length ?? 0) + (friendActivity.length ?? 0));
  }, [notifLength, setNotifLength, boardActivity, friendActivity]);

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
          friendRequests={friendActivity}
          removeFriendRequest={removeFriendActivity}
        />
        <BoardInvites
          boardInvites={boardActivity}
          removeBoardInvite={removeBoardActivity}
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
