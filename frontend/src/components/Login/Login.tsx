import { Text, PasswordInput, Button, TextInput, Loader } from "@mantine/core";
import { use, useEffect, useState } from "react";
import { Form, useActionData } from "react-router-dom";
import { displayNotifications } from "../../utilities/displayNotifications";
import { useNavigate } from "react-router-dom";
export const Login = () => {
  const actionData = useActionData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
    } else {
      navigate("/");
    }
  }, [actionData]);
  return (
    <div className="login">
      <h1>Login</h1>
      <Form method="post" onSubmit={handleLogin} className="login-form">
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
          required
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">
          {isSubmitting ? <Loader size="xs" /> : "Login"}
        </Button>
      </Form>
    </div>
  );
};
