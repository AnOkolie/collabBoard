import { Button, Menu, Flex } from "@mantine/core";
import { IconUserMinus, IconUserPlus } from "@tabler/icons-react";
import { findUserBody } from "../../types/user";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useSocket } from "../../context/SocketContext";
import { useEffect } from "react";
import { displayNotifications } from "../../utilities/notification/displayNotifications";
import { useFetcher, useNavigate } from "react-router-dom";
import { getOrCreateDirectConversation } from "../../services/getOrCreateConversation";
import { useFriendSocket } from "../../hooks/useFriendSocket";

type Props = {
  user: findUserBody;
  onSendRequest: (id: string) => void;
  size?: number;
  search?: string;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  conversationId?: string;
};

export const UserSearchButton = ({
  user,
  onSendRequest,
  size = 18,
  search = "",
  setSearch = () => {},
  conversationId = "",
}: Props) => {
  const userId = useAuthStore.getState().authUser?.id;
  const { sendJsonMessage, lastJsonMessage } = useSocket();
  const { respondToFriendRequest } = useFriendSocket();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const handleClick = (
    messageType: string,
    response?: "accepted" | "decline",
  ) => {
    if (!userId) return;
    switch (messageType) {
      case "response":
        if (!response) return;
        respondToFriendRequest(user.sender, response);
        setSearch(search);
        break;
      case "unsend":
        sendJsonMessage({
          type: `friend:request-${messageType}`,
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
    navigate(`/messages/${userId}/${conversationId}`);
  };
  useEffect(() => {
    if (!lastJsonMessage) return;
    const { type } = lastJsonMessage;
    switch (type) {
      case "friend:request-removed": {
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
            <Flex justify="flex-end" gap={"sm"}>
              <Button
                variant="outline"
                c={"green"}
                onClick={() => handleClick("response", "accepted")}
              >
                <IconUserPlus size={size} />
              </Button>
              <Button
                variant="outline"
                c={"red"}
                onClick={() => handleClick("response", "decline")}
              >
                <IconUserMinus size={size} />
              </Button>
            </Flex>
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
          <IconUserPlus size={size} />
        </Button>
      );
  }
};
