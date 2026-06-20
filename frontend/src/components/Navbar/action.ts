import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { logout } from "../../api/auth";
import { redirect } from "react-router-dom";

export const navbarAction = async () => {
  const res = await logout();
  useAuthStore.setState({
    authUser: null,
    isCheckingAuth: false,
  });
  return redirect("/login");
};
