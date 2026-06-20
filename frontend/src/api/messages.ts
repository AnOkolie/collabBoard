import {
  conversationMessage,
  directConversation,
  messagesResponse,
  UserConversation,
} from "../types/messages";
import { RequestMethods, RequestResolve } from "../types/requests";
import { request } from "../utilities/requests";

export const getConversations = async (
  user_id: string,
): Promise<RequestResolve<UserConversation[]>> =>
  await request(RequestMethods.GET, `conversations/${user_id}`);

export const getMessagesByConversation = async (
  conversationId: string,
  userId: string,
): Promise<RequestResolve<conversationMessage>> =>
  await request(
    RequestMethods.GET,
    `messages/user/${userId}/conversation/${conversationId}`,
  );

export const getDirectConversation = async (
  userId: string,
  friendId: string,
): Promise<RequestResolve<directConversation>> =>
  await request(
    RequestMethods.GET,
    `conversations/direct/${userId}/search?friend_id=${friendId}`,
  );
