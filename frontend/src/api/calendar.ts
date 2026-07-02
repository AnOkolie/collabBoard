import { eventsResponse } from "../types/calendar";
import { RequestMethods, RequestResolve } from "../types/requests";
import { request } from "../utilities/requests";

export const getTaskDetails = async (
  userId: string,
): Promise<RequestResolve<eventsResponse>> =>
  await request(RequestMethods.GET, `events/${userId}`);
