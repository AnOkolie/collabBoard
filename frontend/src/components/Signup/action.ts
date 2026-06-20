import { request } from "../../utilities/requests";
import { RequestMethods } from "../../types/requests";
import { ActionFunctionArgs } from "react-router-dom";
import { signup } from "../../api/signup";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";

export const signupAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (!formData) return { error: "Form Data error", status: 500 };
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  if (!email || !password || !name) {
    return { error: "Please fill in all fields" };
  }

  const response = await signup(
    formData.get("email") as string,
    formData.get("password") as string,
    formData.get("name") as string,
  );
  if (response.error && !response.data) {
    return {
      error: response.error.message || "Signup failed",
      status: response.error.status,
    };
  }
  if (response.data) {
    const userData = await response.data.user;
    const token = await response.data.token;
    useAuthStore.getState().setAuthUser({
      id: userData.id,
      email: userData.email,
      username: userData.username,
      profilepic: userData.profilepic,
    });
    if (token) {
      localStorage.setItem("token", token);
    }
    return response;
  }
};
