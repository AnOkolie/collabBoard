import { RequestMethods, RequestResolve } from "../types/requests";
import { request } from "../utilities/requests";
import { GetBoardInvites } from "../types/boards";

export const fetchActivityInvites = async (
  user_id: string,
): Promise<RequestResolve<GetBoardInvites>> =>
  await request(RequestMethods.GET, `activity-center/${user_id}`);
