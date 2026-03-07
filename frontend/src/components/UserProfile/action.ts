import { deleteUser, updateUser } from "../../api/user";

export const userProfileAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  console.log(
    "form data received in action:",
    Object.fromEntries(formData.entries()),
  );

  switch (intent) {
    case "update-profile":
      // Handle profile update logic
      return updateUser(formData.get("userId") as string, {
        username: formData.get("name") as string,
        email: formData.get("email") as string,
      });
    case "delete-account":
      // Handle account deletion logic
      return deleteUser(formData.get("userId") as string);
    default:
      throw new Error(`Unhandled intent: ${intent}`);
  }
};
