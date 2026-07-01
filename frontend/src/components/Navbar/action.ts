import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { logout } from "../../api/logout";
import { redirect } from "react-router-dom";

export const logoutAction = async () => {
  const res = await logout();
  if (res.error) return;
  const { deleteToken } = useAuthStore.getState();
  useAuthStore.setState({
    authUser: null,
    isCheckingAuth: false,
  });
  deleteToken();
  return redirect("/login");
};
