import { ActionFunctionArgs } from "react-router-dom";
import { searchUser } from "../../api/user";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";

export const searchLoader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  const userId = useAuthStore.getState().authUser?.id;
  if (!username || !userId) {
    return;
  }
  const result = await searchUser(username, userId);
  return result.data;
};
