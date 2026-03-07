import {
  Avatar,
  Button,
  Card,
  Container,
  Flex,
  Modal,
  Paper,
  TextInput,
  Text,
  Input,
} from "@mantine/core";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useDisclosure } from "@mantine/hooks";
import { Form, useActionData, useSubmit } from "react-router";
import { use, useEffect, useState } from "react";
import {
  SIGN_UP_RULE_1,
  SIGN_UP_RULE_2,
  SIGN_UP_RULE_3,
  SIGN_UP_RULE_4,
  SIGN_UP_RULE_5,
} from "../../constants/string";

export const UserProfile = () => {
  const { username, email, id } = useAuthStore.getState().authUser || {};
  const [passwordChangeOpened, passwordChangeHandlers] = useDisclosure(false);
  const [passwordChange, setPasswordChange] = useState("");
  const [confirmPasswordChange, setConfirmPasswordChange] = useState("");
  const [userName, setUserName] = useState(username || "");
  const [userEmail, setUserEmail] = useState(email || "");
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [intent, setIntent] = useState("");
  const submit = useSubmit();
  const actionData = useActionData();
  const passwordLen = 8;
  const checkRules = (value: string) => ({
    hasDigit: /\d/.test(value),
    hasLowercase: /[a-z]/.test(value),
    hasSpecial: /[@#$%^&*()\-_+=]/.test(value),
    hasUppercase: /[A-Z]/.test(value),
    matchesLen: value.length > passwordLen,
    passwordChangesMatch: value.length !== 0 && value === confirmPasswordChange,
  });
  const rules = checkRules(passwordChange);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    formdata.delete("Name");
    formdata.delete("Email");
    formdata.append("name", userName);
    formdata.append("email", userEmail);
    formdata.append("intent", intent);
    if (passwordChanged) {
      formdata.append("password", passwordChange);
    }
    console.log(Array.from(formdata.entries()));
    setIntent(""); // Reset intent after submission
    submit(formdata, { method: "post" });
  };

  useEffect(() => {
    if (!actionData) return;
    if (actionData.message === "User deleted successfully") {
    }
    const user = actionData.data;
    useAuthStore.setState({ authUser: { ...user, password: undefined } });
    if (actionData.ok) {
      // Handle successful update or deletion (e.g., show a success message, redirect, etc.)
      console.log("actionData.data:", actionData.data);
    }
  }, [actionData]);

  return (
    <Container>
      <Modal
        opened={passwordChangeOpened}
        onClose={passwordChangeHandlers.close}
      >
        <Paper mt={10} p={22} radius="lg" withBorder>
          <Text c={rules.matchesLen ? "green" : "red"}>{SIGN_UP_RULE_1}</Text>
        </Paper>
        <TextInput
          label="New Password"
          type="password"
          onChange={(e) => {
            setPasswordChange(e.target.value);
          }}
        />
        <TextInput
          label="Confirm New Password"
          type="password"
          onChange={(e) => {
            setConfirmPasswordChange(e.target.value);
          }}
        />
        <Text c={rules.passwordChangesMatch ? "green" : "red"}>
          {rules.passwordChangesMatch
            ? "Passwords match"
            : "Passwords do not match"}
        </Text>
        <Button mt="md" onClick={() => setPasswordChanged(true)}>
          Change Password
        </Button>
      </Modal>
      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Card>
          <Flex>
            <Form method="post" onSubmit={handleSubmit}>
              <Input type="hidden" value={id} name="userId" />
              <Avatar
                src="https://avatars.githubusercontent.com/u/12345678?v=4"
                size={120}
                radius={60}
              />
              <TextInput
                label="Name"
                defaultValue={username || "John Doe"}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
              <TextInput
                label="Email"
                defaultValue={email || "john.doe@example.com"}
                onChange={(e) => {
                  setUserEmail(e.target.value);
                }}
              />
              <Flex direction={"row"} gap="md">
                <Button variant="outline" onClick={passwordChangeHandlers.open}>
                  Change Password
                </Button>
              </Flex>
              <Flex direction={"row"} gap="md" justify="flex-end">
                <Button
                  mt="md"
                  name="intent"
                  value="update-profile"
                  type="submit"
                  onClick={() => setIntent("update-profile")}
                >
                  Update Profile
                </Button>
                <Button
                  mt="md"
                  color="red"
                  name="intent"
                  value="delete-account"
                  type="submit"
                  onClick={() => setIntent("delete-account")}
                >
                  Delete Account
                </Button>
              </Flex>
            </Form>
          </Flex>
        </Card>
      </Paper>
    </Container>
  );
};
