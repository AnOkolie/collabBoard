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
  FileInput,
  Stack,
} from "@mantine/core";
import { useAuthStore } from "../../zustand/authStore/useAuthStore";
import { useDisclosure } from "@mantine/hooks";
import { Form, useActionData, useSubmit } from "react-router-dom";
import { useEffect, useState } from "react";
import { SIGN_UP_RULE_1 } from "../../constants/string";
import { IconPencil } from "@tabler/icons-react";

export const UserProfile = () => {
  const authUser = useAuthStore((s) => s.authUser);
  const { username, email, id, profilepic } = authUser || {};

  const [passwordChangeOpened, passwordChangeHandlers] = useDisclosure(false);
  const [passwordChange, setPasswordChange] = useState("");
  const [confirmPasswordChange, setConfirmPasswordChange] = useState("");
  const [userName, setUserName] = useState(username || "");
  const [userEmail, setUserEmail] = useState(email || "");
  const [intent, setIntent] = useState<
    "update-profile" | "delete-account" | ""
  >("");
  const [preview, setPreview] = useState<string | null>(profilepic || null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [includePassword, setIncludePassword] = useState(false);

  const submit = useSubmit();
  const actionData = useActionData() as any;

  const passwordLen = 8;

  const checkRules = (value: string) => ({
    hasDigit: /\d/.test(value),
    hasLowercase: /[a-z]/.test(value),
    hasSpecial: /[@#$%^&*()\-_+=]/.test(value),
    hasUppercase: /[A-Z]/.test(value),
    matchesLen: value.length >= passwordLen,
    passwordChangesMatch: value.length !== 0 && value === confirmPasswordChange,
  });

  const rules = checkRules(passwordChange);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    if (imgFile) {
      formData.set("profilePic", imgFile);
    } else {
      formData.delete("profilePic");
    }

    if (includePassword && passwordChange.trim()) {
      formData.set("password", passwordChange);
    } else {
      formData.delete("password");
    }
    formData.append("username", userName);
    formData.append("email", userEmail);
    formData.append("intent", intent);
    if (includePassword) {
      formData.append("password", passwordChange);
    }

    submit(formData, { method: "post", encType: "multipart/form-data" });
  };

  const handleImagePreview = (file: File | null) => {
    if (!file) {
      setImgFile(null);
      return;
    }

    setImgFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordConfirm = () => {
    if (!rules.matchesLen || !rules.passwordChangesMatch) return;
    setIncludePassword(true);
    passwordChangeHandlers.close();
  };

  return (
    <Container size="sm">
      <Modal
        opened={passwordChangeOpened}
        onClose={passwordChangeHandlers.close}
        title="Change password"
      >
        <Stack>
          <Paper mt={10} p={22} radius="lg" withBorder>
            <Text c={rules.matchesLen ? "green" : "red"}>{SIGN_UP_RULE_1}</Text>
          </Paper>

          <TextInput
            label="New Password"
            type="password"
            value={passwordChange}
            onChange={(e) => setPasswordChange(e.currentTarget.value)}
          />

          <TextInput
            label="Confirm New Password"
            type="password"
            value={confirmPasswordChange}
            onChange={(e) => setConfirmPasswordChange(e.currentTarget.value)}
          />

          <Text c={rules.passwordChangesMatch ? "green" : "red"}>
            {rules.passwordChangesMatch
              ? "Passwords match"
              : "Passwords do not match"}
          </Text>

          <Button mt="md" onClick={handlePasswordConfirm}>
            Confirm Password Change
          </Button>
        </Stack>
      </Modal>

      <Paper shadow="sm" p="lg" radius="md" withBorder>
        <Card>
          <Form
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
          >
            <Input type="hidden" value={id || ""} name="userId" />
            <Input
              type="hidden"
              value={includePassword ? "true" : "false"}
              name="includePassword"
            />

            <Stack gap="lg">
              <Flex align="center" gap="md">
                <Avatar
                  src={preview || "./avatar.png"}
                  size={120}
                  radius={60}
                />

                <Button
                  component="label"
                  variant="outline"
                  leftSection={<IconPencil />}
                >
                  Change picture
                  <input
                    hidden
                    type="file"
                    name="profilePic"
                    accept="image/*"
                    onChange={(e) =>
                      handleImagePreview(e.target.files?.[0] || null)
                    }
                  />
                </Button>
              </Flex>

              <TextInput
                label="Name"
                name="name"
                value={userName}
                onChange={(e) => setUserName(e.currentTarget.value)}
              />

              <TextInput
                label="Email"
                name="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.currentTarget.value)}
              />

              <Flex gap="md">
                <Button variant="outline" onClick={passwordChangeHandlers.open}>
                  Change Password
                </Button>
              </Flex>

              <Flex gap="md" justify="flex-end">
                <Button
                  mt="md"
                  name="intent"
                  value="update-profile"
                  type="submit"
                  onClick={() => {
                    setIntent("update-profile");
                  }}
                >
                  Update Profile
                </Button>

                <Button
                  mt="md"
                  color="red"
                  name="intent"
                  value="delete-account"
                  type="submit"
                  onClick={() => {
                    setIntent("delete-account");
                  }}
                >
                  Delete Account
                </Button>
              </Flex>
            </Stack>
          </Form>
        </Card>
      </Paper>
    </Container>
  );
};
