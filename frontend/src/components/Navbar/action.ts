import { logout } from "../../api/auth";

export const navbarAction = async () => {
  const res = await logout();
  return res;
};
