import { deleteUser, updateUser } from "../../api/user";

export const userProfileAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "update-profile": {
      const userId = formData.get("userId") as string;
      const username = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string | null;
      const file = formData.get("profilePic");

      const payload: Record<string, string> = {
        username,
        email,
      };

      if (password && password.trim() !== "") {
        payload.password = password;
      }

      if (file instanceof File && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        const base64 = btoa(binary);
        payload.profilepic = `data:${file.type};base64,${base64}`;
      }

      return updateUser(userId, payload);
    }

    case "delete-account": {
      const userId = formData.get("userId") as string;
      return deleteUser(userId);
    }

    default:
      throw new Error(`Unhandled intent: ${intent}`);
  }
};
