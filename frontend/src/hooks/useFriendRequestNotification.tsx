// useFriendRequestNotifications.ts
import { useEffect } from "react";
import { Button, Group } from "@mantine/core";
import { displayNotifications } from "../utilities/notification/displayNotifications";
import { IncomingBoardEvent } from "../types/socket/incomingMessages";
import { useFriendSocket } from "./useFriendSocket";

type prop = {
  onClickHandler: (response: string, id?: string) => void;
};
export const useFriendRequestNotifications = (
  message: IncomingBoardEvent | null,
) => {
  const { respondToFriendRequest } = useFriendSocket();

  useEffect(() => {
    if (!message) return;

    switch (message.type) {
      case "friend-request:received": {
        const { user_id } = message.payload;

        displayNotifications(
          "Friend Request",
          <Group mt="sm">
            <Button
              size="xs"
              onClick={() => respondToFriendRequest(user_id, "accepted")}
            >
              Accept
            </Button>

            <Button
              size="xs"
              variant="outline"
              onClick={() => respondToFriendRequest(user_id, "decline")}
            >
              Decline
            </Button>
          </Group>,
          "green",
        );

        break;
      }

      case "friend-request:accepted":
        displayNotifications("Accepted", message.message, "green");
        break;

      case "friends:error":
        displayNotifications("Friend Request", message.message, "red");
        break;
    }
  }, [message, respondToFriendRequest]);
};
