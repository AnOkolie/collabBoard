import { redirect } from "react-router-dom";
import type { LoaderFunctionArgs } from "react-router-dom";
import { findUserProfile } from "../../../api/user";
import { useAuthStore } from "../../../zustand/authStore/useAuthStore";

export const friendProfileLoader = async ({
  request,
  params,
}: LoaderFunctionArgs) => {
  const { id } = params;
  const userId = useAuthStore.getState().authUser?.id;
  if (!id || !userId) return;
  const result = await findUserProfile(userId, id);
  return result.data;
};
