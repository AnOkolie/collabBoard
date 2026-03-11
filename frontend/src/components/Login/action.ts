import { ActionFunctionArgs } from "react-router-dom";
import { login } from "../../api/login";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (!formData) return { error: "Form Data error", status: 500 };
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  if (!email || !password) {
    return { error: "Please fill in all fields" };
  }
  const response = await login(
    formData.get("email") as string,
    formData.get("password") as string,
  );
  console.log(response);
  if (response.error && !response.data) {
    return {
      error: response.error.message || "Login failed",
      status: response.error.status,
    };
  }
  if (response.data) {
    const userData = await response.data.user;
    useAuthStore.getState().setAuthUser({
      id: userData.id,
      email: userData.email,
      username: userData.username,
      createdAt: userData.createdAt,
      profilepic: userData.profilepic,
    });
    return response;
  }
};
