import {
  Text,
  PasswordInput,
  Button,
  TextInput,
  Title,
  Box,
  Container,
  Paper,
  Anchor,
  Group,
  Checkbox,
} from "@mantine/core";
import { use, useEffect, useState } from "react";
import { Form, useActionData } from "react-router-dom";
import { displayNotifications } from "../../utilities/displayNotifications";
import { useNavigate } from "react-router-dom";
import {
  SIGN_UP_ALREADY_HAVE_ACCOUNT_TEXT,
  SIGN_UP_BUTTON_TEXT,
  SIGN_UP_DESCRIPTION,
  SIGN_UP_HEADER,
  SIGN_UP_RULE_1,
  SIGN_UP_RULE_2,
  SIGN_UP_RULE_3,
  SIGN_UP_RULE_4,
  SIGN_UP_RULE_5,
  SIGN_UP_SIGN_IN_BUTTON_TEXT,
} from "../../constants/string";
import { LOGIN } from "../../constants/routes";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
export const Signup = () => {
  const actionData = useActionData();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
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
    if (!actionData) return;
    if (actionData.error) {
    } else {
      displayNotifications("Success", "Account created successfully", "green");
      navigate("/");
    }
  });

  return (
    <Box
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, #e0f0ff 0%, #4a90e2 100%)",
        backgroundColor: "#f0f0f0",
        display: "flex",
        justifyContent: "center",
        margin: "0",
        minHeight: "center",
        padding: "20px",
      }}
    >
      <Container className="classes.container" my={40} size={420}>
        <Paper mt={30} p={22} radius="lg" withBorder>
          <Text c={rules.matchesLen ? "green" : "red"}>{SIGN_UP_RULE_1}</Text>
        </Paper>
        <Paper mt={30} p={22} radius="lg" withBorder>
          <Title ff="Inter, sans-serif" ta="center">
            {SIGN_UP_HEADER}
          </Title>
          <Text c="dimmed" style={{ textAlign: "center" }}>
            {SIGN_UP_DESCRIPTION}
          </Text>
          <Form method="post" onSubmit={handleClick}>
            <TextInput
              label="Full Name"
              name="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              radius="md"
              required
              variant="filled"
            />
            <TextInput
              label="Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@gmail.com"
              required
              variant="filled"
            />
            <PasswordInput
              label="Create Password"
              mt="md"
              name="password"
              onChange={(e) => setPassword1(e.target.value)}
              placeholder="Create a password"
              required
              variant="filled"
            />
            <PasswordInput
              fw={600}
              label="Confirm Password"
              mt="md"
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="Confirm your password"
              radius="md"
              required
              variant="filled"
            />
            <Group justify="space-between" mt="lg">
              <Checkbox
                fw={700}
                label="I agree to the Terms and Conditions"
                required
                variant="filled"
              />
            </Group>
            <Button fullWidth mt="xl" radius="md" type="submit">
              {SIGN_UP_BUTTON_TEXT}
            </Button>
          </Form>
          <br />
          <Text c="dimmed" style={{ textAlign: "center" }}>
            {SIGN_UP_ALREADY_HAVE_ACCOUNT_TEXT}{" "}
            <Anchor onClick={() => navigate(LOGIN)} styles={{}}>
              {SIGN_UP_SIGN_IN_BUTTON_TEXT}
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </Box>
  );
};
