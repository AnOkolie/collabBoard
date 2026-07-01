import { LoaderFunctionArgs } from "react-router-dom";
import { getGroupConversations } from "../../api/messages";

type loader = {
  data: {};
  error: boolean;
};

export const groupMessagesLoader = async ({ params }: LoaderFunctionArgs) => {
  const { boardId } = params;
  try {
    if (!boardId) throw new Error("Missing board id");

    const result = await getGroupConversations(boardId);
    if (result.error) {
      console.error("error loading in group conversations", result.error);
    }
    const response = {
      data: {
        messages: {
          data: result.data?.data,
        },
      },
    };
    return response;
  } catch (err) {
    console.error("Error retrieving conversations", err);
    return err;
  }
};
