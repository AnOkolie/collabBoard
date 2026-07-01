import { ActionFunctionArgs } from "react-router-dom";
import { login } from "../../api/login";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";

export const loginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  if (!formData) return { error: "Form Data error", status: 500 };
  const email = (formData.get("email") as string) ?? null;
  const password = formData.get("password") as string;
  const username = (formData.get("username") as string) ?? null;
  const { setToken, setAuthUser, authUser } = useAuthStore.getState();
  if ((!email && !username) || !password) {
    return { error: "Please fill in all fields" };
  }
  const response = await login(password, email, username);
  if (response.error && !response.data) {
    return {
      error: response.error.message || "Login failed",
      status: response.error.status,
    };
  }
  if (response.data) {
    const userData = response.data.user;
    try {
      setAuthUser({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        profilepic: userData.profilepic,
      });

      if (response.data.token) {
        const token = response.data.token;
        setToken(token);
      }
    } catch (err) {
      console.error("error updating user zustand", err);
    }

    return response;
  }
};
