import { RequestMethods, RequestResolve } from "../types/requests";
import { request } from "../utilities/requests";
import { GetBoardInvites } from "../types/boards";
import { ActivityData } from "../types/activity";

export const fetchActivityInvites = async (
  user_id: string,
): Promise<RequestResolve<ActivityData>> =>
  await request(RequestMethods.GET, `activity-center/${user_id}`);
