import { checkAuthResponse, logoutResponse } from "../types/auth";
import { RequestMethods, RequestResolve } from "../types/requests";
import { userObject } from "../types/user";
import { request } from "../utilities/requests";

export const checkAuth = async (
  user: userObject,
): Promise<RequestResolve<checkAuthResponse>> =>
  await request(
    RequestMethods.GET,
    "auth/check",
    undefined,
    JSON.stringify({ user: user }),
  );

export const checkAuthOnLoad = async (): Promise<
  RequestResolve<checkAuthResponse>
> => await request(RequestMethods.GET, "auth/check-auth");

export const logout = async (): Promise<RequestResolve<logoutResponse>> =>
  await request(RequestMethods.POST, "auth/logout");
