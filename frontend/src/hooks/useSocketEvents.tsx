import { useMessageStore } from "../zustand/messageStore/useMessageStore";
import { useCallback, useEffect, useRef } from "react";
import { displayNotifications } from "../utilities/notification/displayNotifications";
import {
  FriendNotification,
  BoardNotification,
  MessageNotification,
} from "../utilities/notification/Notifications";
import { useAuthStore } from "../zustand/authStore/useAuthStore";
import { IncomingBoardEvent } from "../types/socket/incomingMessages";
import { useActivityCentreStore } from "../zustand/activityCentreStore/useActivityCentreStore";
import { timeString } from "../utilities/format";

export const useSocketEvents = (
  lastJsonMessage: IncomingBoardEvent | null,
  sendJsonMessage: (msg: any) => void,
) => {
  // const { lastJsonMessage, sendJsonMessage } = useSocket();
  const { addMessage, setIsTyping, removeTypinguser, addTypingUser } =
    useMessageStore();
  const requestUserId = useRef<string | null>(null);
  const requestBoardId = useRef<string | null>(null);
  const {
    setBoardActivity,
    setFriendActivity,
    addBoardActivity,
    addFriendActivity,
  } = useActivityCentreStore();

  const { currentConversation } = useMessageStore();
  const currConvId = useMessageStore((s) => s.currentConversation);

  const handleClick = useCallback(
    (response: "accepted" | "declined") => {
      const myId = useAuthStore.getState().authUser?.id;

      if (!requestBoardId.current || !requestUserId.current || !myId) return;

      sendJsonMessage({
        type: "board-invitation-response",
        board_id: requestBoardId.current,
        user_id: myId,
        host_id: requestUserId.current,
        response,
      });
    },
    [sendJsonMessage, requestBoardId, requestUserId],
  );

  useEffect(() => {
    if (!lastJsonMessage) return;

    switch (lastJsonMessage.type) {
      case "message:received":
        if (currentConversation === lastJsonMessage.payload.conversationId) {
          addMessage(lastJsonMessage.payload);
        } else {
          displayNotifications(
            "New Message",
            <MessageNotification
              sender={lastJsonMessage.payload.sender.username}
              content={
                lastJsonMessage.payload.content ??
                "Open message to view attachments"
              }
              profilepic={lastJsonMessage.payload.sender.profilepic}
              createdAt={timeString(lastJsonMessage.payload.createdAt)}
            />,

            "blue",
          );
        }

        break;
      case "friend-request:received": {
        const { user_id } = lastJsonMessage.payload;
        addFriendActivity(lastJsonMessage.payload);

        displayNotifications(
          "Friend Request",
          <FriendNotification id={user_id} />,
          "green",
        );

        break;
      }

      case "friend-request:accepted":
        displayNotifications("Accepted", lastJsonMessage.message, "green");
        break;

      case "friends:error":
        displayNotifications("Friend Request", lastJsonMessage.message, "red");
        break;
      case "board-invite": {
        const { board_id, host_id } = lastJsonMessage.payload;
        if (!board_id || !host_id) return;

        requestBoardId.current = board_id;
        requestUserId.current = host_id;

        displayNotifications(
          "Board Invitation",
          <BoardNotification onClick={handleClick} />,
          "green",
        );
        addBoardActivity(lastJsonMessage.payload);
        break;
      }

      case "board:joined":
        displayNotifications("Accepted", lastJsonMessage.message, "green");
        break;

      case "boards:error":
        displayNotifications(
          "Board Invitation",
          lastJsonMessage.message,
          "red",
        );
        break;
      case "typing:start":
        if (currentConversation === lastJsonMessage.conversationId) {
          setIsTyping(true);
          addTypingUser(lastJsonMessage.users);
        }
        break;
      case "typing:stop":
        if (currentConversation === lastJsonMessage.conversationId) {
          setIsTyping(false);
          removeTypinguser(lastJsonMessage.users);
        }
        break;
      case "typing:error":
        break;
    }
  }, [lastJsonMessage, addMessage]);
};
