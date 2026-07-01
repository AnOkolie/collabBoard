import {
  Text,
  PasswordInput,
  Button,
  TextInput,
  Title,
  Anchor,
  Group,
  Divider,
  ThemeIcon,
  Stack,
  Checkbox,
} from "@mantine/core";
import { Loader } from "@mantine/core";
import { act, useEffect, useState } from "react";
import { Form, Link, useActionData } from "react-router-dom";
import { displayNotifications } from "../../utilities/notification/displayNotifications";
import { useNavigate } from "react-router-dom";
import { SIGN_UP_BUTTON_TEXT } from "../../constants/string";
import { IconLayoutKanban } from "@tabler/icons-react";
import { AuthLayout } from "../AuthLayout/AuthLayout";
import { error } from "node:console";
export const Signup = () => {
  return (
    <>
      <AuthLayout children={<SignupBody />} />
    </>
  );
};

const SignupBody = () => {
  const actionData = useActionData();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const passwordLen = 8;
  const checkRules = (value: string) => ({
    hasDigit: /\d/.test(value),
    hasLowercase: /[a-z]/.test(value),
    hasSpecial: /[@#$%^&*()\-_+=]/.test(value),
    hasUppercase: /[A-Z]/.test(value),
    matchesLen: value.length > passwordLen,
  });
  const rules = checkRules(password1);
  const handleClick = (e: React.SubmitEvent<HTMLFormElement>) => {
    if (!email || !name || !password1) {
      e.preventDefault();
      displayNotifications("Error", "Please fill in all fields", "red");
      return;
    }
  };

  useEffect(() => {
    setIsSubmitting(false);
    if (!actionData) return;
    if (actionData.error) {
      displayNotifications("Signup Error", actionData.error.error, "red");
    } else {
      displayNotifications("Success", "Account created successfully", "green");
      navigate("/");
    }
  }, [actionData]);
  return (
    <>
      <Stack align="center" mb="lg">
        <ThemeIcon size={60} radius="xl" variant="light" color="blue">
          <IconLayoutKanban size={30} />
        </ThemeIcon>

        <Title order={1}>CollabBoard</Title>

        <Text c="dimmed" ta="center">
          Real-time collaboration made simple
        </Text>
      </Stack>
      <Divider my="md" />
      <Title ta="center" order={2}>
        Create Account
      </Title>

      <Text c="dimmed" ta="center">
        Get started with your workspace today
      </Text>
      <Text size="sm" c={rules.matchesLen ? "green" : "dimmed"}>
        ✓ Minimum 8 characters
      </Text>
      <Form method="post" onSubmit={handleClick}>
        <Stack>
          <TextInput
            label="Username"
            name="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            radius="md"
            variant="filled"
            size="md"
          />
          <TextInput
            label="Email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@gmail.com"
            radius="md"
            variant="filled"
            size="md"
            required
          />
          <PasswordInput
            label="Create Password"
            mt="md"
            name="password"
            onChange={(e) => setPassword1(e.target.value)}
            placeholder="Create a password"
            radius="md"
            variant="filled"
            size="md"
            required
          />
          <PasswordInput
            fw={600}
            label="Confirm Password"
            mt="md"
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Confirm your password"
            radius="md"
            variant="filled"
            size="md"
            required
          />
          <Group justify="space-between" mt="lg">
            <Checkbox
              label={
                <>
                  I agree to the{" "}
                  <Anchor size="sm" href="/terms">
                    Terms of Service
                  </Anchor>{" "}
                  and{" "}
                  <Anchor size="sm" href="/privacy">
                    Privacy Policy
                  </Anchor>
                </>
              }
              required
            />
          </Group>
          <Button
            fullWidth
            radius="md"
            size="md"
            color="blue"
            type="submit"
            onClick={() => setIsSubmitting(true)}
          >
            {isSubmitting ? <Loader size="xs" /> : "Create Account"}
          </Button>
        </Stack>
      </Form>
      <Text ta="center" c="dimmed" size="sm">
        Already have an account?{" "}
        <Anchor component={Link} to="/login">
          Sign in
        </Anchor>
      </Text>
    </>
  );
};
