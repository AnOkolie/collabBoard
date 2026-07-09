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
import { SocketProvider } from "../context/SocketContext";
import { useBoardStore } from "../zustand/useBoardStore/useBoardStore";

export const useSocketEvents = (
  lastJsonMessage: IncomingBoardEvent | null,
  sendJsonMessage: (msg: any) => void,
) => {
  const { addMessage, setIsTyping, removeTypinguser, addTypingUser } =
    useMessageStore();
  const requestUserId = useRef<string | null>(null);
  const requestBoardId = useRef<string | null>(null);
  const { setBoardActivity, setFriendActivity } = useActivityCentreStore();
  const addBoardActivity = useActivityCentreStore((s) => s.addBoardActivity);
  const addFriendActivity = useActivityCentreStore((s) => s.addFriendActivity);
  const addUserBoard = useBoardStore((s) => s.addUserBoard);

  const removeUserBoard = useBoardStore((s) => s.removeUserBoard);

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
      case "friend:request-received": {
        const { user_id } = lastJsonMessage.payload;
        addFriendActivity(lastJsonMessage.payload);

        displayNotifications(
          "Friend Request",
          <SocketProvider>
            <FriendNotification id={user_id} />
          </SocketProvider>,
          "green",
        );

        break;
      }

      case "friend:request-accepted":
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
        const newBoard = lastJsonMessage.payload;

        addUserBoard(newBoard);
        displayNotifications("Accepted", lastJsonMessage.message, "green");
        break;

      case "boards:error":
        displayNotifications(
          "Board Invitation",
          lastJsonMessage.message,
          "red",
        );
        break;
      case "board:deleted":
        const deletedBoard = lastJsonMessage.payload;

        removeUserBoard(deletedBoard);
        break;

      case "board:updated":
        const updatedBoard = lastJsonMessage.payload;
        removeUserBoard(updatedBoard);
        addUserBoard(updatedBoard);
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
