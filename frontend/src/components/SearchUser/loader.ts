import { ActionFunctionArgs } from "react-router-dom";
import { searchUser } from "../../api/user";

export const searchLoader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  if (!username) {
    return;
  }
  console.log(username);
  const result = await searchUser(username);
  console.log(result);
  return result.data;
};
