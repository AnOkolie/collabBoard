import { redirect } from "react-router-dom";
import { checkAuthOnLoad } from "../../api/auth";

export const loginLoader = async () => {
  const res = await checkAuthOnLoad();

  if (res?.data?.user) {
    throw redirect("/");
  }
  return res.data;
};
