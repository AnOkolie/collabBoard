import { redirect } from "react-router-dom";
import { checkAuthOnLoad } from "../../api/auth";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";

export const authLoader = async () => {
  try {
    const res = await checkAuthOnLoad();

    if (!res?.data?.user) {
      useAuthStore.setState({
        authUser: null,
        isCheckingAuth: false,
      });
      throw redirect("/login");
    }

    useAuthStore.setState({
      authUser: res.data.user,
      isCheckingAuth: false,
    });

    return res.data.user;
  } catch (error) {
    useAuthStore.setState({
      authUser: null,
      isCheckingAuth: false,
    });

    throw redirect("/login");
  }
};
