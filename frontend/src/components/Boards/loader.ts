import { getBoards } from "../../api/boardpage";

export const boardLoader = async () => {
  const res = await getBoards();
  if (res.data) {
    return { data: res.data };
  }
  return { error: true };
};
