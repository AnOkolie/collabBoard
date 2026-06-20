import { ActionFunctionArgs } from "react-router-dom";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { sendFriendRequest } from "../../api/user";
import { useSocket } from "../../context/SocketContext";
import { useFriendSocket } from "../../hooks/useFriendSocket";

export const searchAction = async ({ request }: ActionFunctionArgs) => {
  const { sendFriendRequest: websocketFriendRequest } = useFriendSocket();
  const formdata = await request.formData();
  const friendId = formdata.get("friend-user-id")?.toString();
  const currUser = useAuthStore.getState().authUser;
  if (!currUser) {
    return { error: "Unable to add friend" };
  }
  const currUserId = currUser.id;
  if (!currUserId || !friendId) {
    return { error: "Unable to add friend" };
  }

  websocketFriendRequest(friendId);

  const result = await sendFriendRequest(currUserId, friendId);
  return result.data;
};
