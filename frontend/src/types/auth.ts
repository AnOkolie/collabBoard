import { userObject } from "./user";

export type LoginResponse = {
  message: string;
  token: string;
  user: userObject;
};

export type checkAuthResponse = {
  message: string;
  user: userObject;
};
