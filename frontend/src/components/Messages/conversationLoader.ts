import { LoaderFunctionArgs } from "react-router-dom";
import { getConversations } from "../../api/messages";

import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { UserConversation } from "../../types/messages";
type loader = {
  data: {
    conversations: UserConversation[];
  };
  error: boolean;
};

export const conversationLoader = async ({
  params,
}: LoaderFunctionArgs): Promise<loader> => {
  const id = useAuthStore.getState().authUser?.id;
  const convoId = params.conversationId;

  try {
    if (!id) throw new Error("No id given");
    const userConversations = await getConversations(id);

    console.log("user convos", userConversations);
    return {
      data: {
        conversations: userConversations.data ?? [],
      },
      error: !!userConversations.error,
    };
  } catch (err) {
    console.error("Error retrieving conversations", err);
    return {
      data: {
        conversations: [],
      },
      error: true,
    };
  }
};
