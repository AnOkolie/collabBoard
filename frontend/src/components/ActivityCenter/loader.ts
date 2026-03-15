import { LoaderFunctionArgs } from "react-router-dom";
import { fetchBoardInvites } from "../../api/activityCenter";

export const activityCenterLoader = async ({ params }: LoaderFunctionArgs) => {
  console.log("activity center loader loading...");
  const { id } = params;
  console.log("id is", id);
  if (!id) return;
  const result = await fetchBoardInvites(id);
  console.log("loaderData action data is", result.data);
  return result.data;
};
