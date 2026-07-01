import {
  Text,
  PasswordInput,
  Button,
  TextInput,
  Loader,
  ThemeIcon,
  Divider,
  Title,
  Stack,
  Anchor,
} from "@mantine/core";
import { IconLayoutKanban } from "@tabler/icons-react";
import { useLocation, useSubmit } from "react-router-dom";
import { useEffect, useState } from "react";
import { Form, Link, useActionData } from "react-router-dom";
import { displayNotifications } from "../../utilities/notification/displayNotifications";
import { useNavigate } from "react-router-dom";
import { WELCOME_TEXT } from "../../constants/string";
import { AuthLayout } from "../AuthLayout/AuthLayout";
import { validateEmail } from "../../utilities/verification/emailVerification";
export const Login = () => {
  return (
    <>
      <AuthLayout children={<LoginBody />} />
    </>
  );
};

const LoginBody = () => {
  const actionData = useActionData();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginId || !password) {
      displayNotifications("Error", "Please fill in all fields", "red");
      return;
    }
    const formData = new FormData(e.currentTarget);
    formData.delete("email");
    formData.delete("password");
    formData.append("password", password.trim());
    if (validateEmail(loginId, false)) {
      formData.append("email", loginId.trim());
    } else {
      formData.append("username", loginId.trim());
    }

    submit(formData, { method: "POST", encType: "multipart/form-data" });
  };

  useEffect(() => {
    setIsSubmitting(false);
    if (!actionData) return;
    if (actionData.error) {
      displayNotifications("Login error", actionData.error, "red");
    } else {
      displayNotifications("Login", "Welcome back ", "green");
      navigate("/");
    }
  }, [actionData]);

  return (
    <>
      <Stack gap="lg">
        <Stack align="center" gap="xs">
          <ThemeIcon size={64} radius="xl" variant="light" color="blue">
            <IconLayoutKanban size={32} />
          </ThemeIcon>

          <Title order={2}>CollabBoard</Title>

          <Text c="dimmed" size="sm" ta="center">
            Real-time collaboration made simple
          </Text>
        </Stack>

        <Divider />

        <Stack gap={4}>
          <Title ta="center" order={3}>
            Welcome Back
          </Title>

          <Text ta="center" c="dimmed" size="sm">
            Sign in to continue collaborating
          </Text>
        </Stack>

        <Form method="post" onSubmit={handleLogin}>
          <Stack gap="md">
            <TextInput
              label="Email or Username"
              placeholder="Sign in with your email or username"
              name="email"
              radius="md"
              variant="filled"
              size="md"
              required
              onChange={(e) => setLoginId(e.target.value)}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              name="password"
              radius="md"
              variant="filled"
              size="md"
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              fullWidth
              radius="md"
              size="md"
              mt="xs"
              type="submit"
              onClick={() => setIsSubmitting(true)}
            >
              {isSubmitting ? <Loader size="xs" /> : "Sign In"}
            </Button>
          </Stack>
        </Form>

        <Text ta="center" c="dimmed" size="sm">
          Don't have an account?{" "}
          <Anchor component={Link} to="/signup">
            Create one
          </Anchor>
        </Text>
      </Stack>
    </>
  );
};
