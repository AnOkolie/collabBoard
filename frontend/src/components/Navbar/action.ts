import { logout } from "../../api/auth";
import { redirect } from "react-router-dom";

export const navbarAction = async () => {
  const res = await logout();
  return redirect("/login");
};
