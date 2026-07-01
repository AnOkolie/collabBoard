import { redirect } from "react-router-dom";
import { checkAuthOnLoad } from "../../api/auth";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";

export const authLoader = async () => {
  const { token, setAuthUser, setCheckingAuth } = useAuthStore.getState();

  try {
    if (!token) throw new Error("Missing token");

    const res = await checkAuthOnLoad(token);
    const user = res.data?.user;

    setAuthUser(user ?? null);
    setCheckingAuth(false);

    if (!user) {
      throw redirect("/login");
    }

    return user;
  } catch {
    setAuthUser(null);
    setCheckingAuth(false);
    throw redirect("/login");
  }
};
