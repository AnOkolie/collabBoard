import { allFriends } from "../types/friends";
import { RequestMethods, RequestResolve } from "../types/requests";
import { request } from "../utilities/requests";

export const getAllFriends = async (
  userId: string,
): Promise<RequestResolve<allFriends[]>> =>
  await request(RequestMethods.GET, `friends/${userId}`);
