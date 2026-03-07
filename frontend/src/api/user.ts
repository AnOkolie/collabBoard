import { RequestMethods } from "../types/requests";
import { request } from "../utilities/requests";

export const updateUser = async (
  userId: string,
  data: { username?: string; email?: string; password?: string },
) =>
  await request(
    RequestMethods.PATCH,
    `users/${userId}`,
    undefined,
    JSON.stringify(data),
  );

export const deleteUser = async (userId: string) =>
  await request(RequestMethods.DELETE, `users/${userId}`);
