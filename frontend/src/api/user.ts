import { findUserResponse } from "~/types/user";
import { RequestMethods, RequestResolve } from "../types/requests";
import { request } from "../utilities/requests";

export const updateUser = async (
  userId: string,
  data: {
    username?: string;
    email?: string;
    password?: string;
    profilepic?: ArrayBuffer;
  },
) =>
  await request(
    RequestMethods.PATCH,
    `users/${userId}`,
    undefined,
    JSON.stringify(data),
  );

export const deleteUser = async (userId: string) =>
  await request(RequestMethods.DELETE, `users/${userId}`);

export const searchUser = async (
  username: string,
  userId: string,
): Promise<RequestResolve<findUserResponse>> =>
  await request(
    RequestMethods.GET,
    `user/${userId}/search?username=${username}`,
  );

export const sendFriendRequest = async (user_id: string, friend_id: string) =>
  await request(
    RequestMethods.POST,
    "user/add-friend",
    undefined,
    JSON.stringify({ user_id: user_id, friend_id: friend_id }),
  );
