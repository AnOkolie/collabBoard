import {
  Text,
  PasswordInput,
  Button,
  TextInput,
  Loader,
  Container,
  Paper,
  Center,
  Card,
  Title,
  Stack,
} from "@mantine/core";
import { use, useEffect, useState } from "react";
import { Form, useActionData } from "react-router-dom";
import { displayNotifications } from "../../utilities/displayNotifications";
import { useNavigate } from "react-router-dom";
import { WELCOME_TEXT } from "../../constants/string";
export const Login = () => {
  const actionData = useActionData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
    if (!email || !password) {
      e.preventDefault();
      displayNotifications("Error", "Please fill in all fields", "red");
      return;
    }
    setIsSubmitting(true);
  };

  useEffect(() => {
    setIsSubmitting(false);
    if (!actionData) return;
    if (actionData.error) {
      console.log(actionData);
      displayNotifications("Login error", actionData.error.error, "red");
    } else {
      navigate("/");
    }
  }, [actionData]);
  return (
    <Container fluid p="xl">
      <Center h="80vh">
        <Stack gap="md">
          <Title fw={700}>{WELCOME_TEXT}</Title>
          <Card
            w={420}
            radius="lg"
            shadow="lg"
            p="xl"
            withBorder
            style={{
              background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
            }}
          >
            <Stack gap="md">
              <Title order={2} ta="center">
                Login
              </Title>

              <Form method="post" onSubmit={handleLogin}>
                <Stack gap="md">
                  <TextInput
                    label="Email"
                    placeholder="Enter your email"
                    name="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <PasswordInput
                    label="Password"
                    placeholder="Enter your password"
                    name="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <Button fullWidth type="submit" color="purple" mt="sm">
                    {isSubmitting ? <Loader size="xs" /> : "Login"}
                  </Button>
                </Stack>
              </Form>
            </Stack>
          </Card>
        </Stack>
      </Center>
    </Container>
  );
};
