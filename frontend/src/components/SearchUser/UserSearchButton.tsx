import { Button, Menu, Flex } from "@mantine/core";
import { IconUserMinus, IconUserPlus } from "@tabler/icons-react";
import { findUserBody } from "../../types/user";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useSocket } from "../../context/SocketContext";
import { useEffect } from "react";
import { displayNotifications } from "../../utilities/displayNotifications";
import { useFetcher, useNavigate } from "react-router-dom";
import { getOrCreateDirectConversation } from "../../services/getOrCreateConversation";
type Props = {
  user: findUserBody;
  onSendRequest: (id: string) => void;
};

export const UserSearchButton = ({ user, onSendRequest }: Props) => {
  const userId = useAuthStore.getState().authUser?.id;
  const { sendJsonMessage, lastJsonMessage } = useSocket();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const handleClick = (messageType: string, response?: string) => {
    if (!userId) return;
    switch (messageType) {
      case "response":
        if (!response) return;
        sendJsonMessage({
          type: `friend-request:${messageType}`,
          user_id: userId,
          friend_id: user.id,
          response,
        });
        break;
      case "unsend":
        sendJsonMessage({
          type: `friend-request:${messageType}`,
          user_id: userId,
          friend_id: user.id,
        });
        break;
    }
  };

  const navigateToConversation = async (friendId: string) => {
    if (!userId) return;
    const data = await getOrCreateDirectConversation(userId, friendId);
    if (!data) return;
    navigate(`/messages/${userId}/${data.conversation.id}`);
  };
  useEffect(() => {
    if (!lastJsonMessage) return;
    const { type } = lastJsonMessage;
    switch (type) {
      case "friend-request:removed": {
        const { message } = lastJsonMessage;
        displayNotifications("Friend Request", message, "green");
      }
    }
  }, [lastJsonMessage]);
  switch (user.friendshipStatus) {
    case "pending":
      if (userId === user.sender) {
        return (
          <>
            <Menu>
              <Menu.Target>
                <Button>Requested</Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item>
                  <Button
                    c={"red"}
                    variant="outline"
                    onClick={() => handleClick("unsend")}
                  >
                    Unfollow
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button c={"black"} variant="outline">
                    Close
                  </Button>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </>
        );
      } else {
        return (
          <>
            <Button
              variant="outline"
              c={"green"}
              onClick={() => handleClick("accepted")}
            >
              <IconUserPlus />
            </Button>
            <Button
              variant="outline"
              c={"red"}
              onClick={() => handleClick("decline")}
            >
              <IconUserMinus />
            </Button>
          </>
        );
      }

    case "friends":
      {
        fetcher.state === "loading" && <p>Loading...</p>;
      }
      return (
        <Button
          variant="outline"
          onClick={() => navigateToConversation(user.id)}
        >
          Message
        </Button>
      );

    default:
      return (
        <Button variant="outline" onClick={() => onSendRequest(user.id)}>
          <IconUserPlus size={18} />
        </Button>
      );
  }
};
