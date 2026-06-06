import { ActionFunctionArgs } from "react-router-dom";
import { searchUser } from "../../api/user";

export const searchLoader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  if (!username) {
    return;
  }
  const result = await searchUser(username);
  return result.data;
};
