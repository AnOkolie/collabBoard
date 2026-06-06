import { LoaderFunctionArgs } from "react-router-dom";
import { fetchBoardInvites } from "../../api/activityCenter";

export const activityCenterLoader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  if (!id) return;
  const result = await fetchBoardInvites(id);
  return result.data;
};
