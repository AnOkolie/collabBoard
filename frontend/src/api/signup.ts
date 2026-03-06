import { request } from "../utilities/requests";
import { RequestMethods, RequestResolve } from "../types/requests";
import { LoginResponse } from "../types/auth";

export const signup = async (
  email: string,
  password: string,
  username: string,
): Promise<RequestResolve<LoginResponse>> =>
  await request(
    RequestMethods.POST,
    "auth/signup",
    undefined,
    JSON.stringify({ email, password, username }),
  );
