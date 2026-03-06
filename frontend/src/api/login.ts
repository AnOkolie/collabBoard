import { request } from "../utilities/requests";
import { RequestMethods, RequestResolve } from "../types/requests";
import { LoginResponse } from "../types/auth";

export const login = async (
  email: string,
  password: string,
): Promise<RequestResolve<LoginResponse>> =>
  await request(
    RequestMethods.POST,
    "auth/login",
    undefined,
    JSON.stringify({ email, password }),
  );
