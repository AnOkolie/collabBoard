import { RequestMethods, RequestResolve } from "../types/requests";
import { request } from "../utilities/requests";

export const logout = async (): Promise<RequestResolve<string>> =>
  await request(RequestMethods.POST, "auth/logout");
