import { LoaderFunctionArgs } from "react-router-dom";
import { fetchActivityInvites } from "../../api/activityCenter";

export const activityCenterLoader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;
  if (!id) return;
  const result = await fetchActivityInvites(id);
  return result.data;
};
