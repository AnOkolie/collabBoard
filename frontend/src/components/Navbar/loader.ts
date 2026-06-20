import { redirect } from "react-router-dom";
import { checkAuthOnLoad } from "../../api/auth";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";

export const authLoader = async () => {
  try {
    const res = await checkAuthOnLoad();
    const user = res?.data?.user;

    useAuthStore.setState({
      authUser: user ?? null,
      isCheckingAuth: false,
    });

    if (!user) {
      throw redirect("/login");
    }

    return user;
  } catch {
    useAuthStore.setState({
      authUser: null,
      isCheckingAuth: false,
    });

    throw redirect("/login");
  }
};
