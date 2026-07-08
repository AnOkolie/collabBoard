import { Drawer, Button, Indicator } from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useActivityHook } from "../../hooks/useActivityNotifications";
import { FriendRequests } from "./FriendRequests";
import { BoardInvites } from "./BoardInvites";
import { useActivityCentreStore } from "../../zustand/activityCentreStore/useActivityCentreStore";
import { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
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
  const loaderData = useLoaderData();
  const {
    notifLength,
    setNotifLength,
    friendActivity,
    boardActivity,
    removeBoardActivity,
    removeFriendActivity,
    setBoardActivity,
    setFriendActivity,
  } = useActivityCentreStore();

  useEffect(() => {
    if (!loaderData) return;
    setBoardActivity(loaderData.notifications.data.boardInvites ?? []);
    setFriendActivity(loaderData.notifications.data.friendRequests ?? []);
    setNotifLength((boardActivity.length ?? 0) + (friendActivity.length ?? 0));
  }, [loaderData, setBoardActivity, setFriendActivity]);

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
