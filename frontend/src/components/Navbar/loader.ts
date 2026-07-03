import { redirect } from "react-router-dom";
import { checkAuthOnLoad } from "../../api/auth";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { userObject } from "../../types/user";
import { ActivityData } from "../../types/activity";
import { fetchActivityInvites } from "../../api/activityCenter";
import { useActivityCentreStore } from "../../zustand/activityCentreStore/useActivityCentreStore";
type combinedLoader = {
  user: userObject;
  notifications: ActivityData;
};
export const authLoader = async () => {
  const { token, setAuthUser, setCheckingAuth } = useAuthStore.getState();
  const { setBoardActivity, setFriendActivity } =
    useActivityCentreStore.getState();
  try {
    const userId = useAuthStore.getState().authUser?.id;
    if (!token) throw new Error("Missing token");
    if (!userId) throw new Error("missing id");

    const [userResponse, activities] = await Promise.all([
      checkAuthOnLoad(token),
      fetchActivityInvites(userId),
    ]);
    const user = userResponse.data?.user;
    const activity = activities.data;

    setAuthUser(user ?? null);
    setCheckingAuth(false);
    setBoardActivity(activity?.boardInvites ?? []);
    setFriendActivity(activity?.friendRequests ?? []);

    if (!user) {
      throw redirect("/login");
    }

    return {
      user,
      notifications: activities,
    };
  } catch {
    setAuthUser(null);
    setCheckingAuth(false);
    throw redirect("/login");
  }
};
