// useFriendRequestNotifications.ts
import { useEffect } from "react";
import { Button, Group } from "@mantine/core";
import { displayNotifications } from "../utilities/displayNotifications";
import { IncomingBoardEvent } from "../types/socket/incomingMessages";
import { useFriendSocket } from "./useFriendSocket";

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
              onClick={() => respondToFriendRequest(user_id, "declined")}
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

      case "error":
        displayNotifications("Friend Request", message.message, "red");
        break;
    }
  }, [message, respondToFriendRequest]);
};
