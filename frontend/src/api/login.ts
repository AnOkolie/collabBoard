import { request } from "../utilities/requests";
import { RequestMethods, RequestResolve } from "../types/requests";
import { LoginResponse } from "../types/auth";

export const login = async (
  password: string,
  email?: string,
  username?: string,
): Promise<RequestResolve<LoginResponse>> =>
  await request(
    RequestMethods.POST,
    "auth/login",
    undefined,
    JSON.stringify({ email, username, password }),
  );
