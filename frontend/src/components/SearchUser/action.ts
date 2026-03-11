import { ActionFunctionArgs } from "react-router-dom";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { sendFriendRequest } from "../../api/user";
import { useBoardSocket } from "../../context/BoardSocketContext";

export const searchAction = async ({ request }: ActionFunctionArgs) => {
  const { sendJsonMessage, lastJsonMessage, isConnected } = useBoardSocket();
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

  if (!isConnected) return;

  sendJsonMessage({
    type: "friend-request",
    user_id: currUserId,
    friend_id: friendId,
    message: "Lets be friends please",
  });
  const result = await sendFriendRequest(currUserId, friendId);
  return result.data;
};
