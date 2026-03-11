import { redirect } from "react-router-dom";
import { checkAuthOnLoad } from "../../api/auth";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";

export const loginLoader = async () => {
  //   const res = await checkAuthOnLoad();
  //   if (res && res.data && res.data.user) {
  //     useAuthStore.getState().setAuthUser(res.data?.user);
  //   } else {
  //     useAuthStore.getState().setAuthUser(null);
  //   }
  //   if (res?.data?.user) {
  //     throw redirect("/");
  //   }
  //   return res.data;
};
