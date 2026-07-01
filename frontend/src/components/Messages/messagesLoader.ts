import { LoaderFunctionArgs } from "react-router-dom";
import {
  getConversations,
  getDirectConversation,
  getMessagesByConversation,
} from "../../api/messages";

import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { conversationMessage } from "../../types/messages";

type loader = {
  data: {
    messages: conversationMessage | [];
  };
  error: boolean;
};

export const messagesLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<loader> => {
  const id = useAuthStore.getState().authUser?.id;
  const convoId = params.conversationId;

  try {
    if (!id || !convoId) throw new Error("No id given");
    const conversationMessages = await getMessagesByConversation(convoId, id);
    return {
      data: {
        messages: conversationMessages.data ?? [],
      },
      error: !!conversationMessages.error,
    };
  } catch (err) {
    console.error("Error retrieving conversations", err);
    return {
      data: {
        messages: [],
      },
      error: true,
    };
  }
};
