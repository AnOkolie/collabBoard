import { displayNotifications } from "../notification/displayNotifications";

//StackOverflow: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
export const validateEmail = (email: string, display = true): boolean => {
  return validEmailFormat(email, display);
};

const validEmailFormat = (email: string, display: boolean) => {
  if (
    email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
  ) {
    return true;
  }
  if (display) {
    displayNotifications("Mismatch", "Provide a valid email", "red");
  }
  return false;
};
